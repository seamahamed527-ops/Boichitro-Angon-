import React from 'react';
import { CATEGORIES } from '../data/products';
import { Sparkles, Shirt, Heart, Crown, Compass } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  counts: Record<string, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  counts,
}) => {
  const getIcon = (iconName: string, isSelected: boolean) => {
    const props = { className: `w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-neutral-500'}` };
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'Shirt':
        return <Shirt {...props} />;
      case 'Heart':
        return <Heart {...props} />;
      case 'Crown':
        return <Crown {...props} />;
      case 'Compass':
        return <Compass {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <h3 className="font-bengali font-bold text-base text-neutral-800 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-600 inline-block"></span>
          ক্যাটাগরি সমূহ
        </h3>
        <span className="text-xs text-neutral-500 font-medium">
          সেরা ফ্যাশন কালেকশন
        </span>
      </div>

      {/* Horizontal scrolling pill buttons */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = counts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              id={`cat-filter-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95 shrink-0 border ${
                isSelected
                  ? 'bg-neutral-900 border-neutral-900 text-white shadow-sm'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              {getIcon(cat.icon, isSelected)}
              <span className="font-bengali font-semibold">{cat.nameBn}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
