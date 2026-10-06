export type ProductCategory = string;

export interface CategoryItem {
  id: string;
  label: string;
  itemCount?: number;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  images: string[];
  description: string;
  specs: {
    material: string;
    dimensions?: string;
    weight?: string;
    packaging: string;
    suitability: string;
  };
  features: string[];
  colors: {
    name: string;
    hex: string;
  }[];
  inStock: boolean;
  stockCount: number;
  isBestseller?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
}

export interface ReviewItem {
  id: string;
  productId?: string;
  productName?: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  city: string;
  itemPurchased: string;
  helpfulCount: number;
}

export type OrderStatus = 'placed' | 'packed' | 'dispatched' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface OrderTimelineEvent {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  postalCode?: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: 'cod' | 'card' | 'jazzcash_easypaisa';
  paymentStatus: 'paid' | 'pending';
  paymentReference?: string;
  courierName: string;
  trackingNumber: string;
  orderStatus: OrderStatus;
  timeline: OrderTimelineEvent[];
  createdAt: string;
  estimatedDelivery: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed' | 'freeship';
  discountValue: number;
  minOrderValue: number;
  isActive: boolean;
  freeShipping?: boolean;
  expiresAt?: string;
  maxUses?: number;
  usedCount?: number;
  description?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  announcementText: string;
}
