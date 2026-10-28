'use client';

import React, { useState } from 'react';
import { Product, ProductColor } from '@/types/customizer';
import { ProductMockupSvg } from '@/components/Mockups/ProductMockupSvg';
import { Sparkles, ShoppingCart, ShieldCheck, Truck, RefreshCw, Palette, Star } from 'lucide-react';

interface StorefrontSimulatorProps {
  product: Product;
  onLaunchCustomizer: () => void;
}

export const StorefrontSimulator: React.FC<StorefrontSimulatorProps> = ({
  product,
  onLaunchCustomizer,
}) => {
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [qty, setQty] = useState(1);

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-zinc-200 shadow-md overflow-hidden">
      {/* Simulated Shopify Storefront Top Banner */}
      <div className="bg-zinc-900 text-white text-[11px] py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span>✨ Spring Sale: Free Global Shipping on Customized Orders over $50</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 p-6 sm:p-10 gap-8">
        {/* Left: Product Image Stage */}
        <div className="bg-[#f8f9fa] rounded-2xl border border-zinc-200/80 p-8 flex items-center justify-center relative min-h-[420px]">
          <div className="w-[320px] h-[380px] relative">
            <ProductMockupSvg mockupKey={product.sides[0].mockupSvg} colorHex={selectedColor.hex} sideId={product.sides[0].id} />
          </div>

          <span className="absolute bottom-4 left-4 bg-white/90 border border-zinc-200 text-zinc-600 text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-2xs">
            Direct-To-Garment (DTG) Optimized
          </span>
        </div>

        {/* Right: Product Details & Customizer Action */}
        <div className="space-y-5 flex flex-col justify-center">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs text-zinc-500 font-medium">(142 verified customer reviews)</span>
            </div>

            <h1 className="text-2xl font-bold text-zinc-950 tracking-tight">{product.name}</h1>
            <p className="text-lg font-bold text-zinc-900 mt-1 font-mono">
              ${product.basePrice.toFixed(2)} USD
            </p>
          </div>

          <p className="text-xs text-zinc-600 leading-relaxed">{product.description}</p>

          {/* Color Selector */}
          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
              Color: <span className="text-zinc-500 font-normal">{selectedColor.name}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedColor(c)}
                  className={`w-7 h-7 rounded-full border border-zinc-300 transition-all ${
                    selectedColor.id === c.id
                      ? 'ring-2 ring-emerald-600 ring-offset-2 scale-110 shadow-sm'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1.5">Size:</label>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                    selectedSize === s
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                      : 'bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Action: Launch Visual Customizer */}
          <div className="pt-2 space-y-2.5">
            <button
              onClick={onLaunchCustomizer}
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Palette className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Customize This Product (Inkybay Studio)</span>
              <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />
            </button>

            <button
              onClick={onLaunchCustomizer}
              className="w-full py-2.5 px-6 rounded-xl border border-zinc-300 hover:bg-zinc-50 text-zinc-800 font-semibold text-xs transition flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4 text-zinc-600" />
              <span>Add Blank Product to Cart</span>
            </button>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-100 text-[11px] text-zinc-500">
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Fast 2-3 Day Print</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Vector Sharpness</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
              <span>No Minimum Qty</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
