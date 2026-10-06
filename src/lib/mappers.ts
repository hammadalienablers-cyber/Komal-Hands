import { Product, Order, CategoryItem, Coupon, StoreSettings } from '../types';

export function mapDbProductToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    categoryLabel: row.category_label || row.categoryLabel || '',
    price: Number(row.price),
    originalPrice: Number(row.original_price ?? row.originalPrice ?? row.price),
    rating: Number(row.rating ?? 5.0),
    reviewCount: Number(row.review_count ?? row.reviewCount ?? 0),
    badge: row.badge || undefined,
    images: Array.isArray(row.images) ? row.images : [],
    description: row.description || '',
    specs: typeof row.specs === 'object' && row.specs !== null ? row.specs : {
      material: '',
      dimensions: '',
      weight: '',
      packaging: '',
      suitability: '',
    },
    features: Array.isArray(row.features) ? row.features : [],
    colors: Array.isArray(row.colors) ? row.colors : [],
    inStock: Boolean(row.in_stock ?? (row.stock_count > 0)),
    stockCount: Number(row.stock_count ?? row.stockCount ?? 0),
    isBestseller: Boolean(row.is_bestseller ?? row.isBestseller),
    isNew: Boolean(row.is_new ?? row.isNew),
  };
}

export function mapProductToDbRow(p: Partial<Product>): any {
  const row: any = {};
  if (p.id !== undefined) row.id = p.id;
  if (p.name !== undefined) row.name = p.name;
  if (p.category !== undefined) row.category = p.category;
  if (p.categoryLabel !== undefined) row.category_label = p.categoryLabel;
  if (p.price !== undefined) row.price = p.price;
  if (p.originalPrice !== undefined) row.original_price = p.originalPrice;
  if (p.rating !== undefined) row.rating = p.rating;
  if (p.reviewCount !== undefined) row.review_count = p.reviewCount;
  if (p.badge !== undefined) row.badge = p.badge;
  if (p.images !== undefined) row.images = p.images;
  if (p.description !== undefined) row.description = p.description;
  if (p.specs !== undefined) row.specs = p.specs;
  if (p.features !== undefined) row.features = p.features;
  if (p.colors !== undefined) row.colors = p.colors;
  if (p.inStock !== undefined) row.in_stock = p.inStock;
  if (p.stockCount !== undefined) {
    row.stock_count = p.stockCount;
    row.in_stock = p.stockCount > 0;
  }
  if (p.isBestseller !== undefined) row.is_bestseller = p.isBestseller;
  if (p.isNew !== undefined) row.is_new = p.isNew;
  return row;
}

export function mapDbOrderToOrder(row: any): Order {
  return {
    id: row.id,
    customerName: row.customer_name || row.customerName || '',
    email: row.email || '',
    phone: row.phone || '',
    city: row.city || '',
    address: row.address || '',
    postalCode: row.postal_code || row.postalCode || '',
    notes: row.notes || '',
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: Number(row.subtotal || 0),
    shipping: Number(row.shipping || 0),
    discount: Number(row.discount || 0),
    total: Number(row.total || 0),
    paymentMethod: row.payment_method || row.paymentMethod || 'cod',
    paymentStatus: row.payment_status || row.paymentStatus || 'pending',
    paymentReference: row.payment_reference || row.paymentReference || undefined,
    courierName: row.courier_name || row.courierName || '',
    trackingNumber: row.tracking_number || row.trackingNumber || '',
    orderStatus: row.order_status || row.orderStatus || 'placed',
    timeline: Array.isArray(row.timeline) ? row.timeline : [],
    createdAt: row.created_at ? new Date(row.created_at).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) : '',
    estimatedDelivery: row.estimated_delivery || row.estimatedDelivery || 'Within 2-3 Business Days',
  };
}

export function mapDbSettingsToStoreSettings(row: any): StoreSettings {
  return {
    storeName: row.store_name || 'Komal Accessories',
    tagline: row.tagline || 'Premium boutique for hair accessories, cute jewelry & gift hampers',
    phone: row.phone || '+92 300 1234567',
    whatsapp: row.whatsapp || '923001234567',
    email: row.email || 'support@komalaccessories.com',
    address: row.address || 'Komal Boutique Studio, MM Alam Road, Gulberg III, Lahore, Pakistan',
    freeShippingThreshold: Number(row.free_shipping_threshold ?? 2000),
    standardShippingFee: Number(row.standard_shipping_fee ?? 200),
    announcementText: row.announcement_text || 'Free Express Delivery on orders over Rs. 2,000 | 100% Cash on Delivery across Pakistan',
  };
}

export function mapStoreSettingsToDbRow(s: Partial<StoreSettings>): any {
  const row: any = {};
  if (s.storeName !== undefined) row.store_name = s.storeName;
  if (s.tagline !== undefined) row.tagline = s.tagline;
  if (s.phone !== undefined) row.phone = s.phone;
  if (s.whatsapp !== undefined) row.whatsapp = s.whatsapp;
  if (s.email !== undefined) row.email = s.email;
  if (s.address !== undefined) row.address = s.address;
  if (s.freeShippingThreshold !== undefined) row.free_shipping_threshold = s.freeShippingThreshold;
  if (s.standardShippingFee !== undefined) row.standard_shipping_fee = s.standardShippingFee;
  if (s.announcementText !== undefined) row.announcement_text = s.announcementText;
  return row;
}

export function mapDbCouponToCoupon(row: any): Coupon {
  return {
    code: row.code,
    discountType: row.discount_type || 'percentage',
    discountValue: Number(row.discount_value || 0),
    minOrderValue: Number(row.min_order_value || 0),
    isActive: Boolean(row.is_active),
    freeShipping: Boolean(row.free_shipping),
    expiresAt: row.expires_at || undefined,
    maxUses: row.max_uses !== undefined && row.max_uses !== null ? Number(row.max_uses) : undefined,
    usedCount: Number(row.used_count || 0),
    description: row.description || '',
  };
}
