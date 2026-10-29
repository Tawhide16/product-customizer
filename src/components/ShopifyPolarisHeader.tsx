'use client';

import React from 'react';
import {
  Palette,
  Store,
  Layers,
  DollarSign,
  Printer,
  Code2,
  ShoppingBag,
} from 'lucide-react';

export type AppView = 'customizer' | 'storefront' | 'catalog' | 'pricing' | 'orders' | 'integration';

interface ShopifyPolarisHeaderProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  onOpenHelp?: () => void;
  cartCount?: number;
  onOpenCart?: () => void;
}

export const ShopifyPolarisHeader: React.FC<ShopifyPolarisHeaderProps> = ({
  currentView,
  onSelectView,
  cartCount = 1,
  onOpenCart,
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-zinc-200/80 shrink-0 z-40 select-none sticky top-0">
      <div className="h-14 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand Wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="Origin"
              className="h-7 w-auto object-contain select-none"
            />
            <span className="text-zinc-300">/</span>
            <span className="text-xs font-semibold text-zinc-600 hidden sm:inline">
              Product Customization Studio
            </span>
          </div>
        </div>

        {/* Center Glass Pill Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-zinc-100/90 p-1 rounded-full border border-zinc-200/60 shadow-inner overflow-x-auto no-scrollbar">
          {[
            { id: 'customizer', label: 'Design Studio', icon: Palette },
            { id: 'storefront', label: 'Storefront', icon: Store },
            { id: 'catalog', label: 'Products', icon: Layers },
            { id: 'pricing', label: 'Pricing Rules', icon: DollarSign },
            { id: 'orders', label: 'Orders & Vectors', icon: Printer },
            { id: 'integration', label: 'Integrations & API', icon: Code2 },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id as AppView)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-zinc-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action: Bag Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenCart && (
            <button
              onClick={onOpenCart}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
              <span>Bag ({cartCount})</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
