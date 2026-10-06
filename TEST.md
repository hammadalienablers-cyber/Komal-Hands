# Manual Verification Test Suite — Komal Accessories

This document outlines the manual verification procedures and exact `curl` commands to test the security boundaries, Row Level Security (RLS) policies, and RPC functions against a live Supabase project.

> **Execution Note:** Because these tests require live network access to your hosted Supabase instance with active project credentials, they are marked as **NOT RUN** in this offline container. Once you deploy your schema to your Supabase project, execute these tests in your terminal to verify full compliance.

---

### Setup Variables in Your Terminal

```bash
export SUPABASE_URL="https://your-project-id.supabase.co"
export ANON_KEY="your-anon-public-key"
```

---

### Test 1: Anonymous Read on Orders Table (Must Return Empty `[]`)
**Objective:** Verify that Row Level Security prevents unauthenticated visitors from listing customer orders.

```bash
curl -i -X GET "${SUPABASE_URL}/rest/v1/orders?select=*" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

- **Expected Response:** `HTTP/1.1 200 OK` with body `[]` (empty list; 0 records visible).
- **Status:** **NOT RUN**

---

### Test 2: Anonymous Direct Write on Products Table (Must Be Rejected)
**Objective:** Verify that unauthenticated visitors cannot create or modify catalog items directly via REST.

```bash
curl -i -X POST "${SUPABASE_URL}/rest/v1/products" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "hack-item",
    "name": "Unauthorized Product",
    "price": 100,
    "stock_count": 50
  }'
```

- **Expected Response:** `HTTP/1.1 401 Unauthorized` or `403 Forbidden` with error code `42501` (`new row violates row-level security policy for table "products"`).
- **Status:** **NOT RUN**

---

### Test 3: `place_order` with Non-Existent or Invalid Coupon
**Objective:** Verify that typing an unknown or removed coupon code (e.g. `FAKECODE` or `FREESHIP` when removed from `public.coupons`) grants NO discount and charges standard shipping (Rs. 200).

```bash
curl -i -X POST "${SUPABASE_URL}/rest/v1/rpc/place_order" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "p_customer_name": "Test Customer",
    "p_email": "test@example.com",
    "p_phone": "03001234567",
    "p_city": "Lahore",
    "p_address": "Street 5, Phase 4, DHA",
    "p_items": [
      {
        "product_id": "ka-teen-01",
        "quantity": 1,
        "color": "Lilac Shimmer"
      }
    ],
    "p_coupon_code": "NONEXISTENT_COUPON",
    "p_payment_method": "cod"
  }'
```

- **Expected Response:** `HTTP/1.1 200 OK` with JSON containing:
  - `"discount": 0`
  - `"shipping": 200`
  - `"total": 850` (Item price 650 + Shipping 200)
- **Status:** **NOT RUN**

---

### Test 4: `place_order` with Real Active `FREESHIP` Coupon
**Objective:** Verify that an active row in `public.coupons` with `free_shipping = true` or `discount_type = 'freeship'` zeroes out the shipping fee.

```bash
curl -i -X POST "${SUPABASE_URL}/rest/v1/rpc/place_order" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "p_customer_name": "Free Shipping Tester",
    "p_email": "freeship@example.com",
    "p_phone": "03123456789",
    "p_city": "Karachi",
    "p_address": "Block 2, Clifton",
    "p_items": [
      {
        "product_id": "ka-teen-01",
        "quantity": 1,
        "color": "Peach Sorbet"
      }
    ],
    "p_coupon_code": "FREESHIP",
    "p_payment_method": "cod"
  }'
```

- **Expected Response:** `HTTP/1.1 200 OK` with JSON containing:
  - `"shipping": 0`
  - `"total": 650`
- **Status:** **NOT RUN**

---

### Test 5: Phone Number Normalization
**Objective:** Verify that Pakistani mobile numbers starting with `+92` or `92` are stored as `03XXXXXXXXX`.

```bash
curl -i -X POST "${SUPABASE_URL}/rest/v1/rpc/place_order" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "p_customer_name": "Phone Test",
    "p_phone": "+92-300-1122334",
    "p_city": "Islamabad",
    "p_address": "House 12, Street 3, F-7/2",
    "p_items": [
      {
        "product_id": "ka-teen-02",
        "quantity": 1,
        "color": "Espresso & Cream"
      }
    ]
  }'
```

- **Expected Response:** Returned object contains `"phone": "03001122334"`.
- **Status:** **NOT RUN**

---

### Test 6: `track_order` Phone Verification
**Objective:** Verify that parcel details are returned only when both Order ID and matching Phone Number are supplied.

```bash
# Correct Phone
curl -i -X POST "${SUPABASE_URL}/rest/v1/rpc/track_order" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "p_order_id": "KA-XXXXX",
    "p_phone": "03001122334"
  }'

# Wrong Phone
curl -i -X POST "${SUPABASE_URL}/rest/v1/rpc/track_order" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "p_order_id": "KA-XXXXX",
    "p_phone": "03999999999"
  }'
```

- **Expected Response:**
  - Correct phone: returns order JSON.
  - Wrong phone: returns `null`.
- **Status:** **NOT RUN**

---

### Test 7: Quantity & Stock Integrity Rejection
**Objective:** Verify that orders with quantity `> 10`, quantity `<= 0`, non-integer quantity, or ordering more than available stock are rejected.

```bash
curl -i -X POST "${SUPABASE_URL}/rest/v1/rpc/place_order" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "p_customer_name": "Overflow Tester",
    "p_phone": "03001234567",
    "p_city": "Rawalpindi",
    "p_address": "Mall Road, Saddar",
    "p_items": [
      {
        "product_id": "ka-teen-01",
        "quantity": 999,
        "color": "Lilac Shimmer"
      }
    ]
  }'
```

- **Expected Response:** `HTTP/1.1 400 Bad Request` with error message `"Quantity per item must be between 1 and 10 units."`.
- **Status:** **NOT RUN**

---

### Test 8: Anti-Abuse Rate Limit (Max 5 Orders / Hour / Phone)
**Objective:** Verify that placing a 6th order from the same phone number within 1 hour triggers a rate limit exception.

- **Expected Response on 6th request:** `HTTP/1.1 400 Bad Request` with `"Order limit reached: Maximum 5 orders per hour allowed for this phone number."`.
- **Status:** **NOT RUN**

---

### Test 9: `cancel_order` by Administrator Restores Stock
**Objective:** Verify that when an authenticated admin cancels an order via `cancel_order(order_id, reason)`, the order status becomes `cancelled` and the stock counts of all line items are incremented back in `public.products`.

```bash
curl -i -X POST "${SUPABASE_URL}/rest/v1/rpc/cancel_order" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer <ADMIN_USER_JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "p_order_id": "KA-XXXXX",
    "p_reason": "Customer requested cancellation before dispatch"
  }'
```

- **Expected Response:** `{"success": true, "message": "Order #KA-XXXXX cancelled and inventory stock restored."}`. Product stock restored in `public.products`.
- **Status:** **NOT RUN**

---

### Test 10: Anonymous Attempt to Call `cancel_order` (Must Be Forbidden)
**Objective:** Verify that unauthenticated visitors cannot invoke `cancel_order`.

```bash
curl -i -X POST "${SUPABASE_URL}/rest/v1/rpc/cancel_order" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "p_order_id": "KA-XXXXX"
  }'
```

- **Expected Response:** `HTTP/1.1 403 Forbidden` / `401 Unauthorized` (Permission denied for function cancel_order).
- **Status:** **NOT RUN**
