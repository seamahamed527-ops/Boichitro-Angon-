import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, Phone, User, MapPin, FileText, ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { CartItem, Order, PromoCode } from '../types';
import { createTrackingForNewOrder } from '../data/mockOrders';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedPromo: PromoCode | null;
  onOrderSuccess: (order: Order) => void;
  onClearCart: () => void;
  onTrackOrder?: (orderNumber: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  appliedPromo,
  onOrderSuccess,
  onClearCart,
  onTrackOrder,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash'>('cod');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Financial calculations
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const isFreeDelivery = subtotal >= 2000;
  const deliveryFee = isFreeDelivery ? 0 : city === 'inside_dhaka' ? 70 : 130;
  const discountAmount = appliedPromo ? Math.round((subtotal * appliedPromo.discountPercent) / 100) : 0;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) {
      errs.customerName = 'আপনার নাম লিখুন';
    }
    const cleanPhone = phone.trim().replace(/[- ]/g, '');
    if (!cleanPhone) {
      errs.phone = 'সচল মোবাইল নম্বর দিন';
    } else if (!/^(?:\+88|88)?01[3-9]\d{8}$/.test(cleanPhone)) {
      errs.phone = 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01712345678)';
    }
    if (!address.trim()) {
      errs.address = 'সম্পূর্ণ ডেলিভারি ঠিকানা লিখুন';
    } else if (address.trim().length < 8) {
      errs.address = 'অনুগ্রহ করে বিস্তারিত ঠিকানা দিন (রোড/বাড়ি/থানা)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate instant order confirmation
    setTimeout(() => {
      const randomId = Math.floor(100000 + Math.random() * 900000);
      const orderNum = `BA-${randomId}`;
      const cityName = city === 'inside_dhaka' ? 'ঢাকা সিটির ভেতরে' : 'ঢাকার বাইরে';
      const createdDateStr = new Date().toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const trackingInfo = createTrackingForNewOrder({
        id: orderNum,
        orderNumber: orderNum,
        city: cityName,
        createdAt: createdDateStr,
      });

      const newOrder: Order = {
        id: orderNum,
        orderNumber: orderNum,
        items: [...items],
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: cityName,
        note: note.trim() || undefined,
        paymentMethod,
        subtotal,
        deliveryFee,
        discount: discountAmount,
        total,
        status: 'নিশ্চিত হয়েছে (Confirmed)',
        createdAt: createdDateStr,
        ...trackingInfo,
      };

      setConfirmedOrder(newOrder);
      onOrderSuccess(newOrder);
      onClearCart();
      setIsSubmitting(false);
    }, 600);
  };

  const handleCloseAll = () => {
    setConfirmedOrder(null);
    onClose();
  };

  const handleTrackThisOrder = () => {
    if (confirmedOrder && onTrackOrder) {
      const num = confirmedOrder.orderNumber;
      handleCloseAll();
      onTrackOrder(num);
    } else {
      handleCloseAll();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity overflow-y-auto">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bengali font-bold text-base text-neutral-900 leading-none">
                {confirmedOrder ? 'অর্ডার সফল হয়েছে' : 'সহজ চেকআউট'}
              </h3>
              <span className="text-[11px] text-neutral-500 font-medium">
                বৈচিত্র্য অঙ্গন • নিশ্চিত ক্যাশ অন ডেলিভারি
              </span>
            </div>
          </div>
          <button
            onClick={handleCloseAll}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto p-5 no-scrollbar">
          {confirmedOrder ? (
            /* Success State */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
                  অর্ডার কোড: #{confirmedOrder.orderNumber}
                </span>
                <h4 className="font-bengali font-bold text-xl text-neutral-900 pt-2">
                  ধন্যবাদ, {confirmedOrder.customerName}!
                </h4>
                <p className="text-xs text-neutral-600 max-w-sm mx-auto font-bengali">
                  আপনার পোশাকের অর্ডারটি সফলভাবে গৃহীত হয়েছে। খুব শীঘ্রই আমাদের প্রতিনিধি আপনাকে ফোন করে ডেলিভারি নিশ্চিত করবেন।
                </p>
              </div>

              {/* Order Receipt Box */}
              <div className="bg-neutral-50 rounded-2xl p-4 text-left border border-neutral-200/80 space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-neutral-200 pb-2">
                  <span className="text-neutral-500 font-medium">পেমেন্ট মেথড:</span>
                  <span className="font-bold text-neutral-800 flex items-center gap-1 font-bengali">
                    <Truck className="w-3.5 h-3.5 text-rose-600" /> ক্যাশ অন ডেলিভারি (COD)
                  </span>
                </div>
                <div className="flex justify-between border-b border-neutral-200 pb-2">
                  <span className="text-neutral-500 font-medium">ডেলিভারি ঠিকানা:</span>
                  <span className="font-bold text-neutral-800 max-w-[200px] text-right font-bengali truncate">
                    {confirmedOrder.address}, {confirmedOrder.city}
                  </span>
                </div>
                <div className="flex justify-between border-b border-neutral-200 pb-2">
                  <span className="text-neutral-500 font-medium">মোবাইল নম্বর:</span>
                  <span className="font-bold text-neutral-800">{confirmedOrder.phone}</span>
                </div>
                <div className="flex justify-between items-center pt-1 text-sm font-extrabold text-neutral-950">
                  <span className="font-bengali">পরিশোধযোগ্য মোট টাকা:</span>
                  <span className="text-rose-600 font-bengali text-base">
                    ৳{confirmedOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Delivery Assurance */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/70 text-xs text-amber-900 font-bengali flex items-center gap-2 text-left">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                <span>
                  পণ্য হাতে পেয়ে দেখে নেওয়ার সুযোগ রয়েছে। কোনো সমস্যা হলে ৭ দিনের মধ্যে পরিবর্তনযোগ্য।
                </span>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  id="checkout-track-btn"
                  onClick={handleTrackThisOrder}
                  className="w-full py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold font-bengali flex items-center justify-center gap-2 transition-colors shadow-md shadow-rose-600/20 cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  <span>লাইভ ডেলিভারি ট্র্যাক করুন</span>
                </button>
                <button
                  id="checkout-continue-btn"
                  onClick={handleCloseAll}
                  className="w-full py-3 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs sm:text-sm font-bold font-bengali transition-colors cursor-pointer"
                >
                  আরও কেনাকাটা করুন
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Order Brief Strip */}
              <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200/80 flex items-center justify-between text-xs font-bengali">
                <div className="flex items-center gap-2 text-neutral-700">
                  <span className="font-bold">{items.length} টি পোশাক</span>
                  <span className="text-neutral-400">•</span>
                  <span>{items.map(i => i.product.titleBn).slice(0, 2).join(', ')}{items.length > 2 ? '...' : ''}</span>
                </div>
                <span className="font-extrabold text-rose-600 text-sm">
                  ৳{total.toLocaleString()}
                </span>
              </div>

              {/* Customer Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5 font-bengali">
                  <User className="w-3.5 h-3.5 text-rose-600" />
                  আপনার সম্পূর্ণ নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="যেমন: তানভীর আহমেদ"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-neutral-50 focus:bg-white focus:outline-rose-600 transition-colors ${
                    errors.customerName ? 'border-rose-500 bg-rose-50/30' : 'border-neutral-200'
                  }`}
                />
                {errors.customerName && (
                  <p className="text-[11px] text-rose-600 font-medium font-bengali">{errors.customerName}</p>
                )}
              </div>

              {/* Mobile Phone Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5 font-bengali">
                  <Phone className="w-3.5 h-3.5 text-rose-600" />
                  মোবাইল নম্বর <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                    +৮৮
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01712345678"
                    className={`w-full pl-11 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-neutral-50 focus:bg-white focus:outline-rose-600 transition-colors ${
                      errors.phone ? 'border-rose-500 bg-rose-50/30' : 'border-neutral-200'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-[11px] text-rose-600 font-medium font-bengali">{errors.phone}</p>
                )}
              </div>

              {/* City / Delivery Area Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5 font-bengali">
                  <Truck className="w-3.5 h-3.5 text-rose-600" />
                  ডেলিভারি এলাকা নির্বাচন করুন <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCity('inside_dhaka')}
                    className={`p-3 rounded-xl border text-left flex flex-col transition-all cursor-pointer ${
                      city === 'inside_dhaka'
                        ? 'border-neutral-900 bg-neutral-50 ring-2 ring-neutral-200'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <span className="text-xs font-bold text-neutral-900 font-bengali">ঢাকা সিটির ভেতর</span>
                    <span className="text-[11px] text-neutral-500 font-bengali">
                      {isFreeDelivery ? 'ফ্রি ডেলিভারি' : 'চার্জ: ৳৭০ (২ দিন)'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCity('outside_dhaka')}
                    className={`p-3 rounded-xl border text-left flex flex-col transition-all cursor-pointer ${
                      city === 'outside_dhaka'
                        ? 'border-neutral-900 bg-neutral-50 ring-2 ring-neutral-200'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <span className="text-xs font-bold text-neutral-900 font-bengali">ঢাকার বাইরে (সারাদেশ)</span>
                    <span className="text-[11px] text-neutral-500 font-bengali">
                      {isFreeDelivery ? 'ফ্রি ডেলিভারি' : 'চার্জ: ৳১৩০ (৩ দিন)'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Full Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5 font-bengali">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  সম্পূর্ণ ডেলিভারি ঠিকানা <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="বাড়ি নং, রোড নং, এলাকা/মহল্লা, থানা ও জেলা..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm bg-neutral-50 focus:bg-white focus:outline-rose-600 transition-colors ${
                    errors.address ? 'border-rose-500 bg-rose-50/30' : 'border-neutral-200'
                  }`}
                />
                {errors.address && (
                  <p className="text-[11px] text-rose-600 font-medium font-bengali">{errors.address}</p>
                )}
              </div>

              {/* Delivery Note */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-600 flex items-center gap-1.5 font-bengali">
                  <FileText className="w-3.5 h-3.5 text-neutral-400" />
                  বিশেষ কোনো নির্দেশনা (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="যেমন: দুপুরের পর ডেলিভারি দিলে ভালো হয়"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs bg-neutral-50 focus:bg-white focus:outline-rose-600"
                />
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-neutral-800 font-bengali">
                  পেমেন্ট পদ্ধতি:
                </label>
                <div className="space-y-2">
                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-rose-600 bg-rose-50/40 ring-1 ring-rose-200'
                        : 'border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 accent-rose-600 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bengali font-bold text-xs text-neutral-900">
                          ক্যাশ অন ডেলিভারি (Cash on Delivery)
                        </span>
                        <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                          জনপ্রিয়
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 font-bengali mt-0.5">
                        কোনো অগ্রিম পেমেন্ট নেই! পণ্য হাতে পেয়ে কোয়ালিটি যাচাই করে মূল্য পরিশোধ করুন।
                      </p>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('bkash')}
                    className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'bkash'
                        ? 'border-rose-600 bg-rose-50/40 ring-1 ring-rose-200'
                        : 'border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'bkash'}
                      onChange={() => setPaymentMethod('bkash')}
                      className="mt-1 accent-rose-600 cursor-pointer"
                    />
                    <div className="flex-1">
                      <span className="font-bengali font-bold text-xs text-neutral-900">
                        বিকাশ / নগদ / কার্ড (অনলাইন পেমেন্ট)
                      </span>
                      <p className="text-[11px] text-neutral-500 font-bengali mt-0.5">
                        অর্ডার নিশ্চিতের পর আমাদের প্রতিনিধি বিকাশ মার্চেন্ট নম্বর পাঠাবেন।
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Price Overview Breakdown */}
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1.5 text-xs text-neutral-600 font-bengali">
                <div className="flex justify-between">
                  <span>পোশাকের মূল্য</span>
                  <span className="font-bold text-neutral-900">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>ডেলিভারি চার্জ</span>
                  <span className={`font-bold ${deliveryFee === 0 ? 'text-emerald-600' : 'text-neutral-900'}`}>
                    {deliveryFee === 0 ? 'ফ্রি ডেলিভারি' : `৳${deliveryFee}`}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>কুপন ছাড়</span>
                    <span>-৳{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-neutral-950 border-t border-neutral-200 pt-1.5">
                  <span>সর্বমোট বিল</span>
                  <span className="text-rose-600 text-base">৳{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Confirm Order Button */}
              <button
                id="submit-checkout-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25 active:scale-98 transition-all cursor-pointer font-bengali disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>অর্ডার প্রসেস হচ্ছে...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>অর্ডার নিশ্চিত করুন • ৳{total.toLocaleString()}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
