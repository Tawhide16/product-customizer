'use client';

import React from 'react';
import {
  Palette,
  Store,
  Layers,
  DollarSign,
  Printer,
  Code2,
  HelpCircle,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Globe,
} from 'lucide-react';

export type AppView = 'customizer' | 'storefront' | 'catalog' | 'pricing' | 'orders' | 'integration';

interface ShopifyPolarisHeaderProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  onOpenHelp: () => void;
  cartCount?: number;
  onOpenCart?: () => void;
}

export const ShopifyPolarisHeader: React.FC<ShopifyPolarisHeaderProps> = ({
  currentView,
  onSelectView,
  onOpenHelp,
  cartCount = 1,
  onOpenCart,
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-zinc-200/80 shrink-0 z-40 select-none sticky top-0">
      <div className="h-14 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand Wordmark & Mode Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="Origin"
              className="h-7 w-auto object-contain select-none"
            />
            <span className="text-zinc-300">/</span>
            <span className="text-xs font-semibold text-zinc-600 hidden sm:inline">
              3D Customizer Studio
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-900 text-white shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Universal 3D Studio
          </div>
        </div>

        {/* Center Glass Pill Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-zinc-100/90 p-1 rounded-full border border-zinc-200/60 shadow-inner overflow-x-auto no-scrollbar">
          {[
            { id: 'customizer', label: '3D Studio', icon: Palette },
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

        {/* Right Action Icons: Store pill, Help, Bag */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 bg-zinc-50 border border-zinc-200/80 rounded-full text-xs text-zinc-600">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium text-[11px]">store.origin-studio.com</span>
          </div>

          <button
            onClick={onOpenHelp}
            className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition flex items-center gap-1 text-xs"
            title="App documentation & blueprint guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Bag Pill (Reference 1 style) */}
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
