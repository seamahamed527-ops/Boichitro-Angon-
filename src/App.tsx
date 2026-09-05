import React, { useState, useEffect, useMemo } from 'react';
import { PRODUCTS, PROMO_CODES } from './data/products';
import { SEED_ORDERS } from './data/mockOrders';
import { INITIAL_REVIEWS } from './data/mockReviews';
import { Product, CartItem, Order, PromoCode, ProductReview } from './types';
import { Header } from './components/Header';
import { BannerSlider } from './components/BannerSlider';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { RecentlyViewedSection } from './components/RecentlyViewedSection';
import { BottomNav, NavTab } from './components/BottomNav';
import { SearchView } from './components/SearchView';
import { ProfileView } from './components/ProfileView';
import { WishlistToast, WishlistToastData } from './components/WishlistToast';
import {
  Sparkles,
  Truck,
  ShieldCheck,
  RotateCcw,
  Clock,
  ArrowRight,
  ArrowUpDown,
} from 'lucide-react';

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'newest' | 'rating';

export default function App() {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<SortOption>('default');

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState<boolean>(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [wishlistToast, setWishlistToast] = useState<WishlistToastData | null>(null);

  // Cart state with localStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('boichitro_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state with localStorage persistence
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('boichitro_wishlist');
      return saved ? new Set(JSON.parse(saved)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  // Orders state with localStorage persistence and seed orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('boichitro_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return SEED_ORDERS;
    } catch {
      return SEED_ORDERS;
    }
  });

  // Recently Viewed state with localStorage persistence
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('boichitro_recently_viewed');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return ['ba-001', 'ba-002'];
    } catch {
      return ['ba-001', 'ba-002'];
    }
  });

  // Product Reviews state with localStorage persistence
  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    try {
      const saved = localStorage.getItem('boichitro_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('boichitro_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('boichitro_wishlist', JSON.stringify(Array.from(wishlistIds)));
    } catch (e) {
      console.error(e);
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem('boichitro_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('boichitro_recently_viewed', JSON.stringify(recentlyViewedIds));
    } catch (e) {
      console.error(e);
    }
  }, [recentlyViewedIds]);

  useEffect(() => {
    try {
      localStorage.setItem('boichitro_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }
  }, [reviews]);

  // Derived counts
  const totalCartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: PRODUCTS.length };
    PRODUCTS.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Sorted and filtered products based on category & sorting criteria
  const sortedFilteredProducts = useMemo(() => {
    let list =
      selectedCategory === 'all'
        ? [...PRODUCTS]
        : PRODUCTS.filter((p) => p.category === selectedCategory);

    switch (sortOption) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'newest':
        return list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'default':
      default:
        return list;
    }
  }, [selectedCategory, sortOption]);

  const recentlyViewedProducts = useMemo(() => {
    return recentlyViewedIds
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));
  }, [recentlyViewedIds]);

  const wishlistProducts = useMemo(() => {
    return PRODUCTS.filter((p) => wishlistIds.has(p.id));
  }, [wishlistIds]);

  // Handlers
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== product.id);
      return [product.id, ...filtered].slice(0, 10);
    });
  };

  const handleClearRecentlyViewed = () => {
    setRecentlyViewedIds([]);
  };

  const handleAddReview = (newRev: {
    productId: string;
    userName: string;
    rating: number;
    comment: string;
  }) => {
    const review: ProductReview = {
      id: `rev-${Date.now()}`,
      productId: newRev.productId,
      userName: newRev.userName,
      rating: newRev.rating,
      comment: newRev.comment,
      date: 'আজকে',
      verifiedPurchase: true,
      helpfulCount: 0,
    };

    setReviews((prev) => [review, ...prev]);
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      const isRemoving = next.has(product.id);
      if (isRemoving) {
        next.delete(product.id);
        setWishlistToast({
          id: `${product.id}-${Date.now()}`,
          product,
          action: 'removed',
        });
      } else {
        next.add(product.id);
        setWishlistToast({
          id: `${product.id}-${Date.now()}`,
          product,
          action: 'added',
        });
      }
      return next;
    });
  };

  const handleAddToCart = (
    product: Product,
    selectedSize: string,
    selectedColor: { nameBn: string; nameEn: string; hex: string },
    quantity: number = 1
  ) => {
    const cartItemId = `${product.id}-${selectedSize}-${selectedColor.nameEn}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            product,
            selectedSize,
            selectedColor,
            quantity,
          },
        ];
      }
    });

    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1800);
  };

  const handleQuickAddToCart = (product: Product) => {
    const defaultSize = product.sizes[0] || 'M';
    const defaultColor = product.colors[0];
    handleAddToCart(product, defaultSize, defaultColor, 1);
  };

  const handleInstantBuy = (
    product: Product,
    selectedSize: string,
    selectedColor: { nameBn: string; nameEn: string; hex: string },
    quantity: number
  ) => {
    handleAddToCart(product, selectedSize, selectedColor, quantity);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleOrderSuccess = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const handleClearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const handleOpenTracking = (orderNumber?: string) => {
    setTrackingOrderId(orderNumber || '');
    setIsTrackingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center selection:bg-rose-500 selection:text-white">
      {/* Mobile-first app container container max-w-lg or full responsive container */}
      <div className="w-full max-w-md md:max-w-xl lg:max-w-2xl bg-neutral-50 min-h-screen flex flex-col shadow-2xl relative border-x border-neutral-200">
        {/* Top Header */}
        <Header
          cartCount={totalCartCount}
          wishlistCount={wishlistIds.size}
          onOpenCart={() => setIsCartDrawerOpen(true)}
          onOpenSearch={() => setActiveTab('search')}
          onOpenWishlist={() => setActiveTab('profile')}
          onOpenTracking={() => handleOpenTracking()}
        />

        {/* Main View Body */}
        <main className="flex-1 px-4 py-3 space-y-5 pb-24">
          {/* TAB 1: HOME VIEW */}
          {activeTab === 'home' && (
            <>
              {/* Promotional Hero Slider */}
              <BannerSlider
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                }}
              />

              {/* Category Filter Pills */}
              <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                counts={categoryCounts}
              />

              {/* Trust Value Badges Strip */}
              <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-2xl border border-neutral-200/80 text-[11px] text-neutral-700 shadow-xs font-bengali">
                <div className="flex items-center gap-1.5 justify-center text-center">
                  <Truck className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span className="font-semibold">সারাদেশে COD</span>
                </div>
                <div className="flex items-center gap-1.5 justify-center text-center border-x border-neutral-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span className="font-semibold">১০০% আসল পোশাক</span>
                </div>
                <div className="flex items-center gap-1.5 justify-center text-center">
                  <RotateCcw className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span className="font-semibold">৭ দিনের এক্সচেঞ্জ</span>
                </div>
              </div>

              {/* Quick Order Tracking Shortcut Card */}
              <div
                onClick={() => handleOpenTracking()}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-rose-50 via-white to-amber-50 border border-rose-200 hover:border-rose-300 cursor-pointer transition-all shadow-2xs font-bengali group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-amber-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block">
                      অর্ডার ডেলিভারি ট্র্যাক করুন
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      অর্ডার আইডি দিয়ে বর্তমান পার্সেল অবস্থান জানুন
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-rose-600 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                  ট্র্যাক <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Products Section Header & Sorting Dropdown */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1">
                <div>
                  <h3 className="font-bengali font-bold text-lg sm:text-xl text-neutral-900 leading-tight">
                    {selectedCategory === 'all'
                      ? 'সকল এক্সক্লুসিভ পোশাক'
                      : selectedCategory === 'mens'
                      ? 'পুরুষদের প্রিমিয়াম কালেকশন'
                      : selectedCategory === 'womens'
                      ? 'নারীদের শাড়ি ও থ্রি-পিস'
                      : selectedCategory === 'festive'
                      ? 'উৎসব ও ব্রাইডাল স্পেশাল'
                      : 'ক্যাজুয়াল ও সমসাময়িক ফ্যাশন'}
                  </h3>
                  <span className="text-xs text-neutral-500 font-bengali">
                    {sortedFilteredProducts.length} টি প্রিমিয়াম ডিজাইন রয়েছে
                  </span>
                </div>

                {/* Sorting Controls */}
                <div className="flex items-center gap-2 self-start sm:self-auto font-bengali">
                  <div className="flex items-center gap-1.5 bg-white border border-neutral-200/90 rounded-xl px-2.5 py-1.5 shadow-2xs text-xs">
                    <ArrowUpDown className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span className="text-neutral-500 font-medium text-[11px] hidden sm:inline">সর্ট:</span>
                    <select
                      id="category-sort-select"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value as SortOption)}
                      className="bg-transparent text-neutral-800 font-semibold focus:outline-none cursor-pointer text-xs pr-1"
                    >
                      <option value="default">জনপ্রিয় (ডিফল্ট)</option>
                      <option value="price-asc">দাম: কম থেকে বেশি ৳↑</option>
                      <option value="price-desc">দাম: বেশি থেকে কম ৳↓</option>
                      <option value="newest">নতুন কালেকশন (Newest)</option>
                      <option value="rating">সর্বোচ্চ রেটিং ★</option>
                    </select>
                  </div>

                  {selectedCategory !== 'all' && (
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 font-bengali cursor-pointer whitespace-nowrap bg-rose-50 px-2.5 py-1.5 rounded-xl border border-rose-100 hover:bg-rose-100 transition-colors"
                    >
                      সব দেখুন →
                    </button>
                  )}
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {sortedFilteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlistIds.has(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onSelectProduct={(p) => handleSelectProduct(p)}
                    onQuickAddToCart={handleQuickAddToCart}
                    isAddedJustNow={addedProductId === product.id}
                  />
                ))}
              </div>

              {/* Recently Viewed Products Section on Home page */}
              <RecentlyViewedSection
                products={recentlyViewedProducts}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
                onSelectProduct={(p) => handleSelectProduct(p)}
                onQuickAddToCart={handleQuickAddToCart}
                onClear={handleClearRecentlyViewed}
              />

              {/* Promo Callout Card */}
              <div className="bg-gradient-to-r from-rose-900 to-neutral-900 rounded-3xl p-5 text-white shadow-md relative overflow-hidden space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-extrabold uppercase tracking-widest text-amber-300">
                    স্পেশাল অফার
                  </span>
                </div>
                <h4 className="font-bengali font-bold text-lg leading-snug">
                  বিকাশ কিংবা ক্যাশ অন ডেলিভারিতে ঝামেলাহীন কেনাকাটা!
                </h4>
                <p className="text-xs text-neutral-300 font-bengali leading-relaxed">
                  যে কোনো ২টির অধিক পোশাক অর্ডারে পেয়ে যাবেন আকর্ষণীয় উপহার ও নিশ্চিত ফ্রি ডেলিভারি।
                </p>
                <button
                  onClick={() => setIsCartDrawerOpen(true)}
                  className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 text-neutral-950 text-xs font-bold font-bengali hover:bg-amber-300 cursor-pointer transition-colors shadow-xs"
                >
                  <span>আপনার ব্যাগ দেখুন ({totalCartCount})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}

          {/* TAB 2: SEARCH VIEW */}
          {activeTab === 'search' && (
            <SearchView
              products={PRODUCTS}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onSelectProduct={(p) => handleSelectProduct(p)}
              onQuickAddToCart={handleQuickAddToCart}
              addedProductId={addedProductId}
            />
          )}

          {/* TAB 3: CART VIEW (or opened via drawer) */}
          {activeTab === 'cart' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <h2 className="font-bengali font-bold text-xl text-neutral-900">
                  আপনার শপিং ব্যাগ
                </h2>
                <span className="text-xs text-neutral-500 font-bengali">
                  মোট {totalCartCount} টি পোশাক
                </span>
              </div>
              {/* Trigger Cart Drawer directly */}
              <div className="bg-white rounded-3xl p-5 border border-neutral-200 text-center space-y-4 shadow-xs">
                <p className="text-sm font-bengali text-neutral-700">
                  আপনার ব্যাগের বিস্তারিত হিসাব ও চেকআউট ড্রয়ারটি ওপেন করতে নিচের বাটনে ক্লিক করুন:
                </p>
                <button
                  onClick={() => setIsCartDrawerOpen(true)}
                  className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm font-bengali shadow-md transition-colors cursor-pointer"
                >
                  ব্যাগ ড্রয়ার ওপেন করুন ({totalCartCount} টি আইটেম)
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE & ORDERS VIEW */}
          {activeTab === 'profile' && (
            <ProfileView
              orders={orders}
              wishlistProducts={wishlistProducts}
              onSelectProduct={(p) => handleSelectProduct(p)}
              onGoToShop={() => setActiveTab('home')}
              onTrackOrder={handleOpenTracking}
              onToggleWishlist={handleToggleWishlist}
            />
          )}
        </main>

        {/* Global Wishlist Toast Notification */}
        <WishlistToast
          toast={wishlistToast}
          onClose={() => setWishlistToast(null)}
          onViewWishlist={() => setActiveTab('profile')}
          onUndo={handleToggleWishlist}
        />

        {/* Product Details Modal with Reviews, Size Guide & Social Share */}
        <ProductDetailModal
          product={selectedProduct}
          isOpen={Boolean(selectedProduct)}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onInstantBuy={handleInstantBuy}
          isWishlisted={selectedProduct ? wishlistIds.has(selectedProduct.id) : false}
          onToggleWishlist={handleToggleWishlist}
          reviews={reviews}
          onAddReview={handleAddReview}
        />

        {/* Working Shopping Cart Drawer */}
        <CartDrawer
          isOpen={isCartDrawerOpen}
          onClose={() => setIsCartDrawerOpen(false)}
          items={cart}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onProceedToCheckout={() => {
            setIsCartDrawerOpen(false);
            setIsCheckoutOpen(true);
          }}
          appliedPromo={appliedPromo}
          onApplyPromo={setAppliedPromo}
          onContinueShopping={() => {
            setIsCartDrawerOpen(false);
            setActiveTab('home');
          }}
        />

        {/* Checkout Modal Form & Success Confirmation */}
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          items={cart}
          appliedPromo={appliedPromo}
          onOrderSuccess={handleOrderSuccess}
          onClearCart={handleClearCart}
          onTrackOrder={handleOpenTracking}
        />

        {/* Order Tracking Modal */}
        <OrderTrackingModal
          isOpen={isTrackingModalOpen}
          onClose={() => setIsTrackingModalOpen(false)}
          orders={orders}
          initialOrderId={trackingOrderId}
        />

        {/* Sticky Mobile Bottom Navigation Bar */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'cart') {
              setIsCartDrawerOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          cartCount={totalCartCount}
        />
      </div>
    </div>
  );
}
