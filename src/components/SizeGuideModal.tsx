import React, { useState } from 'react';
import { X, Ruler, CheckCircle2, Info, HelpCircle } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string; // 'mens' | 'womens' | 'casual' | 'festive'
}

interface SizeRow {
  size: string;
  chestInches: string;
  chestCm: string;
  lengthInches: string;
  lengthCm: string;
  sleeveInches: string;
  sleeveCm: string;
  shoulderInches: string;
  shoulderCm: string;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  category = 'mens',
}) => {
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');
  
  // Default tab based on category
  const [activeTab, setActiveTab] = useState<'panjabi' | 'kurti' | 'saree'>(() => {
    if (category === 'womens' || category === 'casual') return 'kurti';
    return 'panjabi';
  });

  if (!isOpen) return null;

  const panjabiSizes: SizeRow[] = [
    {
      size: 'S (৩৮)',
      chestInches: '৪০"',
      chestCm: '১০১.৬ সেমি',
      lengthInches: '৪০"',
      lengthCm: '১০১.৬ সেমি',
      sleeveInches: '২৪"',
      sleeveCm: '৬০.৯ সেমি',
      shoulderInches: '১৭.৫"',
      shoulderCm: '৪৪.৪ সেমি',
    },
    {
      size: 'M (৪০)',
      chestInches: '৪২"',
      chestCm: '১০৬.৭ সেmi',
      lengthInches: '৪২"',
      lengthCm: '১০৬.৭ সেমি',
      sleeveInches: '২৪.৫"',
      sleeveCm: '৬২.২ সেমি',
      shoulderInches: '১৮"',
      shoulderCm: '৪৫.৭ সেমি',
    },
    {
      size: 'L (৪২)',
      chestInches: '৪৪"',
      chestCm: '১১১.৭ সেমি',
      lengthInches: '৪৪"',
      lengthCm: '১১১.৭ সেমি',
      sleeveInches: '২৫"',
      sleeveCm: '৬৩.৫ সেমি',
      shoulderInches: '১৮.৫"',
      shoulderCm: '৪৭ সেমি',
    },
    {
      size: 'XL (৪৪)',
      chestInches: '৪৬"',
      chestCm: '১১৬.৮ সেমি',
      lengthInches: '৪৫"',
      lengthCm: '১১৪.৩ সেমি',
      sleeveInches: '২৫.৫"',
      sleeveCm: '৬৪.৭ সেমি',
      shoulderInches: '১৯"',
      shoulderCm: '৪৮.২ সেমি',
    },
    {
      size: 'XXL (৪৬)',
      chestInches: '৪৮"',
      chestCm: '১২২ সেমি',
      lengthInches: '৪৬"',
      lengthCm: '১১৬.৮ সেমি',
      sleeveInches: '২৬"',
      sleeveCm: '৬৬ সেমি',
      shoulderInches: '১৯.৫"',
      shoulderCm: '৪৯.৫ সেমি',
    },
  ];

  const kurtiSizes: SizeRow[] = [
    {
      size: 'S (৩৬)',
      chestInches: '৩৬"',
      chestCm: '৯১.৪ সেমি',
      lengthInches: '৪২"',
      lengthCm: '১০৬.৭ সেমি',
      sleeveInches: '১৯"',
      sleeveCm: '৪৮.৩ সেমি',
      shoulderInches: '১৪"',
      shoulderCm: '৩৫.৫ সেমি',
    },
    {
      size: 'M (৩৮)',
      chestInches: '৩৮"',
      chestCm: '৯৬.৫ সেমি',
      lengthInches: '৪৩"',
      lengthCm: '১০৯.২ সেমি',
      sleeveInches: '১৯.৫"',
      sleeveCm: '৪৯.৫ সেমি',
      shoulderInches: '১৪.৫"',
      shoulderCm: '৩৬.৮ সেমি',
    },
    {
      size: 'L (৪০)',
      chestInches: '৪০"',
      chestCm: '১০১.৬ সেমি',
      lengthInches: '৪৪"',
      lengthCm: '১১১.৮ সেমি',
      sleeveInches: '২০"',
      sleeveCm: '৫০.৮ সেমি',
      shoulderInches: '১৫"',
      shoulderCm: '৩৮.১ সেমি',
    },
    {
      size: 'XL (৪২)',
      chestInches: '৪২"',
      chestCm: '১০৬.৭ সেমি',
      lengthInches: '৪৫"',
      lengthCm: '১১৪.৩ সেমি',
      sleeveInches: '২০.৫"',
      sleeveCm: '৫২ সেমি',
      shoulderInches: '১৫.৫"',
      shoulderCm: '৩৯.৪ সেমি',
    },
    {
      size: 'XXL (৪৪)',
      chestInches: '৪৪"',
      chestCm: '১১১.৮ সেমি',
      lengthInches: '৪৬"',
      lengthCm: '১১৬.৮ সেমি',
      sleeveInches: '২১"',
      sleeveCm: '৫৩.৩ সেমি',
      shoulderInches: '১৬"',
      shoulderCm: '৪০.৬ সেমি',
    },
  ];

  const currentSizes = activeTab === 'kurti' ? kurtiSizes : panjabiSizes;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs transition-opacity overflow-y-auto">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-100 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-amber-600 text-white flex items-center justify-center shadow-xs">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bengali font-bold text-base text-neutral-900 leading-none">
                সাইজ গাইড ও মাপজোখ (Size Guide)
              </h3>
              <span className="text-[11px] text-neutral-500 font-medium">
                বৈচিত্র্য অঙ্গন স্ট্যান্ডার্ড বডি মেজারমেন্টস
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

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-4 no-scrollbar">
          {/* Controls: Type Tabs & Unit Switcher */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            {/* Category Tabs */}
            <div className="flex p-1 bg-neutral-100 rounded-xl font-bengali text-xs font-bold">
              <button
                onClick={() => setActiveTab('panjabi')}
                className={`flex-1 py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'panjabi'
                    ? 'bg-white text-neutral-950 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                পাঞ্জাবি ও শার্ট
              </button>
              <button
                onClick={() => setActiveTab('kurti')}
                className={`flex-1 py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'kurti'
                    ? 'bg-white text-neutral-950 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                কুর্তি ও কামিজ
              </button>
              <button
                onClick={() => setActiveTab('saree')}
                className={`flex-1 py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'saree'
                    ? 'bg-white text-neutral-950 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                শাড়ির পরিমাপ
              </button>
            </div>

            {/* Inches / CM Toggle */}
            {activeTab !== 'saree' && (
              <div className="flex items-center self-end sm:self-auto gap-1 bg-neutral-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setUnit('inches')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    unit === 'inches'
                      ? 'bg-rose-600 text-white shadow-2xs font-bold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  ইঞ্চি (Inches)
                </button>
                <button
                  onClick={() => setUnit('cm')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    unit === 'cm'
                      ? 'bg-rose-600 text-white shadow-2xs font-bold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  সেমি (cm)
                </button>
              </div>
            )}
          </div>

          {/* Size Chart Table or Saree Spec */}
          {activeTab === 'saree' ? (
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80 space-y-3 font-bengali">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                <h4 className="font-bold text-sm text-neutral-900">
                  ঐতিহ্যবাহী জামদানি ও তসর শাড়ির আদর্শ মাপ
                </h4>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                বৈচিত্র্য অঙ্গনের সকল শাড়ি ১২ হাত (প্রায় ৫.৫ মিটার) স্ট্যান্ডার্ড ফ্রি সাইজে বোনা হয়ে থাকে।
              </p>

              <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
                <div className="p-3 bg-white rounded-xl border border-neutral-200">
                  <span className="text-neutral-400 block text-[11px]">শাড়ির মোট দৈর্ঘ্য</span>
                  <span className="font-bold text-neutral-900 text-sm">১২ হাত (৫.৫ মিটার)</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-neutral-200">
                  <span className="text-neutral-400 block text-[11px]">প্রস্থ (বহর)</span>
                  <span className="font-bold text-neutral-900 text-sm">৪৫-৪৬ ইঞ্চি (স্ট্যান্ডার্ড)</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-neutral-200">
                  <span className="text-neutral-400 block text-[11px]">ব্লাউজ পিস</span>
                  <span className="font-bold text-emerald-700 text-sm">৮০ সেমি আনস্টিচড অন্তর্ভুক্ত</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-neutral-200">
                  <span className="text-neutral-400 block text-[11px]">আঁচলের ঝুল</span>
                  <span className="font-bold text-neutral-900 text-sm">৩৯ ইঞ্চি নিপুণ নকশা</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-neutral-200">
              <table className="w-full text-left text-xs font-bengali">
                <thead className="bg-neutral-900 text-white text-[11px] uppercase tracking-wider font-bold">
                  <tr>
                    <th className="px-3.5 py-3">সাইজ</th>
                    <th className="px-3 py-3">বুক (Chest)</th>
                    <th className="px-3 py-3">লম্বা (Length)</th>
                    <th className="px-3 py-3">হাতা (Sleeve)</th>
                    <th className="px-3 py-3">শোল্ডার</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 bg-white">
                  {currentSizes.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-rose-50/50 transition-colors ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/60'
                      }`}
                    >
                      <td className="px-3.5 py-2.5 font-bold text-neutral-900 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md bg-neutral-100 border border-neutral-200">
                          {row.size}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 font-semibold text-neutral-800">
                        {unit === 'inches' ? row.chestInches : row.chestCm}
                      </td>
                      <td className="px-3 py-2.5 text-neutral-700">
                        {unit === 'inches' ? row.lengthInches : row.lengthCm}
                      </td>
                      <td className="px-3 py-2.5 text-neutral-700">
                        {unit === 'inches' ? row.sleeveInches : row.sleeveCm}
                      </td>
                      <td className="px-3 py-2.5 text-neutral-700">
                        {unit === 'inches' ? row.shoulderInches : row.shoulderCm}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Measuring Guidance Tips */}
          <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80 space-y-2.5 font-bengali">
            <h4 className="font-bold text-xs text-neutral-900 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-rose-600" />
              সঠিক মাপ নেওয়ার সহজ উপায়:
            </h4>
            <ul className="text-[11px] text-neutral-600 space-y-1.5 list-disc list-inside">
              <li>
                <strong>বুকের মাপ (Chest):</strong> টেপ দিয়ে বুকের সবচেয়ে চওড়া অংশের চারপাশে মেপে তার সাথে ২ ইঞ্চি বাড়তি যোগ করে সাইজ নির্বাচন করুন।
              </li>
              <li>
                <strong>লম্বা (Length):</strong> কলার বা কাঁধের সংযোগস্থল থেকে হাঁটু বা পছন্দনীয় ঝুল পর্যন্ত মাপুন।
              </li>
              <li>
                <strong>হাতা (Sleeve):</strong> কাঁধের প্রান্ত থেকে কবজি পর্যন্ত মাপ নিন।
              </li>
            </ul>
          </div>

          {/* Guarantee Note */}
          <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bengali">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>নো-রিস্ক সাইজ পলিসি:</strong> ডেলিভারির পর সাইজে কোনো সমস্যা হলে ৭ দিনের মধ্যে বিনামূল্যে এক্সচেঞ্জ করার সুযোগ রয়েছে!
            </span>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold font-bengali transition-colors cursor-pointer"
          >
            বুঝেছি, পণ্য নির্বাচন করব
          </button>
        </div>
      </div>
    </div>
  );
};
