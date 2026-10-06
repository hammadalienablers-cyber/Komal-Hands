import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  ProductCategory, 
  CategoryItem, 
  Coupon, 
  StoreSettings, 
  OrderStatus 
} from '../types';
import { PRODUCTS } from '../data/products';
import { DEFAULT_CATEGORIES, DEFAULT_COUPONS, DEFAULT_STORE_SETTINGS } from '../data/categories';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  mapDbProductToProduct, 
  mapProductToDbRow, 
  mapDbOrderToOrder, 
  mapDbSettingsToStoreSettings, 
  mapStoreSettingsToDbRow, 
  mapDbCouponToCoupon 
} from '../lib/mappers';
import { playNewOrderChime } from '../lib/sound';

interface ShopContextType {
  // Products Management
  products: Product[];
  addProduct: (productData: Omit<Product, 'id'>) => Promise<Product | null>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Categories Management
  categories: CategoryItem[];
  addCategory: (cat: CategoryItem) => Promise<void>;
  updateCategory: (id: string, label: string, description?: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Store Settings & Info
  storeSettings: StoreSettings;
  updateStoreSettings: (settings: Partial<StoreSettings>) => Promise<void>;
  resetToDefaults: () => Promise<void>;

  // Cart (Local to customer)
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string) => void;
  removeFromCart: (productId: string, selectedColor: string) => void;
  updateQuantity: (productId: string, selectedColor: string, newQty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  
  // Coupons & Discounts
  coupons: Coupon[];
  appliedCoupon: string | null;
  discountAmount: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  addCoupon: (coupon: Coupon) => Promise<void>;
  toggleCoupon: (code: string) => Promise<void>;
  deleteCoupon: (code: string) => Promise<void>;

  // Wishlist (Local to customer)
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders & Real-time Tracking
  orders: Order[];
  placeOrder: (orderInfo: {
    customerName: string;
    email: string;
    phone: string;
    city: string;
    address: string;
    postalCode?: string;
    notes?: string;
    paymentMethod: 'cod' | 'card' | 'jazzcash_easypaisa';
    paymentReference?: string;
  }) => Promise<Order>;
  cancelOrder: (orderId: string, reason?: string) => Promise<{ success: boolean; error?: string }>;
  getOrderById: (query: string) => Order | undefined;
  trackOrder: (orderId: string, phone: string) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: OrderStatus, courierName?: string, trackingNumber?: string) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  trackOrderId: string;
  setTrackOrderId: (id: string) => void;

  // Navigation & Modals
  activeCategory: ProductCategory;
  setActiveCategory: (cat: ProductCategory) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeProduct: Product | null;
  setActiveProduct: (p: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isTrackOrderOpen: boolean;
  setIsTrackOrderOpen: (open: boolean) => void;
  openOrderTrackerWithId: (orderId?: string) => void;

  // Admin Portal & Security
  isAdminMode: boolean;
  setIsAdminMode: (active: boolean) => void;
  isAdminAuthenticated: boolean;
  adminEmail: string | null;
  isAdminLoginOpen: boolean;
  setIsAdminLoginOpen: (open: boolean) => void;
  loginAdmin: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;
  changeAdminPassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;

  // Loading & Realtime alerts
  isLoadingData: boolean;
  dataError: string | null;
  refreshData: () => Promise<void>;
  newOrderAlert: string | null;
  dismissNewOrderAlert: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Database States
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const [coupons, setCoupons] = useState<Coupon[]>(DEFAULT_COUPONS);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [orders, setOrders] = useState<Order[]>([]);

  // Loading & error state
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [newOrderAlert, setNewOrderAlert] = useState<string | null>(null);

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);

