import React, { useState } from 'react';
import { Clock, Trash2, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface RecentlyViewedSectionProps {
  products: Product[];
  wishlistIds: Set<string>;
  onToggleWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
  onClear: () => void;
}

export const RecentlyViewedSection: React.FC<RecentlyViewedSectionProps> = ({
  products,
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onQuickAddToCart,
  onClear,
}) => {
  const [pulsingId, setPulsingId] = useState<string | null>(null);

  if (products.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200/80 shadow-xs space-y-3 font-bengali">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base text-neutral-900 leading-tight">
              সম্প্রতি দেখা পোশাক (Recently Viewed)
            </h4>
            <span className="text-[11px] text-neutral-400 font-medium">
              আপনার দেখা শেষ {products.length} টি আইটেম
            </span>
          </div>
        </div>

        <button
          onClick={onClear}
          className="text-xs text-neutral-400 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
          title="হিস্ট্রি মুছে ফেলুন"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">মুছে ফেলুন</span>
        </button>
      </div>

      {/* Horizontal Scroll Carousel */}
      <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar py-1">
        {products.map((product) => {
          const isWishlisted = wishlistIds.has(product.id);

          return (
            <div
              key={product.id}
              className="w-40 sm:w-44 shrink-0 rounded-2xl bg-neutral-50/90 border border-neutral-200 hover:border-rose-300 transition-all p-2 flex flex-col justify-between group shadow-2xs"
            >
              <div
                onClick={() => onSelectProduct(product)}
                className="cursor-pointer space-y-2"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-neutral-200">
                  <img
                    src={product.images[0]}
                    alt={product.titleBn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.discountPercent > 0 && (
                    <span className="absolute top-1.5 left-1.5 bg-rose-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-md shadow-xs">
                      {product.discountPercent}% ছাড়
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPulsingId(product.id);
                      onToggleWishlist(product);
                      setTimeout(() => setPulsingId(null), 450);
                    }}
                    className={`absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-neutral-600 hover:text-rose-600 transition-all duration-200 shadow-xs cursor-pointer active:scale-75 ${
                      pulsingId === product.id
                        ? isWishlisted
                          ? 'animate-heart-pop ring-2 ring-rose-400/50 scale-110'
                          : 'scale-90'
                        : ''
                    }`}
                    aria-label="Wishlist toggle"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${
                        isWishlisted ? 'fill-rose-500 text-rose-500' : ''
                      } ${pulsingId === product.id ? 'scale-125' : ''}`}
                    />
                  </button>
                </div>

                {/* Details */}
                <div>
                  <h5 className="font-bold text-xs text-neutral-900 line-clamp-1 leading-snug">
                    {product.titleBn}
                  </h5>
                  <div className="flex items-baseline gap-1.5 pt-0.5">
                    <span className="font-extrabold text-xs text-neutral-900">
                      ৳{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-[10px] text-neutral-400 line-through">
                        ৳{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Action Button */}
              <div className="pt-2 mt-1 border-t border-neutral-200/60 flex items-center gap-1.5">
                <button
                  onClick={() => onQuickAddToCart(product)}
                  className="flex-1 py-1 px-2 rounded-lg bg-white hover:bg-rose-50 text-rose-600 border border-neutral-200 hover:border-rose-300 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
                >
                  <ShoppingBag className="w-3 h-3" />
                  <span>ব্যাগে নিন</span>
                </button>
                <button
                  onClick={() => onSelectProduct(product)}
                  className="p-1 rounded-lg bg-neutral-900 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                  title="বিস্তারিত দেখুন"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
