-- ==============================================================================
-- KOMAL ACCESSORIES — PRODUCTION DATABASE SCHEMA & SECURITY POLICIES (SUPABASE)
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. CATEGORIES TABLE
create table if not exists public.categories (
  id text primary key,
  label text not null,
  description text,
  created_at timestamptz not null default now()
);

-- 3. PRODUCTS TABLE
create table if not exists public.products (
  id text primary key,
  name text not null,
  category text references public.categories(id) on delete set null,
  category_label text not null default '',
  price numeric(10,2) not null check (price >= 0),
  original_price numeric(10,2) not null default 0,
  rating numeric(3,2) not null default 5.0,
  review_count int not null default 0,
  badge text,
  images jsonb not null default '[]'::jsonb,
  description text not null default '',
  specs jsonb not null default '{}'::jsonb,
  features jsonb not null default '[]'::jsonb,
  colors jsonb not null default '[]'::jsonb,
  in_stock boolean not null default true,
  stock_count int not null default 10 check (stock_count >= 0),
  is_bestseller boolean not null default false,
  is_new boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. COUPONS TABLE
create table if not exists public.coupons (
  code text primary key,
  discount_type text not null check (discount_type in ('percentage', 'fixed', 'freeship')),
  discount_value numeric(10,2) not null default 0 check (discount_value >= 0),
  min_order_value numeric(10,2) not null default 0 check (min_order_value >= 0),
  free_shipping boolean not null default false,
  expires_at timestamptz default null,
  max_uses int default null check (max_uses is null or max_uses > 0),
  used_count int not null default 0 check (used_count >= 0),
  is_active boolean not null default true,
  description text,
  created_at timestamptz not null default now()
);

-- 5. STORE SETTINGS TABLE (Single row)
create table if not exists public.store_settings (
  id int primary key default 1 check (id = 1),
  store_name text not null default 'Komal Accessories',
  tagline text not null default 'Premium boutique for hair accessories, cute jewelry & gift hampers',
  phone text not null default '+92 300 1234567',
  whatsapp text not null default '923001234567',
  email text not null default 'support@komalaccessories.com',
  address text not null default 'Komal Boutique Studio, MM Alam Road, Gulberg III, Lahore, Pakistan',
  free_shipping_threshold numeric(10,2) not null default 2000,
  standard_shipping_fee numeric(10,2) not null default 200,
  announcement_text text not null default 'Free Express Delivery on orders over Rs. 2,000 | 100% Cash on Delivery across Pakistan',
  updated_at timestamptz not null default now()
);

-- 6. ORDERS TABLE
create table if not exists public.orders (
  id text primary key,
  customer_name text not null,
  email text,
  phone text not null,
  city text not null,
  address text not null,
  postal_code text,
  notes text,
  payment_reference text default null,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(10,2) not null check (subtotal >= 0),
  shipping numeric(10,2) not null check (shipping >= 0),
  discount numeric(10,2) not null default 0 check (discount >= 0),
  total numeric(10,2) not null check (total >= 0),
  payment_method text not null,
  payment_status text not null default 'pending',
  courier_name text default null,
  tracking_number text not null,
  order_status text not null default 'placed' check (order_status in ('placed', 'packed', 'dispatched', 'out_for_delivery', 'delivered', 'cancelled')),
  timeline jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  estimated_delivery text not null default 'Within 2-3 Business Days'
);

-- 7. ADMINS TABLE (Links to auth.users)
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text default '',
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------------------
-- QUICK ADMIN SETUP SNIPPET:
-- After creating your admin user in Supabase (Authentication -> Users -> Add User),
-- copy their User UID and execute this command in the SQL Editor to grant full admin permissions:
--
-- insert into public.admins (user_id) values ('PASTE_AUTH_USER_ID_HERE');
-- ------------------------------------------------------------------------------

-- ==============================================================================
-- 8. HELPER SECURITY FUNCTIONS
-- ==============================================================================

-- Check if current authenticated user is an authorized admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

-- Phone Normalizer: Normalizes Pakistani mobile numbers to 11-digit 03XXXXXXXXX format
create or replace function public.normalize_pk_phone(p_raw text)
returns text
language plpgsql
immutable
as $$
declare
  v_digits text;
begin
  if p_raw is null then
    return null;
  end if;
  v_digits := regexp_replace(p_raw, '\D', '', 'g');
  if length(v_digits) = 12 and v_digits like '92%' then
    v_digits := '0' || substring(v_digits from 3);
  elsif length(v_digits) = 14 and v_digits like '0092%' then
    v_digits := '0' || substring(v_digits from 5);
  elsif length(v_digits) = 10 and v_digits like '3%' then
    v_digits := '0' || v_digits;
  end if;
  return v_digits;
end;
$$;

-- Auto trigger for updating products updated_at
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row
execute function public.update_updated_at_column();

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.coupons enable row level security;
alter table public.store_settings enable row level security;
alter table public.orders enable row level security;
alter table public.admins enable row level security;

-- Categories Policies
drop policy if exists "Categories are viewable by everyone" on public.categories;
create policy "Categories are viewable by everyone"
  on public.categories for select
  using (true);

drop policy if exists "Categories are manageable by admin" on public.categories;
create policy "Categories are manageable by admin"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- Products Policies
drop policy if exists "Products are viewable by everyone" on public.products;
create policy "Products are viewable by everyone"
  on public.products for select
  using (true);

drop policy if exists "Products are manageable by admin" on public.products;
create policy "Products are manageable by admin"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

-- Coupons Policies (Anon cannot list all coupons; validation occurs via RPC)
drop policy if exists "Coupons are viewable only by admin" on public.coupons;
create policy "Coupons are viewable only by admin"
  on public.coupons for select
  using (public.is_admin());

drop policy if exists "Coupons are manageable by admin" on public.coupons;
create policy "Coupons are manageable by admin"
  on public.coupons for all
  using (public.is_admin())
  with check (public.is_admin());

-- Store Settings Policies
drop policy if exists "Settings are viewable by everyone" on public.store_settings;
create policy "Settings are viewable by everyone"
  on public.store_settings for select
  using (true);

drop policy if exists "Settings are manageable by admin" on public.store_settings;
create policy "Settings are manageable by admin"
  on public.store_settings for all
  using (public.is_admin())
  with check (public.is_admin());

-- Orders Policies (Anon cannot select orders table; tracking uses track_order RPC)
drop policy if exists "Orders are viewable only by admin" on public.orders;
create policy "Orders are viewable only by admin"
  on public.orders for select
  using (public.is_admin());

drop policy if exists "Orders are manageable by admin" on public.orders;
create policy "Orders are manageable by admin"
  on public.orders for all
  using (public.is_admin())
  with check (public.is_admin());

-- Admins Table Policies (Direct existence check to prevent recursion)
drop policy if exists "Admins viewable by self or admin" on public.admins;
create policy "Admins viewable by self or admin"
  on public.admins for select
  using (
    auth.uid() is not null
    and (
      auth.uid() = user_id
      or exists (select 1 from public.admins a where a.user_id = auth.uid())
    )
  );

drop policy if exists "Admins manageable by admin" on public.admins;
create policy "Admins manageable by admin"
  on public.admins for all
  using (
    auth.uid() is not null
    and exists (select 1 from public.admins a where a.user_id = auth.uid())
  )
  with check (
    auth.uid() is not null
    and exists (select 1 from public.admins a where a.user_id = auth.uid())
  );

-- ==============================================================================
-- 10. SECURITY DEFINER RPC FUNCTIONS
-- ==============================================================================

-- 1. SHARED COUPON EVALUATION (Single source of truth for both validate_coupon & place_order)
create or replace function public.evaluate_coupon(
  p_code text,
  p_subtotal numeric
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_coupon record;
  v_discount numeric(10,2) := 0;
  v_free_shipping boolean := false;
  v_clean_code text;
begin
  if p_code is null or length(trim(p_code)) = 0 then
    return jsonb_build_object(
      'valid', false,
      'message', 'Coupon code cannot be empty.',
      'discount', 0,
      'free_shipping', false
    );
  end if;

  v_clean_code := upper(trim(p_code));

  select * into v_coupon
  from public.coupons
  where upper(code) = v_clean_code
    and is_active = true;

  if not found then
    return jsonb_build_object(
      'valid', false,
      'message', 'Invalid or inactive coupon code.',
      'discount', 0,
      'free_shipping', false
    );
  end if;

  -- Enforce expiration
  if v_coupon.expires_at is not null and now() > v_coupon.expires_at then
    return jsonb_build_object(
      'valid', false,
      'message', 'This coupon code has expired.',
      'discount', 0,
      'free_shipping', false
    );
  end if;

  -- Enforce usage limit
  if v_coupon.max_uses is not null and v_coupon.used_count >= v_coupon.max_uses then
    return jsonb_build_object(
      'valid', false,
      'message', 'This coupon has reached its maximum usage limit.',
      'discount', 0,
      'free_shipping', false
    );
  end if;

  -- Enforce minimum order value
  if coalesce(p_subtotal, 0) < v_coupon.min_order_value then
    return jsonb_build_object(
      'valid', false,
      'message', 'Minimum cart value of Rs. ' || v_coupon.min_order_value || ' is required for this coupon.',
      'discount', 0,
      'free_shipping', false
    );
  end if;

  -- Compute discount
  if v_coupon.discount_type = 'percentage' then
    v_discount := round((coalesce(p_subtotal, 0) * (v_coupon.discount_value / 100.0)), 0);
  elsif v_coupon.discount_type = 'fixed' then
    v_discount := v_coupon.discount_value;
  elsif v_coupon.discount_type = 'freeship' then
    v_discount := 0;
    v_free_shipping := true;
  end if;

  if v_coupon.free_shipping then
    v_free_shipping := true;
  end if;

  -- Cap discount at subtotal
  if v_discount > coalesce(p_subtotal, 0) then
    v_discount := coalesce(p_subtotal, 0);
  end if;

  return jsonb_build_object(
    'valid', true,
    'code', v_coupon.code,
    'discount_type', v_coupon.discount_type,
    'discount_value', v_coupon.discount_value,
    'discount', v_discount,
    'free_shipping', v_free_shipping,
    'description', v_coupon.description,
    'message', 'Coupon applied successfully!'
  );
end;
$$;

-- 2. VALIDATE COUPON RPC (Calls evaluate_coupon)
create or replace function public.validate_coupon(
  p_code text,
  p_subtotal numeric
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  return public.evaluate_coupon(p_code, p_subtotal);
end;
$$;

-- 3. PLACE ORDER (Server-authoritative calculation: never trusts client totals)
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
begin
  -- 1. Validate Customer Name (max 100)
  if p_customer_name is null or length(trim(p_customer_name)) < 2 then
    raise exception 'Customer name is required (minimum 2 characters).';
  elsif length(trim(p_customer_name)) > 100 then
    raise exception 'Customer name must be at most 100 characters.';
  end if;

  -- 2. Validate & Normalize Phone Number (03XXXXXXXXX format)
  v_normalized_phone := public.normalize_pk_phone(p_phone);
  if v_normalized_phone is null or v_normalized_phone !~ '^03[0-9]{9}$' then
    raise exception 'Invalid Pakistani mobile number "%". Please provide an 11-digit mobile number in the format 03XXXXXXXXX.', coalesce(p_phone, '');
  end if;

  -- 3. Validate Delivery Address (max 300)
  if p_address is null or length(trim(p_address)) < 5 then
    raise exception 'Complete street delivery address is required (minimum 5 characters).';
  elsif length(trim(p_address)) > 300 then
    raise exception 'Delivery address must be at most 300 characters.';
  end if;

  -- 4. Validate Delivery City (max 60)
  if p_city is null or length(trim(p_city)) < 2 then
    raise exception 'Delivery city is required.';
  elsif length(trim(p_city)) > 60 then
    raise exception 'Delivery city must be at most 60 characters.';
  end if;

  -- 5. Validate Notes (max 500)
  if p_notes is not null and length(trim(p_notes)) > 500 then
    raise exception 'Delivery notes must be at most 500 characters.';
  end if;

  -- 6. Validate Payment Reference (max 100)
  if p_payment_reference is not null and length(trim(p_payment_reference)) > 100 then
    raise exception 'Payment reference must be at most 100 characters.';
  end if;

  -- 7. Anti-abuse: limit max 5 orders per normalized phone number in 1 hour
  select count(*) into v_recent_order_count
  from public.orders
  where phone = v_normalized_phone
    and created_at > (now() - interval '1 hour');

  if v_recent_order_count >= 5 then
    raise exception 'Order limit reached: Maximum 5 orders per hour allowed for this phone number. Please contact customer care for assistance.';
  end if;

  -- 8. Validate Line Items Count (1 to 20 items)
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Cart is empty. Please add items before checking out.';
  elsif jsonb_array_length(p_items) > 20 then
    raise exception 'Order exceeds maximum allowed line items (max 20).';
  end if;

  -- 9. Normalize payment method
  v_clean_method := lower(trim(coalesce(p_payment_method, 'cod')));
  if v_clean_method not in ('cod', 'jazzcash_easypaisa') then
    v_clean_method := 'cod';
  end if;
  v_payment_status := 'pending';

  -- 10. Deadlock Prevention: Extract and lock products in sorted ID order
  select array_agg(distinct (item->>'product_id') order by (item->>'product_id') asc)
  into v_sorted_product_ids
  from jsonb_array_elements(p_items) as item
  where (item->>'product_id') is not null;

  if v_sorted_product_ids is null or array_length(v_sorted_product_ids, 1) = 0 then
    raise exception 'No valid product IDs provided in items.';
  end if;

  -- Perform row-level lock on all referenced products in deterministic sorted order
  perform 1
  from public.products
  where id = any(v_sorted_product_ids)
  order by id asc
  for update;

  -- 11. Loop through items, validate quantity & stock, decrement stock, and compute subtotal
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_item_product_id := v_item->>'product_id';
    
    -- Quantity check: must be positive integer between 1 and 10
    if (v_item->>'quantity') is null or (v_item->>'quantity') !~ '^[1-9][0-9]*$' then
      raise exception 'Invalid quantity specified for item. Must be a positive integer.';
    end if;
    
    v_item_qty := (v_item->>'quantity')::int;
    if v_item_qty < 1 or v_item_qty > 10 then
      raise exception 'Quantity per item must be between 1 and 10 units.';
    end if;

    v_item_color := coalesce(v_item->>'color', 'Standard');

    -- Retrieve locked product row
    select * into v_prod
    from public.products
    where id = v_item_product_id;

    if not found then
      raise exception 'Product ID "%" was not found in catalog.', v_item_product_id;
    end if;

    -- Reject if marked out of stock or insufficient stock
    if not v_prod.in_stock or v_prod.stock_count <= 0 then
      raise exception 'Item "%" is currently out of stock.', v_prod.name;
    end if;

    if v_prod.stock_count < v_item_qty then
      raise exception 'Item "%" only has % units in stock. Please adjust quantity.', v_prod.name, v_prod.stock_count;
    end if;

    -- Decrement stock in database
    update public.products
    set stock_count = stock_count - v_item_qty,
        in_stock = (stock_count - v_item_qty > 0)
    where id = v_prod.id;

    -- Recompute subtotal strictly from DB price
    v_subtotal := v_subtotal + (v_prod.price * v_item_qty);

    -- Build snapshot item
    v_order_items := v_order_items || jsonb_build_object(
      'product', jsonb_build_object(
        'id', v_prod.id,
        'name', v_prod.name,
        'price', v_prod.price,
        'originalPrice', v_prod.original_price,
        'categoryLabel', v_prod.category_label,
        'images', v_prod.images
      ),
      'quantity', v_item_qty,
      'selectedColor', v_item_color
    );
  end loop;

  -- 12. Verify that at least one valid line item was added and subtotal > 0
  if v_subtotal <= 0 or jsonb_array_length(v_order_items) = 0 then
    raise exception 'Order rejected: No valid products were added or subtotal is zero.';
  end if;

  -- 13. Evaluate coupon via shared server function
  if p_coupon_code is not null and length(trim(p_coupon_code)) > 0 then
    v_coupon_eval := public.evaluate_coupon(p_coupon_code, v_subtotal);
    v_coupon_valid := coalesce((v_coupon_eval->>'valid')::boolean, false);

    if v_coupon_valid then
      v_discount := coalesce((v_coupon_eval->>'discount')::numeric, 0);
      v_coupon_free_ship := coalesce((v_coupon_eval->>'free_shipping')::boolean, false);

      -- Record usage on coupon
      update public.coupons
      set used_count = used_count + 1
      where upper(code) = upper(trim(p_coupon_code));
    else
      -- Unknown or expired coupon code gives ZERO discount and ZERO free shipping benefit
      v_discount := 0;
      v_coupon_free_ship := false;
    end if;
  end if;

  -- 14. Shipping rate calculation from store settings
  select free_shipping_threshold, standard_shipping_fee
  into v_free_thresh, v_std_fee
  from public.store_settings
  where id = 1;

  if not found then
    v_free_thresh := 2000;
    v_std_fee := 200;
  end if;

  if v_subtotal >= v_free_thresh or v_coupon_free_ship then
    v_shipping := 0;
  else
    v_shipping := v_std_fee;
  end if;

  -- Calculate final total (guaranteed non-negative)
  v_total := greatest(0, v_subtotal + v_shipping - v_discount);

  -- 15. Generate unique Order ID (KA-XXXXX) and Tracking Number
  loop
    v_order_id := 'KA-' || lpad((floor(random() * 90000) + 10000)::text, 5, '0');
    exit when not exists (select 1 from public.orders where id = v_order_id);
  end loop;

  v_tracking_no := 'TRX-' || lpad((floor(random() * 900000000) + 100000000)::text, 9, '0') || 'PK';
  v_now_str := to_char(now() at time zone 'Asia/Karachi', 'DD Mon YYYY, HH12:MI AM');

  -- 16. Build initial timeline event (Courier is not pre-assigned; assigned upon dispatch)
  v_initial_timeline := jsonb_build_array(
    jsonb_build_object(
      'status', 'placed',
      'label', 'Order Placed & Confirmed',
      'description', 'Your order was verified by Komal Customer Care.',
      'timestamp', v_now_str,
      'completed', true,
      'current', true
    ),
    jsonb_build_object(
      'status', 'packed',
      'label', 'Quality Checked & Gift Packed',
      'description', 'Items wrapped in blush tissue and satin gift ribbon with seal.',
      'timestamp', 'Pending packaging',
      'completed', false,
      'current', false
    ),
    jsonb_build_object(
      'status', 'dispatched',
      'label', 'Dispatched with Courier',
      'description', 'Courier will be assigned upon dispatch.',
      'timestamp', 'Scheduled next morning',
      'completed', false,
      'current', false
    ),
    jsonb_build_object(
      'status', 'out_for_delivery',
      'label', 'Out for Delivery in ' || trim(p_city),
      'description', 'Local courier rider assigned for doorstep delivery with cash receipt.',
      'timestamp', 'Pending dispatch',
      'completed', false,
      'current', false
    ),
    jsonb_build_object(
      'status', 'delivered',
      'label', 'Delivered & Signed',
      'description', 'Package safely delivered to your doorstep.',
      'timestamp', 'Pending delivery',
      'completed', false,
      'current', false
    )
  );

  -- 17. Insert Order Row with normalized phone and NULL courier name
  insert into public.orders (
    id,
    customer_name,
    email,
    phone,
    city,
    address,
    postal_code,
    notes,
    payment_reference,
    items,
    subtotal,
    shipping,
    discount,
    total,
    payment_method,
    payment_status,
    courier_name,
    tracking_number,
    order_status,
    timeline,
    estimated_delivery
  ) values (
    v_order_id,
    trim(p_customer_name),
    nullif(trim(coalesce(p_email, '')), ''),
    v_normalized_phone,
    trim(p_city),
    trim(p_address),
    nullif(trim(coalesce(p_postal_code, '')), ''),
    nullif(trim(coalesce(p_notes, '')), ''),
    nullif(trim(coalesce(p_payment_reference, '')), ''),
    v_order_items,
    v_subtotal,
    v_shipping,
    v_discount,
    v_total,
    v_clean_method,
    v_payment_status,
    null, -- Courier is NULL until assigned upon dispatch by admin
    v_tracking_no,
    'placed',
    v_initial_timeline,
    'Within 2-3 Business Days'
  );

  return jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'tracking_number', v_tracking_no,
    'customer_name', trim(p_customer_name),
    'phone', v_normalized_phone,
    'city', trim(p_city),
    'address', trim(p_address),
    'subtotal', v_subtotal,
    'shipping', v_shipping,
    'discount', v_discount,
    'total', v_total,
    'payment_method', v_clean_method,
    'payment_status', v_payment_status,
    'payment_reference', nullif(trim(coalesce(p_payment_reference, '')), ''),
    'courier_name', null,
    'items', v_order_items,
    'timeline', v_initial_timeline
  );
end;
$$;

-- 4. TRACK ORDER (Requires matching order ID AND normalized phone number)
create or replace function public.track_order(
  p_order_id text,
  p_phone text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order record;
  v_normalized_input_phone text;
  v_clean_id text;
begin
  if p_order_id is null or length(trim(p_order_id)) = 0 then
    return null;
  end if;

  v_clean_id := upper(trim(p_order_id));
  v_normalized_input_phone := public.normalize_pk_phone(p_phone);

  if v_normalized_input_phone is null then
    return null;
  end if;

  -- Select order matching by ID or tracking number AND normalized phone
  select * into v_order
  from public.orders
  where (upper(id) = v_clean_id or upper(tracking_number) = v_clean_id)
    and (phone = v_normalized_input_phone or public.normalize_pk_phone(phone) = v_normalized_input_phone);

  if not found then
    return null;
  end if;

  return to_jsonb(v_order);
end;
$$;

-- 5. CANCEL ORDER (Admin only: cancels order and restores product stock atomically)
create or replace function public.cancel_order(
  p_order_id text,
  p_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order record;
  v_item jsonb;
  v_prod_id text;
  v_qty int;
  v_now_str text;
  v_updated_timeline jsonb;
begin
  if not public.is_admin() then
    raise exception 'Unauthorized: Only store administrators can cancel orders.';
  end if;

  select * into v_order
  from public.orders
  where id = p_order_id
  for update;

  if not found then
    raise exception 'Order "%" was not found.', p_order_id;
  end if;

  if v_order.order_status = 'cancelled' then
    return jsonb_build_object('success', false, 'message', 'Order is already cancelled.');
  end if;

  if v_order.order_status = 'delivered' then
    raise exception 'Cannot cancel an order that has already been delivered.';
  end if;

  -- Restore stock for each item in a transaction
  for v_item in select * from jsonb_array_elements(v_order.items)
  loop
    v_prod_id := v_item->'product'->>'id';
    v_qty := coalesce((v_item->>'quantity')::int, 0);

    if v_prod_id is not null and v_qty > 0 then
      update public.products
      set stock_count = stock_count + v_qty,
          in_stock = true
      where id = v_prod_id;
    end if;
  end loop;

  v_now_str := to_char(now() at time zone 'Asia/Karachi', 'DD Mon YYYY, HH12:MI AM');

  v_updated_timeline := v_order.timeline || jsonb_build_object(
    'status', 'cancelled',
    'label', 'Order Cancelled',
    'description', coalesce(p_reason, 'Order was cancelled by store administrator and stock restored.'),
    'timestamp', v_now_str,
    'completed', true,
    'current', true
  );

  update public.orders
  set order_status = 'cancelled',
      timeline = v_updated_timeline,
      notes = case
        when p_reason is not null then coalesce(notes, '') || ' [Cancelled: ' || p_reason || ']'
        else notes
      end
  where id = p_order_id;

  return jsonb_build_object(
    'success', true,
    'order_id', p_order_id,
    'message', 'Order #' || p_order_id || ' cancelled and inventory stock restored.'
  );
end;
$$;

-- ==============================================================================
-- 11. SUPABASE STORAGE BUCKET FOR PRODUCT IMAGES & POLICIES
-- ==============================================================================

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public Access to product-images" on storage.objects;
create policy "Public Access to product-images"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "Admin Upload to product-images" on storage.objects;
create policy "Admin Upload to product-images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admin Update to product-images" on storage.objects;
create policy "Admin Update to product-images"
  on storage.objects for update
  using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admin Delete from product-images" on storage.objects;
create policy "Admin Delete from product-images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and public.is_admin());

-- ==============================================================================
-- 12. REVOKE & GRANT PERMISSIONS
-- ==============================================================================

-- Revoke all function permissions from public by default
revoke all on function public.is_admin() from public;
revoke all on function public.normalize_pk_phone(text) from public;
revoke all on function public.evaluate_coupon(text, numeric) from public;
revoke all on function public.validate_coupon(text, numeric) from public;
revoke all on function public.place_order(text, text, text, text, text, text, text, jsonb, text, text, text) from public;
revoke all on function public.track_order(text, text) from public;
revoke all on function public.cancel_order(text, text) from public;

-- Grant EXECUTE to anon and authenticated for public store checkout & tracking functions
grant execute on function public.normalize_pk_phone(text) to anon, authenticated;
grant execute on function public.evaluate_coupon(text, numeric) to anon, authenticated;
grant execute on function public.validate_coupon(text, numeric) to anon, authenticated;
grant execute on function public.place_order(text, text, text, text, text, text, text, jsonb, text, text, text) to anon, authenticated;
grant execute on function public.track_order(text, text) to anon, authenticated;

-- Grant admin-only functions to authenticated users (protected internally by public.is_admin())
grant execute on function public.is_admin() to authenticated;
grant execute on function public.cancel_order(text, text) to authenticated;

-- Table permissions
grant select on public.categories to anon, authenticated;
grant select on public.products to anon, authenticated;
grant select on public.store_settings to anon, authenticated;
grant all on public.categories to authenticated;
grant all on public.products to authenticated;
grant all on public.coupons to authenticated;
grant all on public.store_settings to authenticated;
grant all on public.orders to authenticated;
grant all on public.admins to authenticated;

-- Realtime Publication for orders table
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'orders'
    ) then
      alter publication supabase_realtime add table public.orders;
    end if;
  end if;
exception when others then
  -- Ignore if publication alteration is restricted
end $$;

-- ==============================================================================
-- 13. INITIAL SEED DATA
-- ==============================================================================

-- Seed Categories
insert into public.categories (id, label, description)
values
  ('all', 'All Collection', 'Complete catalog of accessories'),
  ('teen-cute', 'Teen Cute', 'Cute hair clips, resin claws & Y2K charms'),
  ('cute-jewelry', 'Cute Jewelry', 'Korean-style dainty clover pendants & earrings'),
  ('trendy-adult', 'Trendy Adult', 'Luxe tennis bracelets, pearls & minimal rings'),
  ('gift-sets', 'Gift Sets', 'Hand-tied velvet hampers with greeting cards'),
  ('baby-items', 'Baby Items', 'Ultra-gentle seamless headbands & ribbon clips')
on conflict (id) do update
  set label = excluded.label,
      description = excluded.description;

-- Seed Store Settings
insert into public.store_settings (
  id, store_name, tagline, phone, whatsapp, email, address,
  free_shipping_threshold, standard_shipping_fee, announcement_text
) values (
  1,
  'Komal Accessories',
  'Premium boutique for hair accessories, cute jewelry & gift hampers',
  '+92 300 1234567',
  '923001234567',
  'support@komalaccessories.com',
  'Komal Boutique Studio, MM Alam Road, Gulberg III, Lahore, Pakistan',
  2000,
  200,
  'Free Express Delivery on orders over Rs. 2,000 | 100% Cash on Delivery across Pakistan'
) on conflict (id) do nothing;

-- Seed Coupons
insert into public.coupons (
  code, discount_type, discount_value, min_order_value, free_shipping, is_active, description
) values
  ('KOMAL10', 'percentage', 10, 1000, false, true, '10% discount on orders above Rs. 1,000'),
  ('FREESHIP', 'freeship', 0, 0, true, true, 'Free courier shipping on any order value'),
  ('EIDSPECIAL', 'percentage', 15, 2500, false, true, '15% festive gift hampers discount')
on conflict (code) do update
  set discount_type = excluded.discount_type,
      discount_value = excluded.discount_value,
      min_order_value = excluded.min_order_value,
      free_shipping = excluded.free_shipping,
      is_active = excluded.is_active,
      description = excluded.description;

-- Seed Products
insert into public.products (
  id, name, category, category_label, price, original_price, rating, review_count, badge,
  images, description, specs, features, colors, in_stock, stock_count, is_bestseller, is_new
) values
(
  'ka-teen-01',
  'Aesthetic Pastel Butterfly Hair Clip Duo',
  'teen-cute',
  'Teen Cute',
  650,
  850,
  4.9,
  142,
  'Bestseller',
  '["/src/assets/images/product_butterfly_hairclips_1790671742281.jpg", "/src/assets/images/hero_accessories_showcase_1790671724566.jpg"]'::jsonb,
  'Iridescent acetate butterfly clips featuring premium spring hold and delicate pastel tinting. Engineered for strong grip without tugging or creasing sensitive hair.',
  '{"material": "Eco-friendly Cellulose Acetate & Rust-free Gold Alloy Spring", "dimensions": "4.5cm x 3.8cm", "weight": "14g per clip", "packaging": "Custom Komal organza drawstring bag & backing card", "suitability": "All hair types: fine, wavy, and thick hairstyles"}'::jsonb,
  '["Gentle rounded teeth that never pull or snag delicate hair", "High-grade gloss resin with soft rainbow iridescence", "Ultra-durable inner tension spring tested for 5,000+ clips", "Perfect for half-up styles, curtain bangs, or messy buns"]'::jsonb,
  '[{"name": "Lilac Shimmer", "hex": "#D8B4E2"}, {"name": "Peach Sorbet", "hex": "#FFD1BA"}, {"name": "Mint Pearl", "hex": "#C1E7E3"}, {"name": "Buttercup", "hex": "#FFF2B2"}]'::jsonb,
  true,
  18,
  true,
  false
),
(
  'ka-jewel-01',
  'Dainty Korean 18K Gold Clover Pendant',
  'cute-jewelry',
  'Cute Jewelry',
  1450,
  1950,
  5.0,
  98,
  'Trending',
  '["/src/assets/images/product_korean_pendant_necklace_1790671757541.jpg", "/src/assets/images/hero_accessories_showcase_1790671724566.jpg"]'::jsonb,
  'Four-leaf clover pendant coated in double-layer 18K real gold electroplating. Features double-sided mother-of-pearl inlay with an anti-tarnish protective micro-shield.',
  '{"material": "Titanium Steel base with 18K Real Gold PVD Plating & Natural Shell Inlay", "dimensions": "Pendant: 12mm x 12mm | Chain: 40cm + 5cm extender", "weight": "4.2g", "packaging": "Velvet magnetic jewelry box with polishing cloth", "suitability": "Hypoallergenic, Nickel-free & Lead-free for daily wear"}'::jsonb,
  '["Water-resistant & sweat-proof PVD plating that will not turn skin green", "Reversible dual-sided inlay: Black Onyx on one side, Pearl White on reverse", "Adjustable 5cm extension chain fits every neckline perfectly"]'::jsonb,
  '[{"name": "Emerald & Gold", "hex": "#0F5132"}, {"name": "Pearl White & Gold", "hex": "#F8FAFC"}, {"name": "Onyx Black & Gold", "hex": "#1E293B"}]'::jsonb,
  true,
  24,
  true,
  true
),
(
  'ka-gift-01',
  'Luxury Velvet Birthday & Festive Gift Hamper',
  'gift-sets',
  'Gift Sets',
  3850,
  4900,
  5.0,
  64,
  'Gift Favorite',
  '["/src/assets/images/product_luxury_gift_hamper_1790671773811.jpg", "/src/assets/images/hero_accessories_showcase_1790671724566.jpg"]'::jsonb,
  'The quintessential boutique gift presentation. Hand-curated in a blush velvet rigid magnetic box with satin ribbon, scented rose petals, 5 premium hair pieces, and a jewelry set.',
  '{"material": "Crushed velvet rigid keepsake box, Satin bow, Gold-foil envelope", "dimensions": "28cm x 20cm x 9cm", "weight": "480g full hamper", "packaging": "Sealed outer bubble-protection box ready for gifting", "suitability": "Birthdays, Bridal showers, Eid, Anniversaries"}'::jsonb,
  '["Includes 2 Silk Scrunchies, 1 French Acetate Claw Clip, 1 Clover Bracelet & 1 Pearl Hairpin", "Customized handwritten calligraphy message card included inside", "Keepsake velvet trunk reusable for vanity makeup and jewelry storage"]'::jsonb,
  '[{"name": "Blush Rose Velvet", "hex": "#E0A899"}, {"name": "Royal Emerald Velvet", "hex": "#134E4A"}, {"name": "Midnight Navy", "hex": "#1E1B4B"}]'::jsonb,
  true,
  8,
  true,
  false
),
(
  'ka-baby-01',
  'Ultra-Soft Seamless Baby Headband Trio',
  'baby-items',
  'Baby Items',
  750,
  950,
  4.9,
  89,
  'Newborn Safe',
  '["/src/assets/images/product_baby_soft_headbands_1790671790832.jpg", "/src/assets/images/hero_accessories_showcase_1790671724566.jpg"]'::jsonb,
  'Crafted from feather-light medical-grade nylon elastic that stretches effortlessly as your baby grows. Zero compression marks, zero rough seams, certified newborn safe.',
  '{"material": "100% Breathable Organic Cotton Rib & Super-stretch Seamless Nylon", "dimensions": "Unstretched: 28cm circumference | Stretches to 54cm (0 to 4 Years)", "weight": "6g per headband", "packaging": "Clear aesthetic pouch with cotton ribbon", "suitability": "Newborns, infants, and toddlers (0-36 months)"}'::jsonb,
  '["Buttery-soft elastic never leaves compression marks or red lines on baby foreheads", "Hand-tied boutique grosgrain and linen mini bows that do not fray", "Dermatologist-tested, hypoallergenic, chemical-free dyes"]'::jsonb,
  '[{"name": "Neutral Earth Trio", "hex": "#D7C0AE"}, {"name": "Vintage Pastels", "hex": "#FAD2E1"}, {"name": "Classic Whites", "hex": "#FFFFFF"}]'::jsonb,
  true,
  22,
  false,
  true
),
(
  'ka-teen-02',
  'Chunky Acrylic Checkerboard Hair Claw',
  'teen-cute',
  'Teen Cute',
  550,
  750,
  4.8,
  118,
  'Y2K Trend',
  '["/src/assets/images/product_butterfly_hairclips_1790671742281.jpg", "/src/assets/images/hero_accessories_showcase_1790671724566.jpg"]'::jsonb,
  'Trendy retro Y2K checkerboard patterned claw clip. Large 10.5cm profile engineered with strong interlocking teeth to hold heavy, thick, or long hair in place all day.',
  '{"material": "Shatterproof Bioplastic Acrylic & Reinforced Steel Spring", "dimensions": "10.5cm x 5.2cm x 4.5cm", "weight": "28g", "packaging": "Recycled kraft paper box with Komal sticker seal", "suitability": "Thick, long, curly, and textured hair types"}'::jsonb,
  '["Extra-wide tooth spacing holds even waist-length hair securely without slippage", "Matte soft-touch finish prevents greasy finger smudges", "Rounded teeth tips gently massage scalp rather than poke"]'::jsonb,
  '[{"name": "Espresso & Cream", "hex": "#78350F"}, {"name": "Sage & Olive", "hex": "#84CC16"}, {"name": "Bubblegum & Pink", "hex": "#F472B6"}]'::jsonb,
  true,
  20,
  false,
  false
),
(
  'ka-adult-01',
  'Cubic Zirconia Pavé Tennis Bracelet',
  'trendy-adult',
  'Trendy Adult',
  1850,
  2400,
  5.0,
  76,
  'Luxury Classic',
  '["/src/assets/images/product_korean_pendant_necklace_1790671757541.jpg", "/src/assets/images/hero_accessories_showcase_1790671724566.jpg"]'::jsonb,
  'Brilliant 3mm AAAAA round-cut simulated diamond cubic zirconia stones hand-set in high-polish rhodium and 18K yellow gold finish with double safety clasp.',
  '{"material": "Brass core with 3x Platinum/18K Gold dipping, 3mm AAAAA Cubic Zirconia", "dimensions": "Length: 17cm (Standard Women Wrist) with safety box latch", "weight": "9.8g", "packaging": "Rigid black and gold presentation box", "suitability": "Evening wear, weddings, upscale dinner parties"}'::jsonb,
  '["D-color flawless CZ stones cut with 58 facets for maximum diamond fire & brilliance", "Dual safety flip latches ensure the bracelet never unclasps accidentally", "Lead-free, cadmium-free, and skin-friendly coating"]'::jsonb,
  '[{"name": "Platinum Silver", "hex": "#E2E8F0"}, {"name": "Champagne Gold", "hex": "#FDE047"}]'::jsonb,
  true,
  12,
  true,
  false
),
(
  'ka-jewel-02',
  'Baroque Freshwater Pearl Drop Huggie Hoops',
  'cute-jewelry',
  'Cute Jewelry',
  1250,
  1650,
  4.9,
  52,
  null,
  '["/src/assets/images/product_korean_pendant_necklace_1790671757541.jpg", "/src/assets/images/hero_accessories_showcase_1790671724566.jpg"]'::jsonb,
  'Genuine irregular baroque freshwater cultured pearls suspended from hypoallergenic mini huggie hoops. Pearl charms are detachable for 2-in-1 styling.',
  '{"material": "Natural Cultured Baroque Pearls & 925 Sterling Silver needles (18K gold plated)", "dimensions": "Hoop diameter: 12mm | Pearl drop: 10-12mm (each pearl is organically unique)", "weight": "3.8g pair", "packaging": "Boutique drawer box with protective foam cushion", "suitability": "Sensitive earlobes, everyday styling"}'::jsonb,
  '["Detachable pearls: wear as simple everyday gold huggies or add pearls for elegance", "Genuine cultured pearls with deep natural luster and iridescent overtones", "Click-top closure snaps firmly into place for peace of mind"]'::jsonb,
  '[{"name": "Gold / Ivory Pearl", "hex": "#FEF3C7"}, {"name": "Silver / White Pearl", "hex": "#F1F5F9"}]'::jsonb,
  true,
  15,
  false,
  false
),
(
  'ka-baby-02',
  'Handmade Linen Sailor Bow Hairclips',
  'baby-items',
  'Baby Items',
  590,
  790,
  4.8,
  63,
  null,
  '["/src/assets/images/product_baby_soft_headbands_1790671790832.jpg", "/src/assets/images/hero_accessories_showcase_1790671724566.jpg"]'::jsonb,
  'Set of 2 timeless sailor bows crafted from 100% pure washed linen fabric. Mounted on fully ribbon-lined alligator clips to prevent pulling fine toddler hair.',
  '{"material": "100% Natural Washed French Linen & Fully Ribbon-wrapped Alligator Clip", "dimensions": "Bow span: 8cm x 5cm | Clip: 4.5cm", "weight": "8g pair", "packaging": "Cardstock hanger with twine loop", "suitability": "Babies with fine hair, toddlers, and young girls"}'::jsonb,
  '["Fully lined metal clip ensures metal never touches tender baby scalp", "Hand-stitched center knot that will not unravel in washing or toddler play", "Non-slip silicone grip insert keeps bow in place on fine baby hairs"]'::jsonb,
  '[{"name": "Oatmeal Linen", "hex": "#E6D5B8"}, {"name": "Dusty Terracotta", "hex": "#C27D60"}, {"name": "Muted Moss", "hex": "#8A9A86"}]'::jsonb,
  true,
  25,
  false,
  false
),
(
  'ka-teen-03',
  'Kawaii Pastel Pearl Phone Lanyard Charm',
  'teen-cute',
  'Teen Cute',
  490,
  650,
  4.7,
  73,
  null,
  '["/src/assets/images/product_butterfly_hairclips_1790671742281.jpg", "/src/assets/images/hero_accessories_showcase_1790671724566.jpg"]'::jsonb,
  'Chic beaded wrist strap featuring acrylic bow motifs, pastel heart beads, and faux freshwater pearls. Loops easily through any phone case mute opening or lanyard loop.',
  '{"material": "Reinforced 7-strand nylon cord, Acrylic beads & simulated pearls", "dimensions": "Loop circumference: 24cm", "weight": "12g", "packaging": "Komal branded glassine sleeve", "suitability": "All smartphone cases (iPhone, Samsung, etc.)"}'::jsonb,
  '["Heavy-duty tensile cord withstands up to 6kg of pull force", "Hands-free wrist tether keeps your phone safe while taking mirror selfies", "Adorned with sweet heart and star iridescent accents"]'::jsonb,
  '[{"name": "Cotton Candy Mix", "hex": "#FECDD3"}, {"name": "Cloud Lavender", "hex": "#DDD6FE"}]'::jsonb,
  true,
  30,
  false,
  false
),
(
  'ka-adult-03',
  'Minimalist Dome & Twist Ring Duo',
  'trendy-adult',
  'Trendy Adult',
  1150,
  1550,
  4.8,
  41,
  null,
  '["/src/assets/images/product_korean_pendant_necklace_1790671757541.jpg", "/src/assets/images/hero_accessories_showcase_1790671724566.jpg"]'::jsonb,
  'Set of two complementary sculptural rings: one polished bold dome ring and one delicate organic croissant twisted band. Made with adjustable open-back sizing.',
  '{"material": "18K Gold Plated Stainless Steel (Waterproof & Non-tarnish)", "dimensions": "Adjustable back fits US Ring Sizes 5 to 9 comfortably", "weight": "7.4g set", "packaging": "Microfiber travel envelope", "suitability": "Stackable or worn individually on index/ring finger"}'::jsonb,
  '["Sweat-proof and soap-safe: wear while washing hands without worries", "Smooth inner hollow comfort-fit curve prevents moisture buildup", "Adjustable band allows seamless switching between fingers"]'::jsonb,
  '[{"name": "Radiant Gold", "hex": "#E5C058"}, {"name": "Sleek Silver", "hex": "#CBD5E1"}]'::jsonb,
  true,
  16,
  false,
  false
)
on conflict (id) do update
  set name = excluded.name,
      category = excluded.category,
      category_label = excluded.category_label,
      price = excluded.price,
      original_price = excluded.original_price,
      stock_count = excluded.stock_count,
      in_stock = excluded.in_stock,
      description = excluded.description;
