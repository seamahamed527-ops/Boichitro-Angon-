import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Minus,
  Plus,
  ShoppingBag,
  Zap,
  Share2,
  Check,
  Ruler,
  Copy,
} from 'lucide-react';
import { Product, ProductReview } from '../types';
import { SizeGuideModal } from './SizeGuideModal';
import { ProductReviewsSection } from './ProductReviewsSection';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    size: string,
    color: { nameBn: string; nameEn: string; hex: string },
    quantity: number
  ) => void;
  onInstantBuy: (
    product: Product,
    size: string,
    color: { nameBn: string; nameEn: string; hex: string },
    quantity: number
  ) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  reviews?: ProductReview[];
  onAddReview?: (review: {
    productId: string;
    userName: string;
    rating: number;
    comment: string;
  }) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onInstantBuy,
  isWishlisted,
  onToggleWishlist,
  reviews = [],
  onAddReview,
}) => {
  if (!isOpen || !product) return null;

  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [shareCopiedToast, setShareCopiedToast] = useState(false);
  const [wishlistPulsing, setWishlistPulsing] = useState(false);

  // Reset state on product change
  useEffect(() => {
    if (product) {
      setSelectedImage(product.images[0]);
      setSelectedSize(product.sizes[0] || 'M');
      setSelectedColor(product.colors[0]);
      setQuantity(1);
      setShareCopiedToast(false);
      setWishlistPulsing(false);
    }
  }, [product]);

  const handleWishlistToggle = () => {
    setWishlistPulsing(true);
    onToggleWishlist(product);
    setTimeout(() => setWishlistPulsing(false), 450);
  };

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setShareCopiedToast(true);
      setTimeout(() => setShareCopiedToast(false), 2500);
    } catch {
      setShareCopiedToast(true);
      setTimeout(() => setShareCopiedToast(false), 2500);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#product=${product.id}`;
    const shareData = {
      title: `${product.titleBn} - বৈচিত্র্য অঙ্গন`,
      text: `${product.titleBn} | মাত্র ৳${product.price.toLocaleString()} টাকায় বৈচিত্র্য অঙ্গন থেকে কিনুন!`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          copyToClipboard(shareUrl);
        }
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    onInstantBuy(product, selectedSize, selectedColor, quantity);
  };

  const handleReviewSubmit = (reviewData: {
    userName: string;
    rating: number;
    comment: string;
  }) => {
    if (onAddReview) {
      onAddReview({
        productId: product.id,
        ...reviewData,
      });
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
        {/* Modal Container */}
        <div
          className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-neutral-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sticky Header Close & Actions */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 bg-white/90 backdrop-blur-xs z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              পণ্যের বিবরণ • {product.categoryLabelBn}
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Social Share Button */}
              <div className="relative">
                <button
                  id="product-detail-share-btn"
                  onClick={handleShare}
                  className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors cursor-pointer"
                  title="শেয়ার করুন"
                  aria-label="শেয়ার করুন"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                {shareCopiedToast && (
                  <div className="absolute top-10 right-0 z-20 bg-neutral-900 text-white text-[11px] font-bold font-bengali px-2.5 py-1.5 rounded-xl whitespace-nowrap shadow-lg flex items-center gap-1.5 animate-in fade-in">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>লিংক কপি হয়েছে!</span>
                  </div>
                )}
              </div>

              {/* Wishlist Button with Tactile Feedback */}
              <button
                id="product-detail-wishlist-btn"
                onClick={handleWishlistToggle}
                className={`p-2 rounded-full hover:bg-neutral-100 text-neutral-600 transition-all duration-200 cursor-pointer active:scale-75 ${
                  wishlistPulsing
                    ? isWishlisted
                      ? 'animate-heart-pop ring-4 ring-rose-400/40 bg-rose-50 text-rose-600 scale-110'
                      : 'scale-90 bg-neutral-100 text-neutral-400'
                    : ''
                }`}
                title={isWishlisted ? 'পছন্দের তালিকা থেকে সরান' : 'পছন্দের তালিকায় যুক্ত করুন'}
                aria-label="Toggle Wishlist"
              >
                <Heart
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isWishlisted ? 'fill-rose-500 text-rose-500 scale-105' : 'hover:text-rose-500'
                  } ${wishlistPulsing ? 'scale-125' : ''}`}
                />
              </button>

              {/* Close Button */}
              <button
                id="close-product-modal"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="overflow-y-auto p-4 sm:p-5 space-y-4 sm:space-y-5 no-scrollbar">
            {/* Main Image & Gallery */}
            <div className="space-y-3">
              <div className="relative aspect-[4/5] sm:aspect-[4/4.5] w-full rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-100">
                <img
                  src={selectedImage}
                  alt={product.titleBn}
                  className="w-full h-full object-cover object-center"
                />
                {product.discountPercent > 0 && (
                  <div className="absolute top-3 left-3 bg-rose-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-lg shadow-sm">
                    {product.discountPercent}% ছাড়
                  </div>
                )}
              </div>

              {/* Thumbnails if multiple images */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        selectedImage === img
                          ? 'border-rose-600 scale-95 ring-2 ring-rose-200'
                          : 'border-neutral-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Price Section */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                  বৈচিত্র্য অঙ্গন সিগনেচার
                </span>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-neutral-400 font-normal">
                    ({product.reviewsCount} রিভিউ)
                  </span>
                </div>
              </div>

              <h2 className="font-bengali font-bold text-xl sm:text-2xl text-neutral-900 leading-snug">
                {product.titleBn}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                {product.titleEn}
              </p>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="font-extrabold text-2xl sm:text-3xl text-neutral-950 font-bengali">
                  ৳{product.price.toLocaleString()}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm sm:text-base text-neutral-400 line-through font-bengali">
                    ৳{product.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  ৳{(product.originalPrice - product.price).toLocaleString()} সাশ্রয়
                </span>
              </div>
            </div>

            {/* Quick Share Banner / Button */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-bengali">
              <span className="text-neutral-600 font-medium flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-rose-600" />
                পছন্দের মানুষ বা বন্ধুদের সাথে শেয়ার করুন
              </span>
              <button
                onClick={handleShare}
                className="font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-neutral-200 shadow-2xs hover:bg-rose-50 transition-colors cursor-pointer"
              >
                {shareCopiedToast ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">কপি হয়েছে</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>লিংক কপি</span>
                  </>
                )}
              </button>
            </div>

            {/* Color Selector */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-800 font-bengali">
                  রং নির্বাচন করুন:
                </span>
                <span className="font-semibold text-rose-600 font-bengali">
                  {selectedColor.nameBn} ({selectedColor.nameEn})
                </span>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {product.colors.map((c, i) => {
                  const isSelected = selectedColor.nameEn === c.nameEn;
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(c)}
                      title={c.nameBn}
                      className={`group flex items-center gap-2 p-1.5 pr-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-neutral-900 bg-neutral-50 ring-2 ring-neutral-200 shadow-xs'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-black/15 shrink-0 shadow-xs"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-xs font-semibold text-neutral-800 font-bengali">
                        {c.nameBn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector with Size Guide Trigger */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-800 font-bengali">
                  সাইজ নির্বাচন করুন:
                </span>
                <button
                  id="open-size-guide-btn"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 font-bengali cursor-pointer hover:underline"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>সাইজ গাইড দেখুন (Size Guide)</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => {
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`min-w-12 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer font-bengali ${
                        isSelected
                          ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-200'
                          : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 border border-neutral-200'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
              <span className="font-bold text-xs text-neutral-800 font-bengali">
                পরিমাণ (Quantity):
              </span>
              <div className="flex items-center border border-neutral-200 rounded-xl bg-neutral-50 p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-700 hover:bg-white disabled:opacity-30 transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-neutral-900 font-bengali">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-700 hover:bg-white transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Description & Fabric */}
            <div className="space-y-2 pt-2 border-t border-neutral-100 bg-neutral-50/70 p-3.5 rounded-2xl">
              <h4 className="text-xs font-bold text-neutral-900 font-bengali">
                কাপড় ও বৈশিষ্ট্য:
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-bengali">
                {product.descriptionBn}
              </p>
              <div className="text-[11px] text-neutral-700 pt-1 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                <span>ফ্যাব্রিক: {product.fabricBn}</span>
              </div>
            </div>

            {/* Service Perks */}
            <div className="grid grid-cols-3 gap-2 text-center pt-1 text-[11px] text-neutral-600">
              <div className="p-2 rounded-xl bg-neutral-50 flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-rose-600" />
                <span className="font-bengali font-semibold">ক্যাশ অন ডেলিভারি</span>
              </div>
              <div className="p-2 rounded-xl bg-neutral-50 flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-rose-600" />
                <span className="font-bengali font-semibold">৭ দিনের এক্সচেঞ্জ</span>
              </div>
              <div className="p-2 rounded-xl bg-neutral-50 flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                <span className="font-bengali font-semibold">১০০% অরিজিনাল</span>
              </div>
            </div>

            {/* Product Reviews & Rating System */}
            <ProductReviewsSection
              productId={product.id}
              reviews={reviews}
              onAddReview={handleReviewSubmit}
            />
          </div>

          {/* Sticky Action Footer */}
          <div className="p-3 sm:p-4 bg-white border-t border-neutral-200 flex items-center gap-2.5 z-10">
            <button
              id="modal-add-to-cart-btn"
              onClick={handleAdd}
              className="flex-1 py-3 px-3 rounded-xl border-2 border-rose-600 text-rose-600 hover:bg-rose-50 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="font-bengali">
                {addedToast ? '✓ ব্যাগে যোগ হয়েছে' : 'ব্যাগে যোগ করুন'}
              </span>
            </button>

            <button
              id="modal-instant-buy-btn"
              onClick={handleBuyNow}
              className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/20 transition-all cursor-pointer active:scale-95"
            >
              <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span className="font-bengali">এখনই কিনুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={product.category}
      />
    </>
  );
};

