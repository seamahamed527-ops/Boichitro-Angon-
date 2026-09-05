import React from 'react';
import { Home, Search, ShoppingBag, User } from 'lucide-react';

export type NavTab = 'home' | 'search' | 'cart' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  cartCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  cartCount,
}) => {
  const tabs = [
    { id: 'home' as NavTab, labelBn: 'হোম', labelEn: 'Home', icon: Home },
    { id: 'search' as NavTab, labelBn: 'অনুসন্ধান', labelEn: 'Search', icon: Search },
    { id: 'cart' as NavTab, labelBn: 'ব্যাগ', labelEn: 'Cart', icon: ShoppingBag, badge: cartCount },
    { id: 'profile' as NavTab, labelBn: 'প্রোফাইল', labelEn: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-neutral-200/90 shadow-lg">
      <div className="max-w-md md:max-w-xl mx-auto px-4 py-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-rose-600 scale-105'
                  : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              {/* Icon Container with Badge */}
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className={`text-[11px] font-bengali mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.labelBn}
              </span>

              {/* Active Dot indicator */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 absolute -bottom-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
