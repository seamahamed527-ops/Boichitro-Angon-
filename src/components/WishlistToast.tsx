import React, { useEffect } from 'react';
import { Heart, HeartCrack, X, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { Product } from '../types';

export interface WishlistToastData {
  id: string;
  product: Product;
  action: 'added' | 'removed';
}

interface WishlistToastProps {
  toast: WishlistToastData | null;
  onClose: () => void;
  onViewWishlist: () => void;
  onUndo: (product: Product) => void;
}

export const WishlistToast: React.FC<WishlistToastProps> = ({
  toast,
  onClose,
  onViewWishlist,
  onUndo,
}) => {
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3800);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isAdded = toast.action === 'added';

  return (
    <div
      id="wishlist-toast"
      role="alert"
      aria-live="polite"
      className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[70] w-[92%] max-w-md pointer-events-auto transition-all duration-300 transform animate-in fade-in slide-in-from-top-4"
    >
      <div
        className={`relative overflow-hidden rounded-2xl shadow-2xl border backdrop-blur-md transition-all font-bengali ${
          isAdded
            ? 'bg-neutral-900/95 text-white border-rose-500/40 shadow-rose-950/30'
            : 'bg-neutral-900/95 text-white border-neutral-700/60 shadow-neutral-950/40'
        }`}
      >
        {/* Subtle accent bar at top */}
        <div
          className={`h-1 w-full ${
            isAdded
              ? 'bg-gradient-to-r from-rose-600 via-pink-500 to-amber-500'
              : 'bg-gradient-to-r from-neutral-600 to-neutral-500'
          }`}
        />

        <div className="p-3 sm:p-3.5 flex items-center gap-3">
          {/* Product Thumbnail with Badge */}
          <div className="relative w-12 h-14 sm:w-13 sm:h-15 rounded-xl overflow-hidden bg-neutral-800 shrink-0 border border-white/10 shadow-xs">
            <img
              src={toast.product.images[0]}
              alt={toast.product.titleBn}
              className="w-full h-full object-cover"
            />
            <div
              className={`absolute bottom-0 inset-x-0 py-0.5 flex items-center justify-center text-[9px] font-bold ${
                isAdded ? 'bg-rose-600 text-white' : 'bg-neutral-800 text-neutral-300'
              }`}
            >
              {isAdded ? 'যুক্ত' : 'বাদ'}
            </div>
          </div>

          {/* Text Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  isAdded
                    ? 'bg-rose-500/20 text-rose-400'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {isAdded ? (
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
                ) : (
                  <HeartCrack className="w-3.5 h-3.5" />
                )}
              </div>
              <span
                className={`text-xs font-bold ${
                  isAdded ? 'text-rose-400' : 'text-neutral-400'
                }`}
              >
                {isAdded ? 'পছন্দের তালিকায় যুক্ত হয়েছে' : 'তালিকা থেকে সরানো হয়েছে'}
              </span>
            </div>

            <h5 className="text-xs sm:text-sm font-bold text-white truncate max-w-[210px] sm:max-w-[240px]">
              {toast.product.titleBn}
            </h5>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-bold text-amber-400">
                ৳{toast.product.price.toLocaleString()}
              </span>
              <span className="text-[10px] text-neutral-400">•</span>
              <span className="text-[10px] text-neutral-300">
                {toast.product.categoryLabelBn}
              </span>
            </div>
          </div>

          {/* Action Button & Close */}
          <div className="flex flex-col items-end gap-1.5 shrink-0 pl-1">
            <button
              id="wishlist-toast-close"
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>

            {isAdded ? (
              <button
                id="wishlist-toast-view-action"
                onClick={() => {
                  onClose();
                  onViewWishlist();
                }}
                className="inline-flex items-center gap-1 text-[11px] font-bold bg-rose-600 hover:bg-rose-500 text-white px-2.5 py-1 rounded-lg shadow-sm transition-all cursor-pointer active:scale-95 whitespace-nowrap"
              >
                <span>দেখুন</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <button
                id="wishlist-toast-undo-action"
                onClick={() => {
                  onUndo(toast.product);
                  onClose();
                }}
                className="inline-flex items-center gap-1 text-[11px] font-bold bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-300/30 px-2.5 py-1 rounded-lg shadow-sm transition-all cursor-pointer active:scale-95 whitespace-nowrap"
              >
                <RotateCcw className="w-3 h-3 text-amber-400" />
                <span>ফিরিয়ে আনুন</span>
              </button>
            )}
          </div>
        </div>

        {/* Animated Timer Progress Bar */}
        <div className="h-0.5 w-full bg-neutral-800 overflow-hidden">
          <div
            className={`h-full origin-left animate-[linear_shrink_3800ms_forwards] ${
              isAdded ? 'bg-rose-500' : 'bg-neutral-500'
            }`}
            style={{
              animation: 'shrink 3.8s linear forwards',
            }}
          />
        </div>
      </div>
    </div>
  );
};
