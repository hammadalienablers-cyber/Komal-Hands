-- 1. Add user_id column to orders table
alter table public.orders 
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists idx_orders_user_id on public.orders(user_id);

-- 2. Create customer profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text default '',
  phone text default '',
  city text default '',
  address text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Profiles RLS Policies
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

grant select, insert, update on public.profiles to authenticated;
grant select on public.profiles to anon;

-- 3. Update orders RLS policy
drop policy if exists "Orders are viewable only by admin" on public.orders;
drop policy if exists "Orders are viewable by admin or owner" on public.orders;
create policy "Orders are viewable by admin or owner"
  on public.orders for select
  using (
    public.is_admin() or (auth.uid() is not null and user_id = auth.uid())
  );

-- 4. Update place_order function to record user_id and profile
create or replace function public.place_order(
  p_customer_name text,
  p_email text,
  p_phone text,
  p_city text,
  p_address text,
  p_postal_code text default null,
  p_notes text default null,
  p_items jsonb default '[]'::jsonb,
  p_coupon_code text default null,
  p_payment_method text default 'cod',
  p_payment_reference text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item jsonb;
  v_prod record;
  v_item_product_id text;
  v_item_qty int;
  v_item_color text;
  v_subtotal numeric(10,2) := 0;
  v_discount numeric(10,2) := 0;
  v_shipping numeric(10,2) := 0;
  v_total numeric(10,2) := 0;
  v_free_thresh numeric(10,2);
  v_std_fee numeric(10,2);
  v_coupon_eval jsonb;
  v_coupon_valid boolean := false;
  v_coupon_free_ship boolean := false;
  v_order_items jsonb := '[]'::jsonb;
  v_order_id text;
  v_tracking_no text;
  v_initial_timeline jsonb;
  v_now_str text;
  v_normalized_phone text;
  v_clean_method text;
  v_payment_status text;
  v_recent_order_count int;
  v_sorted_product_ids text[];
  v_user_id uuid;
begin
  v_user_id := auth.uid();

  if p_customer_name is null or length(trim(p_customer_name)) < 2 then
    raise exception 'Customer name is required (minimum 2 characters).';
  elsif length(trim(p_customer_name)) > 100 then
    raise exception 'Customer name must be at most 100 characters.';
  end if;

  v_normalized_phone := public.normalize_pk_phone(p_phone);
  if v_normalized_phone is null or v_normalized_phone !~ '^03[0-9]{9}$' then
    raise exception 'Invalid Pakistani mobile number "%". Please provide an 11-digit mobile number in the format 03XXXXXXXXX.', coalesce(p_phone, '');
  end if;

  if p_address is null or length(trim(p_address)) < 5 then
    raise exception 'Complete street delivery address is required (minimum 5 characters).';
  elsif length(trim(p_address)) > 300 then
    raise exception 'Delivery address must be at most 300 characters.';
  end if;

  if p_city is null or length(trim(p_city)) < 2 then
    raise exception 'Delivery city is required.';
  elsif length(trim(p_city)) > 60 then
    raise exception 'Delivery city must be at most 60 characters.';
  end if;

  select count(*) into v_recent_order_count
  from public.orders
  where phone = v_normalized_phone and created_at > (now() - interval '1 hour');

  if v_recent_order_count >= 5 then
    raise exception 'Order limit reached: Maximum 5 orders per hour allowed for this phone number.';
  end if;

  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Cart is empty.';
  end if;

  v_clean_method := lower(trim(coalesce(p_payment_method, 'cod')));
  if v_clean_method not in ('cod', 'jazzcash_easypaisa') then
    v_clean_method := 'cod';
  end if;
  v_payment_status := 'pending';

  select array_agg(distinct (item->>'product_id') order by (item->>'product_id') asc)
  into v_sorted_product_ids
  from jsonb_array_elements(p_items) as item
  where (item->>'product_id') is not null;

  perform 1 from public.products where id = any(v_sorted_product_ids) order by id asc for update;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_item_product_id := v_item->>'product_id';
    v_item_qty := (v_item->>'quantity')::int;
    v_item_color := coalesce(v_item->>'color', 'Standard');

    select * into v_prod from public.products where id = v_item_product_id;
    if not found or not v_prod.in_stock or v_prod.stock_count < v_item_qty then
      raise exception 'Item is out of stock or insufficient quantity.';
    end if;

    update public.products
    set stock_count = stock_count - v_item_qty,
        in_stock = (stock_count - v_item_qty > 0)
    where id = v_prod.id;

    v_subtotal := v_subtotal + (v_prod.price * v_item_qty);

    v_order_items := v_order_items || jsonb_build_object(
      'product', jsonb_build_object('id', v_prod.id, 'name', v_prod.name, 'price', v_prod.price, 'images', v_prod.images),
      'quantity', v_item_qty,
      'selectedColor', v_item_color
    );
  end loop;

  if p_coupon_code is not null and length(trim(p_coupon_code)) > 0 then
    v_coupon_eval := public.evaluate_coupon(p_coupon_code, v_subtotal);
    v_coupon_valid := coalesce((v_coupon_eval->>'valid')::boolean, false);
    if v_coupon_valid then
      v_discount := coalesce((v_coupon_eval->>'discount')::numeric, 0);
      v_coupon_free_ship := coalesce((v_coupon_eval->>'free_shipping')::boolean, false);
      update public.coupons set used_count = used_count + 1 where upper(code) = upper(trim(p_coupon_code));
    end if;
  end if;

  select free_shipping_threshold, standard_shipping_fee into v_free_thresh, v_std_fee from public.store_settings where id = 1;
  if v_subtotal >= coalesce(v_free_thresh, 2000) or v_coupon_free_ship then
    v_shipping := 0;
  else
    v_shipping := coalesce(v_std_fee, 200);
  end if;

  v_total := greatest(0, v_subtotal + v_shipping - v_discount);

  loop
    v_order_id := 'KA-' || lpad((floor(random() * 90000) + 10000)::text, 5, '0');
    exit when not exists (select 1 from public.orders where id = v_order_id);
  end loop;

  v_tracking_no := 'TRX-' || lpad((floor(random() * 900000000) + 100000000)::text, 9, '0') || 'PK';
  v_now_str := to_char(now() at time zone 'Asia/Karachi', 'DD Mon YYYY, HH12:MI AM');

  v_initial_timeline := jsonb_build_array(
    jsonb_build_object('status', 'placed', 'label', 'Order Placed & Confirmed', 'description', 'Order confirmed.', 'timestamp', v_now_str, 'completed', true, 'current', true),
    jsonb_build_object('status', 'packed', 'label', 'Quality Checked & Gift Packed', 'description', 'Items wrapped with gift ribbon.', 'timestamp', 'Pending packaging', 'completed', false, 'current', false),
    jsonb_build_object('status', 'dispatched', 'label', 'Dispatched with Courier', 'description', 'Courier assigned on dispatch.', 'timestamp', 'Scheduled next morning', 'completed', false, 'current', false),
    jsonb_build_object('status', 'out_for_delivery', 'label', 'Out for Delivery in ' || trim(p_city), 'description', 'Local rider assigned for doorstep delivery.', 'timestamp', 'Pending dispatch', 'completed', false, 'current', false),
    jsonb_build_object('status', 'delivered', 'label', 'Delivered & Signed', 'description', 'Package delivered.', 'timestamp', 'Pending delivery', 'completed', false, 'current', false)
  );

  insert into public.orders (
    id, user_id, customer_name, email, phone, city, address, postal_code, notes, payment_reference,
    items, subtotal, shipping, discount, total, payment_method, payment_status, courier_name, tracking_number, order_status, timeline, estimated_delivery
  ) values (
    v_order_id, v_user_id, trim(p_customer_name), nullif(trim(coalesce(p_email, '')), ''), v_normalized_phone,
    trim(p_city), trim(p_address), nullif(trim(coalesce(p_postal_code, '')), ''), nullif(trim(coalesce(p_notes, '')), ''),
    nullif(trim(coalesce(p_payment_reference, '')), ''), v_order_items, v_subtotal, v_shipping, v_discount, v_total,
    v_clean_method, v_payment_status, null, v_tracking_no, 'placed', v_initial_timeline, 'Within 2-3 Business Days'
  );

  if v_user_id is not null then
    insert into public.profiles (id, full_name, phone, city, address, updated_at)
    values (v_user_id, trim(p_customer_name), v_normalized_phone, trim(p_city), trim(p_address), now())
    on conflict (id) do update set
      full_name = coalesce(nullif(excluded.full_name, ''), public.profiles.full_name),
      phone = coalesce(nullif(excluded.phone, ''), public.profiles.phone),
      city = coalesce(nullif(excluded.city, ''), public.profiles.city),
      address = coalesce(nullif(excluded.address, ''), public.profiles.address),
      updated_at = now();
  end if;

  return jsonb_build_object(
    'success', true, 'order_id', v_order_id, 'user_id', v_user_id, 'tracking_number', v_tracking_no,
    'customer_name', trim(p_customer_name), 'phone', v_normalized_phone, 'city', trim(p_city),
    'address', trim(p_address), 'subtotal', v_subtotal, 'shipping', v_shipping, 'discount', v_discount,
    'total', v_total, 'payment_method', v_clean_method, 'payment_status', v_payment_status,
    'items', v_order_items, 'timeline', v_initial_timeline
  );
end;
$$;
