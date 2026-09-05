import React, { useState } from 'react';
import { User, Package, Phone, Heart, ShieldCheck, MapPin, Clock, ExternalLink, Truck, Search, ArrowRight } from 'lucide-react';
import { Order, Product } from '../types';

interface ProfileViewProps {
  orders: Order[];
  wishlistProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onGoToShop: () => void;
  onTrackOrder: (orderNumber: string) => void;
  onToggleWishlist?: (product: Product) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  orders,
  wishlistProducts,
  onSelectProduct,
  onGoToShop,
  onTrackOrder,
  onToggleWishlist,
}) => {
  const [quickTrackInput, setQuickTrackInput] = useState('');

  const handleQuickTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTrackInput.trim()) {
      onTrackOrder(quickTrackInput.trim());
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Profile Card */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-rose-950 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-40 h-40 bg-rose-600/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white text-xl font-bold ring-4 ring-white/10 shadow-md">
            <User className="w-7 h-7" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bengali font-bold text-lg text-white">
                সম্মানিত গ্রাহক
              </h3>
              <span className="text-[10px] font-extrabold uppercase bg-amber-400 text-neutral-950 px-2 py-0.5 rounded-full">
                VIP Club
              </span>
            </div>
            <p className="text-xs text-neutral-300 font-bengali">
              বৈচিত্র্য অঙ্গন পরিবারের সাথে কেনাকাটায় স্বাগতম
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/10 text-center font-bengali text-xs">
          <div className="bg-white/5 rounded-xl p-2">
            <span className="block text-amber-400 font-bold text-base">{orders.length}</span>
            <span className="text-neutral-400 text-[11px]">মোট অর্ডার</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2">
            <span className="block text-rose-400 font-bold text-base">{wishlistProducts.length}</span>
            <span className="text-neutral-400 text-[11px]">পছন্দের তালিকা</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2">
            <span className="block text-emerald-400 font-bold text-base">১০০%</span>
            <span className="text-neutral-400 text-[11px]">নিরাপদ COD</span>
          </div>
        </div>
      </div>

      {/* Quick Order Tracking Card */}
      <div className="bg-gradient-to-r from-rose-50 via-white to-amber-50 rounded-3xl p-4 sm:p-5 border border-rose-200/70 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="font-bengali font-bold text-sm sm:text-base text-neutral-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-rose-600" />
            অর্ডার ট্র্যাক করুন (Live Tracking)
          </h4>
          <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full font-bengali">
            রিয়েলটাইম আপডেট
          </span>
        </div>
        <p className="text-xs text-neutral-600 font-bengali">
          আপনার অর্ডার আইডি দিন এবং পার্সেলটি কোথায় আছে তাৎক্ষণিক দেখে নিন:
        </p>

        <form onSubmit={handleQuickTrackSubmit} className="flex gap-1.5 pt-1">
          <div className="relative flex-1">
            <input
              type="text"
              value={quickTrackInput}
              onChange={(e) => setQuickTrackInput(e.target.value)}
              placeholder="অর্ডার আইডি (যেমন: BA-748291)"
              className="w-full px-3.5 py-2 text-xs uppercase font-semibold rounded-xl border border-neutral-200 bg-white focus:outline-rose-600"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold font-bengali flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
          >
            <span>ট্র্যাক করুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Order History Section */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bengali font-bold text-base text-neutral-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-rose-600" />
            আপনার অর্ডার সমূহ ({orders.length})
          </h4>
          {orders.length > 0 && (
            <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md font-bengali">
              সক্রিয় ট্র্যাকিং
            </span>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-6 space-y-2 border border-dashed border-neutral-200 rounded-2xl p-4">
            <Package className="w-8 h-8 text-neutral-300 mx-auto" />
            <p className="text-xs text-neutral-500 font-bengali">
              এখনও কোনো অর্ডার করেননি। এখনই পছন্দের পোশাক অর্ডার করুন!
            </p>
            <button
              onClick={onGoToShop}
              className="px-4 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold font-bengali hover:bg-rose-700 cursor-pointer"
            >
              কেনাকাটা শুরু করুন
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5 text-xs font-bengali hover:border-neutral-300 transition-colors"
              >
                <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-neutral-900">#{order.orderNumber}</span>
                    <span className="text-neutral-400">•</span>
                    <span className="text-[11px] text-neutral-500">{order.createdAt}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {order.status}
                  </span>
                </div>

                <div className="space-y-1 text-neutral-700">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[11px]">
                      <span className="truncate max-w-[200px]">
                        {item.quantity}x {item.product.titleBn} ({item.selectedSize})
                      </span>
                      <span className="font-bold">
                        ৳{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-neutral-200 font-bold text-neutral-950">
                  <span className="text-rose-600 text-sm">
                    মোট: ৳{order.total.toLocaleString()}
                  </span>

                  {/* Track Order Button */}
                  <button
                    onClick={() => onTrackOrder(order.orderNumber)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-rose-600 text-white text-[11px] font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>লাইভ ট্র্যাক করুন</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Wishlist Section */}
      {wishlistProducts.length > 0 && (
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bengali font-bold text-base text-neutral-900 flex items-center gap-2">
              <Heart className="w-4 h-4 fill-rose-600 text-rose-600" />
              পছন্দের তালিকা ({wishlistProducts.length})
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {wishlistProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group relative flex items-center gap-2 p-2 rounded-xl bg-neutral-50 border border-neutral-200 hover:border-neutral-300 cursor-pointer transition-all hover:bg-white hover:shadow-xs"
              >
                <img
                  src={product.images[0]}
                  alt={product.titleBn}
                  className="w-12 h-14 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1 pr-5">
                  <h6 className="font-bengali font-bold text-xs text-neutral-900 truncate">
                    {product.titleBn}
                  </h6>
                  <span className="text-xs font-extrabold text-rose-600 font-bengali">
                    ৳{product.price.toLocaleString()}
                  </span>
                </div>

                {onToggleWishlist && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product);
                    }}
                    title="তালিকা থেকে সরান"
                    aria-label="Remove from wishlist"
                    className="absolute top-1.5 right-1.5 p-1 rounded-full text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 hover:fill-none hover:text-neutral-400" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Service & Help Support */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200 shadow-xs space-y-3 font-bengali">
        <h4 className="font-bold text-base text-neutral-900 flex items-center gap-2">
          <Phone className="w-4 h-4 text-rose-600" />
          গ্রাহক সেবা ও যোগাযোগ
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <a
            href="tel:+8801700000000"
            className="flex items-center justify-between p-3 rounded-xl bg-rose-50/60 border border-rose-100 hover:bg-rose-100/70 transition-colors text-rose-950 font-bold"
          >
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-rose-600" />
              <div>
                <span>হটলাইন সাপোর্ট</span>
                <p className="text-[10px] text-neutral-500 font-normal">সকাল ১০টা - রাত ১০টা</p>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-rose-600" />
          </a>

          <a
            href="https://wa.me/8801700000000"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 hover:bg-emerald-100/70 transition-colors text-emerald-950 font-bold"
          >
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
              <div>
                <span>হোয়াটসঅ্যাপে সরাসরি চ্যাট</span>
                <p className="text-[10px] text-neutral-500 font-normal">দ্রুততম অর্ডার ও জিজ্ঞাসা</p>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
          </a>
        </div>
      </div>

      {/* Brand Heritage Story */}
      <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 text-xs text-neutral-600 font-bengali space-y-1.5 text-center">
        <h5 className="font-bold text-neutral-900">
          'বৈচিত্র্য অঙ্গন' (Boichitro Angon) সম্পর্কে
        </h5>
        <p className="text-neutral-500 leading-relaxed text-[11px] max-w-sm mx-auto">
          বাংলার ঐতিহ্যবাহী তাঁতশিল্প, ঢাকাই জামদানি এবং আধুনিক কাটের মেলবন্ধনে তৈরি প্রিমিয়াম ক্লোথিং ব্র‍্যান্ড। সততা ও কোয়ালিটিতে আমরা আপসহীন।
        </p>
      </div>
    </div>
  );
};

