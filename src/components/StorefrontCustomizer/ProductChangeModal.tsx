'use client';

import React, { useState } from 'react';
import { Product } from '@/types/customizer';
import { X, Check, Package } from 'lucide-react';

interface ProductChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currentProductId: string;
  onSelectProduct: (product: Product) => void;
}

export const ProductChangeModal: React.FC<ProductChangeModalProps> = ({
  isOpen,
  onClose,
  products,
  currentProductId,
  onSelectProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Apparel', 'Accessories', 'Bags', 'Home'];

  const filtered = products.filter(
    (p) => selectedCategory === 'All' || p.category === selectedCategory
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full flex flex-col shadow-2xl border border-zinc-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-zinc-900">Change Product Catalog</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-zinc-400 hover:text-zinc-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="px-6 py-3 border-b border-zinc-100 flex items-center gap-2 overflow-x-auto bg-white">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                selectedCategory === c
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
          {filtered.map((prod) => {
            const isCurrent = prod.id === currentProductId;
            return (
              <div
                key={prod.id}
                onClick={() => {
                  onSelectProduct(prod);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between group ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                    : 'border-zinc-200 hover:border-emerald-400 bg-white hover:bg-zinc-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      {prod.category}
                    </span>
                    {isCurrent && <Check className="w-4 h-4 text-emerald-600" />}
                  </div>

                  {prod.image && (
                    <div className="w-full h-28 mb-2 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center p-1.5 overflow-hidden group-hover:scale-[1.02] transition-transform">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}

                  <h4 className="text-xs font-bold text-zinc-900 group-hover:text-emerald-700">
                    {prod.name}
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2">
                    {prod.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-zinc-900">
                    From ${prod.basePrice.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {prod.sides.length} Print Sides
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
