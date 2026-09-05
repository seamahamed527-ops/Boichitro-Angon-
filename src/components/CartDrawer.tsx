import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';
import { CartItem, PromoCode } from '../types';
import { PROMO_CODES } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  appliedPromo: PromoCode | null;
  onApplyPromo: (promo: PromoCode | null) => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedPromo,
  onApplyPromo,
  onContinueShopping,
}) => {
  if (!isOpen) return null;

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 2000;
  const isFreeDelivery = subtotal >= freeShippingThreshold && items.length > 0;
  const deliveryFee = items.length === 0 ? 0 : isFreeDelivery ? 0 : 70;
  const discountAmount = appliedPromo ? Math.round((subtotal * appliedPromo.discountPercent) / 100) : 0;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    const matched = PROMO_CODES.find((p) => p.code === code);
    if (matched) {
      onApplyPromo(matched);
      setPromoInput('');
    } else {
      setPromoError('অকার্যকর কুপন কোড! ট্রাই করুন: BOICHITRO10');
    }
  };

  const handleRemoveCoupon = () => {
    onApplyPromo(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Drawer Body */}
      <div
        className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl border-l border-neutral-200 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-neutral-200 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bengali font-bold text-base text-neutral-900 leading-none">
                আপনার শপিং ব্যাগ
              </h3>
              <span className="text-[11px] text-neutral-500 font-medium">
                {items.length} টি আইটেম যুক্ত রয়েছে
              </span>
            </div>
          </div>
          <button
            id="close-cart-drawer"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        {items.length > 0 && (
          <div className="bg-rose-50/70 border-b border-rose-100 px-4 py-2.5">
            <div className="flex items-center justify-between text-xs mb-1.5 font-bengali font-semibold text-neutral-800">
              {isFreeDelivery ? (
                <span className="flex items-center gap-1 text-emerald-700">
                  <Check className="w-4 h-4" /> অভিনন্দন! ফ্রি ডেলিভারি আনলক হয়েছে!
                </span>
              ) : (
                <span>
                  আর মাত্র <strong className="text-rose-600 font-bold">৳{(freeShippingThreshold - subtotal).toLocaleString()}</strong> টাকার কেনাকাটায় ফ্রি ডেলিভারি!
                </span>
              )}
              <span className="text-[10px] text-neutral-500">৳২,০০০ থ্রেশহোল্ড</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-300"
                style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                <ShoppingBag className="w-10 h-10 stroke-1" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bengali font-bold text-lg text-neutral-900">
                  আপনার ব্যাগ বর্তমানে খালি!
                </h4>
                <p className="text-xs text-neutral-500 max-w-xs font-bengali">
                  পছন্দের পাঞ্জাবি, শাড়ি কিংবা কুর্তি খুঁজে নিয়ে খুব সহজেই আপনার ব্যাগে যোগ করুন।
                </p>
              </div>
              <button
                id="empty-cart-shop-now"
                onClick={onContinueShopping}
                className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-rose-600 text-white text-xs font-bold font-bengali transition-colors shadow-sm cursor-pointer"
              >
                নতুন কালেকশন দেখুন
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 hover:border-neutral-300 transition-all"
              >
                {/* Thumbnail */}
                <img
                  src={item.product.images[0]}
                  alt={item.product.titleBn}
                  className="w-18 h-20 rounded-xl object-cover object-center bg-white border border-neutral-200 shrink-0"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h5 className="font-bengali font-bold text-xs sm:text-sm text-neutral-900 truncate">
                    {item.product.titleBn}
                  </h5>
                  <div className="flex items-center gap-2 my-1 text-[11px] text-neutral-500">
                    <span className="bg-white border border-neutral-200 px-1.5 py-0.5 rounded font-bold text-neutral-700 font-bengali">
                      {item.selectedSize}
                    </span>
                    <span className="flex items-center gap-1 font-bengali">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-neutral-300 inline-block"
                        style={{ backgroundColor: item.selectedColor.hex }}
                      />
                      {item.selectedColor.nameBn}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-extrabold text-sm text-neutral-900 font-bengali">
                      ৳{(item.product.price * item.quantity).toLocaleString()}
                    </span>

                    {/* Stepper & Trash */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center bg-white border border-neutral-200 rounded-lg p-0.5 shadow-2xs">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 rounded cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold font-bengali text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 rounded cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer rounded-lg hover:bg-rose-50"
                        title="রিমুভ করুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Calculations and Checkout CTA */}
        {items.length > 0 && (
          <div className="border-t border-neutral-200 bg-white p-4 space-y-3 shadow-lg">
            {/* Promo Code Input */}
            <div className="space-y-1">
              {appliedPromo ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>কুপন কোড: {appliedPromo.code} ({appliedPromo.discountPercent}% ছাড়)</span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
                  >
                    বাতিল
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-1.5">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="কুপন কোড দিন (যেমন: BOICHITRO10)"
                      className="w-full pl-8 pr-3 py-2 text-xs uppercase rounded-xl border border-neutral-200 focus:outline-rose-600 bg-neutral-50"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer shrink-0 font-bengali"
                  >
                    প্রয়োগ
                  </button>
                </form>
              )}
              {promoError && (
                <p className="text-[11px] text-rose-600 font-medium font-bengali">
                  {promoError}
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-neutral-600 border-t border-neutral-100 pt-2 font-bengali">
              <div className="flex justify-between">
                <span>সাবটোটাল</span>
                <span className="font-bold text-neutral-900">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>ডেলিভারি চার্জ</span>
                <span className={`font-bold ${deliveryFee === 0 ? 'text-emerald-600' : 'text-neutral-900'}`}>
                  {deliveryFee === 0 ? 'ফ্রি ডেলিভারি' : `৳${deliveryFee}`}
                </span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>ডিসকাউন্ট ({appliedPromo.code})</span>
                  <span>-৳{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-neutral-950 border-t border-neutral-200 pt-1.5">
                <span>সর্বমোট (Total)</span>
                <span className="text-rose-600">৳{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              id="cart-proceed-checkout-btn"
              onClick={onProceedToCheckout}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 active:scale-98 transition-all cursor-pointer font-bengali"
            >
              <span>চেকআউটে এগিয়ে যান (৳{total.toLocaleString()})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
