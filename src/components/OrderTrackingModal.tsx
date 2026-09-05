import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  User,
  ShoppingBag
} from 'lucide-react';
import { Order } from '../types';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  initialOrderId?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders,
  initialOrderId = '',
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState(false);

  // Sync with initialOrderId when opened
  useEffect(() => {
    if (isOpen) {
      if (initialOrderId) {
        const cleanId = initialOrderId.trim().toUpperCase();
        setSearchInput(cleanId);
        const match = orders.find(
          (o) => o.orderNumber.toUpperCase() === cleanId || o.id.toUpperCase() === cleanId
        );
        if (match) {
          setCurrentOrder(match);
          setHasSearched(true);
        } else {
          // If not in orders, search by standard fallback
          handleSearchOrderId(cleanId);
        }
      } else if (!currentOrder && orders.length > 0) {
        // Pre-select first order if available
        setCurrentOrder(orders[0]);
        setSearchInput(orders[0].orderNumber);
        setHasSearched(true);
      }
    }
  }, [isOpen, initialOrderId, orders]);

  if (!isOpen) return null;

  const handleSearchOrderId = (termToSearch?: string) => {
    const term = (termToSearch !== undefined ? termToSearch : searchInput).trim().toUpperCase();
    if (!term) return;

    setHasSearched(true);
    // Find order matching ID with or without "#"
    const cleaned = term.replace(/^#/, '');
    const found = orders.find(
      (o) =>
        o.orderNumber.toUpperCase() === cleaned ||
        o.id.toUpperCase() === cleaned ||
        o.orderNumber.toUpperCase() === term ||
        o.id.toUpperCase() === term
    );

    if (found) {
      setCurrentOrder(found);
    } else {
      setCurrentOrder(null);
    }
  };

  const handleCopyTracking = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  // Helper for status badge colors
  const getStatusBadge = (order: Order) => {
    if (order.currentStageIndex === 4) {
      return {
        bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-500',
        label: 'ডেলিভারি সম্পন্ন',
      };
    } else if (order.currentStageIndex === 3) {
      return {
        bg: 'bg-amber-100 text-amber-900 border-amber-200',
        dot: 'bg-amber-500 animate-ping',
        label: 'ডেলিভারির জন্য বের হয়েছে',
      };
    } else if (order.currentStageIndex === 2) {
      return {
        bg: 'bg-blue-100 text-blue-900 border-blue-200',
        dot: 'bg-blue-500',
        label: 'কুরিয়ার ট্রানজিটে রয়েছে',
      };
    } else if (order.currentStageIndex === 1) {
      return {
        bg: 'bg-purple-100 text-purple-900 border-purple-200',
        dot: 'bg-purple-500',
        label: 'প্যাকেজিং সম্পন্ন',
      };
    }
    return {
      bg: 'bg-rose-100 text-rose-900 border-rose-200',
      dot: 'bg-rose-500 animate-pulse',
      label: 'অর্ডার নিশ্চিত হয়েছে',
    };
  };

  const stages = [
    { title: 'অর্ডার গৃহীত', sub: 'Order Placed' },
    { title: 'প্যাকেজিং', sub: 'Packed' },
    { title: 'কুরিয়ারে', sub: 'In Transit' },
    { title: 'ডেলিভারির পথে', sub: 'Out for Delivery' },
    { title: 'ডেলিভার্ড', sub: 'Delivered' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs transition-opacity overflow-y-auto">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-100 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-amber-600 text-white flex items-center justify-center shadow-xs">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bengali font-bold text-base text-neutral-900 leading-none">
                লাইভ অর্ডার ট্র্যাকিং
              </h3>
              <span className="text-[11px] text-neutral-500 font-medium">
                বৈচিত্র্য অঙ্গন • রিয়েলটাইম ডেলিভারি আপডেট
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-4 no-scrollbar">
          {/* Search Bar */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-800 font-bengali flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-rose-600" />
              আপনার অর্ডার নম্বর (Order ID) দিন:
            </label>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchOrderId();
              }}
              className="flex gap-1.5"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="যেমন: BA-748291 বা BA-XXXXXX"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-rose-600"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput('');
                      setCurrentOrder(null);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-rose-600 text-white text-xs sm:text-sm font-bold font-bengali transition-colors shadow-xs cursor-pointer shrink-0"
              >
                ট্র্যাক করুন
              </button>
            </form>

            {/* Quick Demo Order Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              <span className="text-[11px] text-neutral-400 font-bengali whitespace-nowrap">
                ট্রাই করুন:
              </span>
              {orders.slice(0, 4).map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    setSearchInput(o.orderNumber);
                    handleSearchOrderId(o.orderNumber);
                  }}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer border ${
                    currentOrder?.orderNumber === o.orderNumber
                      ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                      : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200'
                  }`}
                >
                  #{o.orderNumber}
                </button>
              ))}
            </div>
          </div>

          {/* Results Condition */}
          {hasSearched && !currentOrder ? (
            /* Not Found State */
            <div className="p-6 text-center rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2.5">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
              <h4 className="font-bengali font-bold text-sm text-rose-950">
                এই আইডি দিয়ে কোনো অর্ডার পাওয়া যায়নি!
              </h4>
              <p className="text-xs text-neutral-600 font-bengali max-w-xs mx-auto">
                অনুগ্রহ করে আপনার এসএমএস বা অর্ডার রিসিপ্টে থাকা সঠিক অর্ডার কোড দিন (যেমন: BA-748291)।
              </p>
              <div className="pt-1">
                <button
                  onClick={() => {
                    if (orders.length > 0) {
                      setSearchInput(orders[0].orderNumber);
                      handleSearchOrderId(orders[0].orderNumber);
                    }
                  }}
                  className="text-xs font-bold text-rose-600 hover:underline font-bengali cursor-pointer"
                >
                  ডেমো অর্ডারটি দিয়ে দেখুন →
                </button>
              </div>
            </div>
          ) : currentOrder ? (
            /* Order Found: Detailed Shipment Status */
            <div className="space-y-4">
              {/* Order Status Banner */}
              {(() => {
                const badge = getStatusBadge(currentOrder);
                return (
                  <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-2xl p-4 shadow-sm relative overflow-hidden space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-neutral-400">অর্ডার নম্বর:</span>
                        <span className="font-mono font-extrabold text-sm text-amber-300">
                          #{currentOrder.orderNumber}
                        </span>
                      </div>
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-bengali border ${badge.bg}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                        <span>{badge.label}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs font-bengali">
                      <div className="space-y-0.5">
                        <span className="text-neutral-400 block text-[11px]">প্রত্যাশিত ডেলিভারি:</span>
                        <span className="font-bold text-emerald-400 flex items-center gap-1 text-xs sm:text-sm">
                          <Clock className="w-3.5 h-3.5" />
                          {currentOrder.estimatedDelivery || '২-৩ কার্যদিবসের মধ্যে'}
                        </span>
                      </div>
                      <div className="text-right space-y-0.5">
                        <span className="text-neutral-400 block text-[11px]">কুরিয়ার পার্টনার:</span>
                        <span className="font-bold text-neutral-200">
                          {currentOrder.courierName || 'Steadfast Courier'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 5-Step Progress Stepper */}
              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80 space-y-3">
                <h4 className="font-bengali font-bold text-xs text-neutral-800 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-rose-600" />
                  ডেলিভারি পর্যায়ক্রম (Progress Stages)
                </h4>

                <div className="relative pt-1">
                  {/* Step indicators */}
                  <div className="grid grid-cols-5 gap-1 text-center relative z-10">
                    {stages.map((stg, idx) => {
                      const isCompleted = idx <= currentOrder.currentStageIndex;
                      const isCurrent = idx === currentOrder.currentStageIndex;

                      return (
                        <div key={idx} className="flex flex-col items-center">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                              isCompleted
                                ? isCurrent
                                  ? 'bg-rose-600 text-white ring-4 ring-rose-100 animate-pulse'
                                  : 'bg-emerald-600 text-white'
                                : 'bg-neutral-200 text-neutral-500'
                            }`}
                          >
                            {isCompleted && !isCurrent ? (
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            ) : (
                              idx + 1
                            )}
                          </div>
                          <span
                            className={`text-[10px] font-bengali font-bold mt-1.5 leading-tight ${
                              isCurrent ? 'text-rose-600' : isCompleted ? 'text-neutral-900' : 'text-neutral-400'
                            }`}
                          >
                            {stg.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Progress Line */}
                  <div className="absolute top-4.5 left-6 right-6 h-1 bg-neutral-200 -z-0">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-rose-600 transition-all duration-500"
                      style={{
                        width: `${(currentOrder.currentStageIndex / (stages.length - 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Real-time Tracking Timeline */}
              {currentOrder.events && currentOrder.events.length > 0 && (
                <div className="bg-white rounded-2xl p-4 border border-neutral-200/80 space-y-3">
                  <h4 className="font-bengali font-bold text-xs text-neutral-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-rose-600" />
                      শিপমেন্ট টাইমলাইন ও লোকেশন হিস্ট্রি
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                      লাইভ আপডেট
                    </span>
                  </h4>

                  <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
                    {currentOrder.events.map((evt, i) => (
                      <div key={i} className="relative group">
                        {/* Dot indicator */}
                        <div
                          className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-white shadow-xs flex items-center justify-center ${
                            evt.current
                              ? 'bg-rose-600 ring-2 ring-rose-200'
                              : evt.completed
                              ? 'bg-emerald-600'
                              : 'bg-neutral-300'
                          }`}
                        >
                          {evt.completed && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center justify-between">
                            <h5
                              className={`text-xs font-bengali font-bold ${
                                evt.current ? 'text-rose-600' : 'text-neutral-900'
                              }`}
                            >
                              {evt.titleBn}
                            </h5>
                            <span className="text-[10px] text-neutral-400 font-medium">
                              {evt.timestamp}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-500 font-bengali leading-relaxed">
                            {evt.descriptionBn}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Consignment & Rider Details Card */}
              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 space-y-2.5 text-xs font-bengali">
                {currentOrder.consignmentId && (
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                    <span className="text-neutral-500">কুরিয়ার ট্র্যাকিং নম্বর:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-neutral-900">
                        {currentOrder.consignmentId}
                      </span>
                      <button
                        onClick={() => handleCopyTracking(currentOrder.consignmentId!)}
                        className="p-1 rounded bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-600 cursor-pointer"
                        title="কপি করুন"
                      >
                        {copiedTracking ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {currentOrder.riderName && (
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                    <span className="text-neutral-500">ডেলিভারি রাইডার:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900">{currentOrder.riderName}</span>
                      {currentOrder.riderPhone && (
                        <a
                          href={`tel:${currentOrder.riderPhone}`}
                          className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Phone className="w-3 h-3" /> কল করুন
                        </a>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-start pt-1">
                  <span className="text-neutral-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" /> ডেলিভারি ঠিকানা:
                  </span>
                  <span className="font-bold text-neutral-900 text-right max-w-[200px] truncate">
                    {currentOrder.address}, {currentOrder.city}
                  </span>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="bg-white rounded-2xl p-4 border border-neutral-200 space-y-2.5">
                <h4 className="font-bengali font-bold text-xs text-neutral-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-rose-600" />
                    পার্সেলে থাকা পোশাক ({currentOrder.items.length} টি)
                  </span>
                  <span className="text-rose-600 font-extrabold font-bengali text-xs">
                    পরিশোধযোগ্য: ৳{currentOrder.total.toLocaleString()}
                  </span>
                </h4>

                <div className="space-y-2">
                  {currentOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-neutral-50 border border-neutral-100"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.titleBn}
                        className="w-10 h-12 rounded-lg object-cover bg-white"
                      />
                      <div className="flex-1 min-w-0">
                        <h6 className="font-bengali font-bold text-xs text-neutral-900 truncate">
                          {item.product.titleBn}
                        </h6>
                        <span className="text-[11px] text-neutral-500 font-bengali block">
                          সাইজ: {item.selectedSize} • পরিমাণ: {item.quantity}টি
                        </span>
                      </div>
                      <span className="font-bold text-xs font-bengali text-neutral-900">
                        ৳{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Need Assistance Quick Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`https://wa.me/8801700000000?text=${encodeURIComponent(
                    `হ্যালো বৈচিত্র্য অঙ্গন, আমার অর্ডার #${currentOrder.orderNumber}-এর ডেলিভারি আপডেট জানতে চাই।`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-bengali flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>হোয়াটসঅ্যাপে আপডেট</span>
                </a>

                <a
                  href="tel:+8801700000000"
                  className="py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold font-bengali flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>সরাসরি হেল্পলাইন</span>
                </a>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
