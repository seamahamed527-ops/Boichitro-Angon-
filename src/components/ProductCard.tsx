import React, { useState } from 'react';
import { Heart, Star, Plus, Check, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
  isAddedJustNow?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onSelectProduct,
  onQuickAddToCart,
  isAddedJustNow = false,
}) => {
  const [isPulsing, setIsPulsing] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'added' | 'removed' | null>(null);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const willBeWishlisted = !isWishlisted;
    setIsPulsing(true);
    setFeedbackType(willBeWishlisted ? 'added' : 'removed');
    onToggleWishlist(product);

    setTimeout(() => {
      setIsPulsing(false);
    }, 450);

    setTimeout(() => {
      setFeedbackType(null);
    }, 850);
  };
  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative bg-white rounded-2xl border border-neutral-200/80 hover:border-neutral-300 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-neutral-200/60"
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 cursor-pointer">
        <img
          src={product.images[0]}
          alt={product.titleBn}
          onClick={() => onSelectProduct(product)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Discount & Special Tags */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start pointer-events-none">
          {product.discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-extrabold bg-rose-600 text-white shadow-xs">
              {product.discountPercent}% ছাড়
            </span>
          )}
          {product.tagBn && (
            <span className="px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold bg-neutral-900/85 backdrop-blur-xs text-amber-300">
              {product.tagBn}
            </span>
          )}
        </div>

        {/* Wishlist Button with Visual Feedback */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col items-end">
          <button
            id={`wishlist-btn-${product.id}`}
            onClick={handleWishlistClick}
            aria-label="Add to wishlist"
            className={`w-8 h-8 rounded-full bg-white/95 hover:bg-white text-neutral-700 shadow-sm flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-75 ${
              isPulsing
                ? isWishlisted
                  ? 'animate-heart-pop ring-4 ring-rose-400/50 shadow-md scale-110'
                  : 'scale-90 ring-2 ring-neutral-300'
                : 'hover:scale-105'
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-transform duration-300 ${
                isWishlisted
                  ? 'fill-rose-500 text-rose-500 scale-105'
                  : 'text-neutral-600 hover:text-rose-500'
              } ${isPulsing ? 'scale-125' : ''}`}
            />
          </button>

          {/* Micro Floating Feedback Indicator */}
          {feedbackType && (
            <div
              className={`absolute top-9 right-0 pointer-events-none whitespace-nowrap text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md animate-float-fade-up font-bengali flex items-center gap-1 z-20 ${
                feedbackType === 'added'
                  ? 'bg-rose-600 text-white'
                  : 'bg-neutral-800 text-neutral-200'
              }`}
            >
              {feedbackType === 'added' ? (
                <>
                  <Heart className="w-2.5 h-2.5 fill-current" />
                  <span>পছন্দে যুক্ত</span>
                </>
              ) : (
                <span>সরানো হয়েছে</span>
              )}
            </div>
          )}
        </div>

        {/* Category Pill */}
        <div className="absolute bottom-2 left-2.5">
          <span className="text-[10px] font-semibold text-white/95 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-full">
            {product.categoryLabelBn}
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between">
        <div onClick={() => onSelectProduct(product)} className="cursor-pointer">
          {/* Rating */}
          <div className="flex items-center gap-1 mb-1">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-[11px] font-bold text-neutral-800">{product.rating}</span>
            <span className="text-[10px] text-neutral-600 font-medium">({product.reviewsCount})</span>
          </div>

          {/* Title */}
          <h4 className="font-bengali font-bold text-sm sm:text-base text-neutral-900 line-clamp-1 group-hover:text-rose-600 transition-colors">
            {product.titleBn}
          </h4>
          <p className="text-[11px] text-neutral-600 line-clamp-1 mb-2">
            {product.titleEn}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-base sm:text-lg text-neutral-950 leading-none">
                ৳{product.price.toLocaleString()}
              </span>
            </div>
            {product.originalPrice > product.price && (
              <span className="text-[11px] text-neutral-600 line-through font-medium">
                ৳{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            id={`add-to-cart-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickAddToCart(product);
            }}
            className={`flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95 shadow-xs ${
              isAddedJustNow
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-600 hover:bg-rose-700 text-white'
            }`}
          >
            {isAddedJustNow ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="font-bengali">যোগ হয়েছে</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span className="font-bengali">অর্ডার করুন</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
