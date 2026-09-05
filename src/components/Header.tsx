import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, Heart, Sparkles, Truck } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenWishlist: () => void;
  onOpenTracking: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenSearch,
  onOpenWishlist,
  onOpenTracking,
}) => {
  const [isWishlistBumping, setIsWishlistBumping] = useState(false);
  const prevWishlistCount = useRef(wishlistCount);

  useEffect(() => {
    if (prevWishlistCount.current !== wishlistCount) {
      setIsWishlistBumping(true);
      const timer = setTimeout(() => setIsWishlistBumping(false), 450);
      prevWishlistCount.current = wishlistCount;
      return () => clearTimeout(timer);
    }
  }, [wishlistCount]);
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 transition-all shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 text-white text-xs py-1.5 px-3">
        <div className="max-w-md md:max-w-4xl mx-auto flex items-center justify-between font-medium">
          <div className="flex items-center gap-1.5 truncate">
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-300 animate-pulse" />
            <span className="truncate">নতুন বৈশাখী কালেকশনে ২০% ছাড় • কোড: <strong className="underline tracking-wider font-bold">BOICHITRO10</strong></span>
          </div>
          <button
            onClick={onOpenTracking}
            className="flex items-center gap-1 text-[11px] bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-full shrink-0 cursor-pointer transition-colors"
          >
            <Truck className="w-3 h-3" />
            <span>অর্ডার ট্র্যাকিং</span>
          </button>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-md md:max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-amber-600 flex items-center justify-center text-white shadow-md shadow-rose-600/20 ring-2 ring-rose-100">
            <span className="font-bengali font-bold text-xl leading-none">বৈ</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <h1 className="font-bengali font-bold text-xl md:text-2xl text-neutral-900 tracking-tight leading-none">
                বৈচিত্র্য অঙ্গন
              </h1>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 inline-block animate-ping"></span>
            </div>
            <span className="text-[10px] tracking-widest text-neutral-500 uppercase font-semibold">
              Boichitro Angon • Fashion
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Track Order Button */}
          <button
            id="header-track-btn"
            onClick={onOpenTracking}
            title="অর্ডার ট্র্যাক করুন"
            aria-label="Track your order"
            className="p-2.5 rounded-xl text-neutral-700 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer active:scale-95"
          >
            <Truck className="w-5 h-5" />
          </button>

          {/* Quick Search Button */}
          <button
            id="header-search-btn"
            onClick={onOpenSearch}
            aria-label="Search clothing"
            className="p-2.5 rounded-xl text-neutral-700 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer active:scale-95"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Button */}
          <button
            id="header-wishlist-btn"
            onClick={onOpenWishlist}
            aria-label="Wishlist items"
            className="p-2.5 rounded-xl text-neutral-700 hover:text-rose-600 hover:bg-rose-50 transition-all relative cursor-pointer active:scale-95"
          >
            <Heart
              className={`w-5 h-5 transition-transform duration-300 ${
                wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''
              } ${isWishlistBumping ? 'animate-heart-pop scale-125 text-rose-600' : ''}`}
            />
            {wishlistCount > 0 && (
              <span
                className={`absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-600 text-[10px] font-bold text-white flex items-center justify-center shadow-xs transition-transform duration-300 ${
                  isWishlistBumping ? 'scale-125 ring-2 ring-rose-300' : ''
                }`}
              >
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Cart Button */}
          <button
            id="header-cart-btn"
            onClick={onOpenCart}
            aria-label="Shopping Cart"
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-rose-700 text-white transition-all shadow-sm active:scale-95 cursor-pointer ml-1"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-amber-400 text-neutral-950 text-[10px] font-extrabold flex items-center justify-center shadow-xs animate-bounce">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-xs font-semibold hidden sm:inline-block">ব্যাগ</span>
          </button>
        </div>
      </div>
    </header>
  );
};

