import React, { useState, useMemo } from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface SearchViewProps {
  products: Product[];
  wishlistIds: Set<string>;
  onToggleWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
  addedProductId: string | null;
}

export const SearchView: React.FC<SearchViewProps> = ({
  products,
  wishlistIds,
  onToggleWishlist,
  onSelectProduct,
  onQuickAddToCart,
  addedProductId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  const popularKeywords = [
    'পাঞ্জাবি',
    'জামদানি শাড়ি',
    'লিনেন কুর্তি',
    'শেরওয়ানি',
    'পোলো শার্ট',
    'মসলিন',
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        searchTerm.trim() === '' ||
        p.titleBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.fabricBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categoryLabelBn.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;

      return matchSearch && matchCategory;
    }).sort((a, b) => {
      if (sortOrder === 'price-asc') return a.price - b.price;
      if (sortOrder === 'price-desc') return b.price - a.price;
      return 0;
    });
  }, [products, searchTerm, selectedCategory, sortOrder]);

  return (
    <div className="space-y-4 pb-20">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="পোশাকের নাম, ফেব্রিক বা ক্যাটাগরি দিয়ে খুঁজুন..."
          className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white border border-neutral-200 shadow-xs text-xs sm:text-sm focus:outline-rose-600 font-bengali"
          autoFocus
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Popular Suggestions */}
      <div className="space-y-1.5">
        <span className="text-xs font-bold text-neutral-500 font-bengali">
          জনপ্রিয় অনুসন্ধান:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {popularKeywords.map((kw) => (
            <button
              key={kw}
              onClick={() => setSearchTerm(kw)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer font-bengali border ${
                searchTerm === kw
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-200/80 text-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'all', label: 'সব' },
            { id: 'mens', label: 'পাঞ্জাবি ও শার্ট' },
            { id: 'womens', label: 'শাড়ি ও থ্রি-পিস' },
            { id: 'casual', label: 'ক্যাজুয়াল' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-2.5 py-1 rounded-lg font-bengali font-bold transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-neutral-900 text-white shadow-2xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded-lg px-2 py-1 shrink-0 font-bengali">
          <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="text-xs bg-transparent text-neutral-700 outline-none cursor-pointer"
          >
            <option value="default">প্রচলিত</option>
            <option value="price-asc">দাম: কম থেকে বেশি</option>
            <option value="price-desc">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-neutral-500 font-bengali">
          <strong className="text-neutral-900 font-bold">{filteredProducts.length}</strong> টি পোশাক পাওয়া গেছে
        </span>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center space-y-3">
          <SlidersHorizontal className="w-10 h-10 text-neutral-300 mx-auto" />
          <h4 className="font-bengali font-bold text-base text-neutral-800">
            কোনো পোশাক পাওয়া যায়নি
          </h4>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto font-bengali">
            অন্য কোনো কিওয়ার্ড বা ক্যাটাগরি দিয়ে অনুসন্ধান করার চেষ্টা করুন।
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold font-bengali cursor-pointer hover:bg-neutral-800"
          >
            সকল ফিল্টার মুছুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlistIds.has(product.id)}
              onToggleWishlist={onToggleWishlist}
              onSelectProduct={onSelectProduct}
              onQuickAddToCart={onQuickAddToCart}
              isAddedJustNow={addedProductId === product.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};
