import { CategoryItem } from '../types';

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 'all', label: 'All Collection', description: 'Complete catalog of accessories' },
  { id: 'teen-cute', label: 'Teen Cute', description: 'Cute hair clips, resin claws & Y2K charms' },
  { id: 'cute-jewelry', label: 'Cute Jewelry', description: 'Korean-style dainty clover pendants & earrings' },
  { id: 'trendy-adult', label: 'Trendy Adult', description: 'Luxe tennis bracelets, pearls & minimal rings' },
  { id: 'gift-sets', label: 'Gift Sets', description: 'Hand-tied velvet hampers with greeting cards' },
  { id: 'baby-items', label: 'Baby Items', description: 'Ultra-gentle seamless headbands & ribbon clips' },
];

export const DEFAULT_COUPONS = [
  {
    code: 'KOMAL10',
    discountType: 'percentage' as const,
    discountValue: 10,
    minOrderValue: 1000,
    isActive: true,
    description: '10% discount on orders above Rs. 1,000',
  },
  {
    code: 'FREESHIP',
    discountType: 'fixed' as const,
    discountValue: 200,
    minOrderValue: 0,
    isActive: true,
    description: 'Free courier shipping coupon',
  },
  {
    code: 'EIDSPECIAL',
    discountType: 'percentage' as const,
    discountValue: 15,
    minOrderValue: 2500,
    isActive: true,
    description: '15% festive gift hampers discount',
  },
];

export const DEFAULT_STORE_SETTINGS = {
  storeName: 'Komal Accessories',
  tagline: 'Premium boutique for hair accessories, cute jewelry & gift hampers',
  phone: '+92 300 1234567',
  whatsapp: '923001234567',
  email: 'support@komalaccessories.com',
  address: 'Komal Boutique Studio, MM Alam Road, Gulberg III, Lahore, Pakistan',
  freeShippingThreshold: 2000,
  standardShippingFee: 200,
  announcementText: 'Free Express Delivery on orders over Rs. 2,000 | 100% Cash on Delivery across Pakistan',
};