  // Customer Local State: Cart, Wishlist, Applied Coupon
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('komal_cart');
      return saved ? JSON.parse(saved) : [
        {
          product: PRODUCTS[0],
          quantity: 1,
          selectedColor: PRODUCTS[0].colors[0]?.name || 'Lilac Shimmer',
        }
      ];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('komal_wishlist');
      return saved ? JSON.parse(saved) : ['ka-jewel-01', 'ka-gift-01'];
    } catch {
      return ['ka-jewel-01'];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(() => {
    try {
      return localStorage.getItem('komal_applied_coupon');
    } catch {
      return null;
    }
  });

  // UI Modals & Navigation state
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState<boolean>(false);
  const [trackOrderId, setTrackOrderId] = useState<string>(() => {
    try {
      return localStorage.getItem('komal_last_order_id') || 'KA-84920';
    } catch {
      return 'KA-84920';
    }
  });

  // Sync Customer Cart, Wishlist, Coupon to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('komal_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('komal_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('komal_applied_coupon', appliedCoupon);
      } else {
        localStorage.removeItem('komal_applied_coupon');
      }
    } catch {}
  }, [appliedCoupon]);

  // Fetch Public Data: Products, Categories, Store Settings from Supabase
  const fetchData = useCallback(async () => {
    setIsLoadingData(true);
    setDataError(null);

    if (!isSupabaseConfigured) {
      // Fallback to default bundled dataset if Supabase environment variables are missing
      setProducts(PRODUCTS);
      setCategories(DEFAULT_CATEGORIES);
      setStoreSettings(DEFAULT_STORE_SETTINGS);
      setCoupons(DEFAULT_COUPONS);
      setIsLoadingData(false);
      return;
    }

    try {
      // 1. Fetch Categories
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (catError) console.warn('Supabase categories fetch error:', catError.message);
      if (catData && catData.length > 0) {
        setCategories(catData.map((c: any) => ({
          id: c.id,
          label: c.label,
          description: c.description || undefined,
        })));
      }

      // 2. Fetch Products
      const { data: prodData, error: prodError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (prodError) throw prodError;
      if (prodData && prodData.length > 0) {
        setProducts(prodData.map(mapDbProductToProduct));
      }

      // 3. Fetch Store Settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (settingsError) console.warn('Supabase settings fetch error:', settingsError.message);
      if (settingsData) {
        setStoreSettings(mapDbSettingsToStoreSettings(settingsData));
      }
    } catch (err: any) {
      console.error('Failed to load store data from Supabase:', err);
      setDataError(err.message || 'Error loading store data. Using cached catalog.');
      // Keep bundled data fallback so website is always viewable
      setProducts(PRODUCTS);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  // Fetch Admin Data (Orders, Coupons) when authenticated
  const fetchAdminData = useCallback(async () => {
    if (!isSupabaseConfigured || !isAdminAuthenticated) return;

    try {
      // 1. Fetch Orders
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (orderError) throw orderError;
      if (orderData) {
        setOrders(orderData.map(mapDbOrderToOrder));
      }

      // 2. Fetch Coupons
      const { data: couponData, error: couponError } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (couponError) throw couponError;
      if (couponData) {
        setCoupons(couponData.map(mapDbCouponToCoupon));
      }
    } catch (err: any) {
      console.error('Error fetching admin data:', err);
    }
  }, [isAdminAuthenticated]);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Check Supabase Auth Session on mount
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Strictly verify user exists in admins table
          const { data: adminRecord } = await supabase
            .from('admins')
            .select('user_id')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (adminRecord) {
            setIsAdminAuthenticated(true);
            setAdminEmail(session.user.email || null);
          } else {
            setIsAdminAuthenticated(false);
            setAdminEmail(null);
            setIsAdminMode(false);
          }
        }
      } catch (e) {
        console.warn('Auth session check error:', e);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Strictly verify user exists in admins table on state changes
        const { data: adminRecord } = await supabase
          .from('admins')
          .select('user_id')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (adminRecord) {
          setIsAdminAuthenticated(true);
          setAdminEmail(session.user.email || null);
        } else {
          setIsAdminAuthenticated(false);
          setAdminEmail(null);
          setIsAdminMode(false);
        }
      } else {
        setIsAdminAuthenticated(false);
        setAdminEmail(null);
        setIsAdminMode(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch admin data whenever admin authentication status changes
  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchAdminData();
    }
  }, [isAdminAuthenticated, fetchAdminData]);

  // Supabase Realtime Subscription on orders table (when admin is authenticated)
  useEffect(() => {
    if (!isSupabaseConfigured || !isAdminAuthenticated) return;

    const channel = supabase
      .channel('admin-orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            const newOrder = mapDbOrderToOrder(payload.new);
            setOrders((prev) => [newOrder, ...prev.filter((o) => o.id !== newOrder.id)]);
            playNewOrderChime();
            setNewOrderAlert(`🎉 New Order: #${newOrder.id} (${newOrder.customerName} - Rs. ${newOrder.total.toLocaleString()})`);
          } else if (payload.eventType === 'UPDATE') {
            const updatedOrder = mapDbOrderToOrder(payload.new);
            setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
          } else if (payload.eventType === 'DELETE') {
            setOrders((prev) => prev.filter((o) => o.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdminAuthenticated]);

  // Admin Auth Handlers
  const loginAdmin = async (credentials: { email: string; password: string }): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
      return {
        success: false,
        error: 'Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.',
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email.trim(),
        password: credentials.password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'User not found.' };
      }

      // Strictly check that user exists in the admins authorization table
      const { data: adminRecord, error: adminCheckError } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', data.user.id)
        .maybeSingle();

      if (adminCheckError || !adminRecord) {
        // Sign out immediately if not authorized as admin
        await supabase.auth.signOut();
        return {
          success: false,
          error: 'Access Denied: This account is not listed in the admins authorization table. Please add your user_id to the admins table in Supabase.',
        };
      }

      setIsAdminAuthenticated(true);
      setAdminEmail(data.user.email || credentials.email);
      setIsAdminMode(true);
      setIsAdminLoginOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed.' };
    }
  };

  const logoutAdmin = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setIsAdminAuthenticated(false);
    setAdminEmail(null);
    setIsAdminMode(false);
  };

  const changeAdminPassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured) {
      return { success: false, error: 'Supabase not configured.' };
    }
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update password.' };
    }
  };

  // Products CRUD with Supabase
  const addProduct = async (productData: Omit<Product, 'id'>): Promise<Product | null> => {
    const newId = `ka-item-${Date.now()}`;
    const newProduct: Product = { ...productData, id: newId };

    if (isSupabaseConfigured && isAdminAuthenticated) {
      const dbRow = mapProductToDbRow(newProduct);
      const { error } = await supabase.from('products').insert([dbRow]);
      if (error) {
        console.error('Failed to insert product in Supabase:', error);
        throw error;
      }
    }

    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    if (isSupabaseConfigured && isAdminAuthenticated) {
      const dbRow = mapProductToDbRow(updates);
      const { error } = await supabase
        .from('products')
        .update(dbRow)
        .eq('id', id);
      if (error) {
        console.error('Failed to update product in Supabase:', error);
        throw error;
      }
    }

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          if (activeProduct && activeProduct.id === id) {
            setActiveProduct(updated);
          }
          return updated;
        }
        return p;
      })
    );

    // Update in customer cart if present
    setCart((prev) =>
      prev.map((item) => (item.product.id === id ? { ...item, product: { ...item.product, ...updates } } : item))
    );
  };

  const deleteProduct = async (id: string) => {
    if (isSupabaseConfigured && isAdminAuthenticated) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        console.error('Failed to delete product from Supabase:', error);
        throw error;
      }
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
    setWishlist((prev) => prev.filter((pId) => pId !== id));
    if (activeProduct && activeProduct.id === id) {
      setActiveProduct(null);
    }
  };

  // Categories CRUD with Supabase
  const addCategory = async (newCat: CategoryItem) => {
    if (isSupabaseConfigured && isAdminAuthenticated) {
      const { error } = await supabase.from('categories').insert([{
        id: newCat.id,
        label: newCat.label,
        description: newCat.description || null,
      }]);
      if (error) throw error;
    }
    setCategories((prev) => [...prev, newCat]);
  };

  const updateCategory = async (id: string, label: string, description?: string) => {
    if (isSupabaseConfigured && isAdminAuthenticated) {
      const { error } = await supabase
        .from('categories')
        .update({ label, description: description || null })
        .eq('id', id);
      if (error) throw error;
    }
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, label, description: description || c.description } : c))
    );
  };

  const deleteCategory = async (id: string) => {
    if (id === 'all') return;
    if (isSupabaseConfigured && isAdminAuthenticated) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    if (activeCategory === id) {
      setActiveCategory('all');
    }
  };

  // Coupons CRUD with Supabase
  const addCoupon = async (coupon: Coupon) => {
    if (isSupabaseConfigured && isAdminAuthenticated) {
      const { error } = await supabase.from('coupons').upsert([{
        code: coupon.code,
        discount_type: coupon.discountType,
        discount_value: coupon.discountValue,
        min_order_value: coupon.minOrderValue,
        is_active: coupon.isActive,
        description: coupon.description || null,
      }]);
      if (error) throw error;
    }
    setCoupons((prev) => [coupon, ...prev.filter((c) => c.code !== coupon.code)]);
  };

  const toggleCoupon = async (code: string) => {
    const target = coupons.find((c) => c.code === code);
    if (!target) return;
    const newActiveState = !target.isActive;

    if (isSupabaseConfigured && isAdminAuthenticated) {
      const { error } = await supabase
        .from('coupons')
        .update({ is_active: newActiveState })
        .eq('code', code);
      if (error) throw error;
    }

    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, isActive: newActiveState } : c))
    );
  };

  const deleteCoupon = async (code: string) => {
    if (isSupabaseConfigured && isAdminAuthenticated) {
      const { error } = await supabase.from('coupons').delete().eq('code', code);
      if (error) throw error;
    }
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    if (appliedCoupon === code) {
      setAppliedCoupon(null);
    }
  };

  // Store Settings CRUD with Supabase
  const updateStoreSettings = async (updates: Partial<StoreSettings>) => {
    const merged = { ...storeSettings, ...updates };
    if (isSupabaseConfigured && isAdminAuthenticated) {
      const dbRow = mapStoreSettingsToDbRow(updates);
      const { error } = await supabase
        .from('store_settings')
        .update(dbRow)
        .eq('id', 1);
      if (error) throw error;
    }
    setStoreSettings(merged);
  };

  const resetToDefaults = async () => {
    setProducts(PRODUCTS);
    setCategories(DEFAULT_CATEGORIES);
    setCoupons(DEFAULT_COUPONS);
    setStoreSettings(DEFAULT_STORE_SETTINGS);
    setOrders([]);
    await fetchData();
  };

  // Customer Cart Calculations
  const addToCart = (product: Product, quantity = 1, selectedColor?: string) => {
    const color = selectedColor || product.colors[0]?.name || 'Standard';
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === color
      );
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { product, quantity, selectedColor: color }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, selectedColor: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedColor === selectedColor)
      )
    );
  };

  const updateQuantity = (productId: string, selectedColor: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(productId, selectedColor);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.selectedColor === selectedColor) {
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Dynamic coupon validation via Supabase RPC or local fallback
  const activeCouponObj = coupons.find((c) => c.code === appliedCoupon && c.isActive);

  let discountAmount = 0;
  if (activeCouponObj) {
    if (activeCouponObj.discountType === 'percentage') {
      discountAmount = Math.round(cartSubtotal * (activeCouponObj.discountValue / 100));
    } else {
      discountAmount = activeCouponObj.discountValue;
    }
  }

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    const cleanCode = code.trim().toUpperCase();

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.rpc('validate_coupon', {
          p_code: cleanCode,
          p_subtotal: cartSubtotal,
        });

        if (error) throw error;
        if (data && data.valid) {
          setAppliedCoupon(cleanCode);
          return {
            success: true,
            message: `🎉 Coupon applied: ${data.discount_type === 'percentage' ? `${data.discount_value}% Off` : `Rs. ${data.discount_value} Off`}`,
          };
        } else {
          return {
            success: false,
            message: data?.message || 'Invalid coupon code.',
          };
        }
      } catch (err: any) {
        console.warn('Coupon validation error from Supabase RPC:', err.message);
      }
    }

    // Local fallback
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode);
    if (!found) {
      return { success: false, message: 'Invalid coupon code. Try "KOMAL10" or "FREESHIP".' };
    }
    if (!found.isActive) {
      return { success: false, message: 'This coupon has expired or is currently inactive.' };
    }
    if (cartSubtotal < found.minOrderValue) {
      return {
        success: false,
        message: `This coupon requires a minimum cart total of Rs. ${found.minOrderValue.toLocaleString()}.`,
      };
    }

    setAppliedCoupon(found.code);
    return {
      success: true,
      message: `🎉 Coupon applied: ${found.discountType === 'percentage' ? `${found.discountValue}% Off` : `Rs. ${found.discountValue} Off`}`,
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Place Order (Calls Server-Authoritative Supabase RPC 'place_order')
  const placeOrder = async (orderInfo: {
    customerName: string;
    email: string;
    phone: string;
    city: string;
    address: string;
    postalCode?: string;
    notes?: string;
    paymentMethod: 'cod' | 'card' | 'jazzcash_easypaisa';
    paymentReference?: string;
  }): Promise<Order> => {
    if (cart.length === 0) {
      throw new Error('Your cart is empty. Please add items before checking out.');
    }

    // Server-Side Order Placement via Supabase RPC
    if (isSupabaseConfigured) {
      const itemsPayload = cart.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        color: item.selectedColor,
      }));

      const { data, error } = await supabase.rpc('place_order', {
        p_customer_name: orderInfo.customerName,
        p_email: orderInfo.email || null,
        p_phone: orderInfo.phone,
        p_city: orderInfo.city,
        p_address: orderInfo.address,
        p_postal_code: orderInfo.postalCode || null,
        p_notes: orderInfo.notes || null,
        p_items: itemsPayload,
        p_coupon_code: appliedCoupon || null,
        p_payment_method: orderInfo.paymentMethod,
        p_payment_reference: orderInfo.paymentReference || null,
      });

      if (error) {
        throw new Error(error.message || 'Failed to place order. Please try again.');
      }

      if (!data || !data.order_id) {
        throw new Error('Order creation failed on server.');
      }

      const createdOrder: Order = {
        id: data.order_id,
        trackingNumber: data.tracking_number,
        customerName: data.customer_name || orderInfo.customerName,
        email: orderInfo.email,
        phone: data.phone || orderInfo.phone,
        city: data.city || orderInfo.city,
        address: data.address || orderInfo.address,
        postalCode: orderInfo.postalCode,
        notes: orderInfo.notes,
        paymentReference: orderInfo.paymentReference,
        items: [...cart],
        subtotal: Number(data.subtotal),
        shipping: Number(data.shipping),
        discount: Number(data.discount),
        total: Number(data.total),
        paymentMethod: orderInfo.paymentMethod,
        paymentStatus: 'pending',
        courierName: data.courier_name || '',
        orderStatus: 'placed',
        createdAt: 'Just now',
        estimatedDelivery: 'Within 2-3 Business Days',
        timeline: data.timeline || [],
      };

      // Save order ID & Phone in customer local storage for instant tracking lookup
      try {
        localStorage.setItem('komal_last_order_id', createdOrder.id);
        localStorage.setItem('komal_last_order_phone', orderInfo.phone);
      } catch {}

      setTrackOrderId(createdOrder.id);
      clearCart();
      setAppliedCoupon(null);

      // Decrement stock in client view to match server
      setProducts((prev) =>
        prev.map((p) => {
          const cartItem = cart.find((item) => item.product.id === p.id);
          if (cartItem) {
            const newStock = Math.max(0, p.stockCount - cartItem.quantity);
            return { ...p, stockCount: newStock, inStock: newStock > 0 };
          }
          return p;
        })
      );

      return createdOrder;
    }

    // Offline / Demo Fallback if Supabase credentials are not yet configured
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newOrderId = `KA-${randomSuffix}`;
    const trackingNo = `TRX-${Math.floor(100000000 + Math.random() * 900000000)}PK`;

    const freeShippingThreshold = storeSettings.freeShippingThreshold;
    const baseShipping = cartSubtotal >= freeShippingThreshold || appliedCoupon === 'FREESHIP' ? 0 : storeSettings.standardShippingFee;
    const discount = discountAmount;
    const grandTotal = Math.max(0, cartSubtotal + baseShipping - discount);

    const now = new Date();
    const formattedDate = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const fallbackOrder: Order = {
      id: newOrderId,
      trackingNumber: trackingNo,
      customerName: orderInfo.customerName,
      email: orderInfo.email,
      phone: orderInfo.phone,
      city: orderInfo.city,
      address: orderInfo.address,
      postalCode: orderInfo.postalCode,
      notes: orderInfo.notes,
      items: [...cart],
      subtotal: cartSubtotal,
      shipping: baseShipping,
      discount: discount,
      total: grandTotal,
      paymentMethod: orderInfo.paymentMethod,
      paymentStatus: 'pending',
      courierName: 'Trax Express Logistics',
      orderStatus: 'placed',
      createdAt: formattedDate,
      estimatedDelivery: 'Within 2-3 Business Days',
      timeline: [
        {
          status: 'placed',
          label: 'Order Placed & Confirmed',
          description: 'Your order was received and verified.',
          timestamp: formattedDate,
          completed: true,
          current: true,
        },
        {
          status: 'packed',
          label: 'Quality Check & Satin Packaging',
          description: 'Each piece inspected for premium finish and packaged in gift box.',
          timestamp: 'Pending packaging',
          completed: false,
          current: false,
        },
        {
          status: 'dispatched',
          label: 'Dispatched with Courier',
          description: `Will be handed to Trax Express with tracking ${trackingNo}.`,
          timestamp: 'Scheduled tomorrow morning',
          completed: false,
          current: false,
        },
        {
          status: 'out_for_delivery',
          label: `Out for Delivery in ${orderInfo.city}`,
          description: 'Local rider assigned for doorstep delivery with cash receipt.',
          timestamp: 'Pending dispatch',
          completed: false,
          current: false,
        },
        {
          status: 'delivered',
          label: 'Delivered',
          description: 'Package safely delivered to your doorstep.',
          timestamp: 'Pending delivery',
          completed: false,
          current: false,
        },
      ],
    };

    setOrders((prev) => [fallbackOrder, ...prev]);
    clearCart();
    setAppliedCoupon(null);
    setTrackOrderId(newOrderId);
    return fallbackOrder;
  };

  // Track Order via Security Definer RPC (verifies order ID + phone number on server)
  const trackOrder = async (orderId: string, phone: string): Promise<Order | null> => {
    if (!orderId || !phone) return null;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.rpc('track_order', {
          p_order_id: orderId.trim(),
          p_phone: phone.trim(),
        });

        if (error) {
          console.warn('Track order RPC error:', error.message);
          return null;
        }

        if (data) {
          return mapDbOrderToOrder(data);
        }
        return null;
      } catch (err) {
        console.error('Track order request failed:', err);
        return null;
      }
    }

    // Local lookup fallback
    const q = orderId.trim().toUpperCase();
    const cleanInputPhone = phone.replace(/\D/g, '');
    const found = orders.find(
      (o) =>
        (o.id.toUpperCase() === q || o.trackingNumber.toUpperCase() === q) &&
        (o.phone.replace(/\D/g, '').endsWith(cleanInputPhone.slice(-7)) ||
          o.phone.replace(/\D/g, '') === cleanInputPhone)
    );
    return found || null;
  };

  const getOrderById = (query: string): Order | undefined => {
    const q = query.trim().toUpperCase();
    if (!q) return undefined;
    return orders.find(
      (o) =>
        o.id.toUpperCase() === q ||
        o.trackingNumber.toUpperCase() === q ||
        o.phone.replace(/[^0-9]/g, '').includes(q.replace(/[^0-9]/g, ''))
    );
  };

  // Admin Order Status Update (Persisted to Supabase and appends to Timeline)
  const updateOrderStatus = async (
    orderId: string, 
    newStatus: OrderStatus, 
    newCourierName?: string, 
    newTrackingNo?: string
  ) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    const courier = newCourierName || targetOrder.courierName;
    const tracking = newTrackingNo || targetOrder.trackingNumber;

    const statusOrder: OrderStatus[] = ['placed', 'packed', 'dispatched', 'out_for_delivery', 'delivered'];
    const targetIndex = statusOrder.indexOf(newStatus);
    const now = new Date();
    const formattedDate = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const updatedTimeline = targetOrder.timeline.map((event) => {
      const eventIndex = statusOrder.indexOf(event.status);
      const isCompleted = eventIndex < targetIndex;
      const isCurrent = eventIndex === targetIndex;
      
      let timestamp = event.timestamp;
      if (isCurrent && (!timestamp || timestamp.includes('Pending'))) {
        timestamp = formattedDate;
      }

      let description = event.description;
      if (event.status === 'dispatched' && (courier || tracking)) {
        description = `Handed to ${courier} with waybill #${tracking}.`;
      }

      return {
        ...event,
        completed: isCompleted || (isCurrent && newStatus === 'delivered'),
        current: isCurrent && newStatus !== 'delivered',
        timestamp,
        description,
      };
    });

    const paymentStatus = newStatus === 'delivered' ? 'paid' : targetOrder.paymentStatus;

    if (isSupabaseConfigured && isAdminAuthenticated) {
      const { error } = await supabase
        .from('orders')
        .update({
          order_status: newStatus,
          courier_name: courier,
          tracking_number: tracking,
          payment_status: paymentStatus,
          timeline: updatedTimeline,
        })
        .eq('id', orderId);

      if (error) {
        console.error('Failed to update order status in Supabase:', error);
        throw error;
      }
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? {
        ...o,
        orderStatus: newStatus,
        courierName: courier,
        trackingNumber: tracking,
        paymentStatus,
        timeline: updatedTimeline,
      } : o))
    );
  };

  const cancelOrder = async (orderId: string, reason?: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured && isAdminAuthenticated) {
      try {
        const { data, error } = await supabase.rpc('cancel_order', {
          p_order_id: orderId,
          p_reason: reason || null,
        });

        if (error) throw error;
        if (data && !data.success) {
          return { success: false, error: data.message };
        }

        // Re-fetch products to get restored stock levels and admin orders
        await fetchData();
        await fetchAdminData();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to cancel order.' };
      }
    }

    // Local / Dev Fallback: Restore stock in memory
    const existingOrder = orders.find((o) => o.id === orderId);
    if (existingOrder) {
      setProducts((prev) =>
        prev.map((prod) => {
          const item = existingOrder.items.find((i) => i.product.id === prod.id);
          if (item) {
            const restoredStock = prod.stockCount + item.quantity;
            return { ...prod, stockCount: restoredStock, inStock: true };
          }
          return prod;
        })
      );
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                orderStatus: 'cancelled',
                timeline: [
                  ...o.timeline,
                  {
                    status: 'cancelled',
                    label: 'Order Cancelled',
                    description: reason || 'Order was cancelled by store administrator and stock restored.',
                    timestamp: 'Just now',
                    completed: true,
                    current: true,
                  },
                ],
              }
            : o
        )
      );
    }
    return { success: true };
  };

  const deleteOrder = async (orderId: string) => {
    if (isSupabaseConfigured && isAdminAuthenticated) {
      const { error } = await supabase.from('orders').delete().eq('id', orderId);
      if (error) throw error;
    }
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const openOrderTrackerWithId = (orderId?: string) => {
    if (orderId) {
      setTrackOrderId(orderId);
    }
    setIsTrackOrderOpen(true);
  };

  const dismissNewOrderAlert = () => setNewOrderAlert(null);

  return (
    <ShopContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        storeSettings,
        updateStoreSettings,
        resetToDefaults,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        coupons,
        appliedCoupon,
        discountAmount,
        applyCoupon,
        removeCoupon,
        addCoupon,
        toggleCoupon,
        deleteCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        placeOrder,
        getOrderById,
        trackOrder,
        updateOrderStatus,
        cancelOrder,
        deleteOrder,
        trackOrderId,
        setTrackOrderId,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        activeProduct,
        setActiveProduct,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isTrackOrderOpen,
        setIsTrackOrderOpen,
        openOrderTrackerWithId,
        isAdminMode,
        setIsAdminMode,
        isAdminAuthenticated,
        adminEmail,
        isAdminLoginOpen,
        setIsAdminLoginOpen,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        isLoadingData,
        dataError,
        refreshData: fetchData,
        newOrderAlert,
        dismissNewOrderAlert,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
