'use client';

import React from 'react';
import { Product, ProductColor, PricingSettings, DesignElement, PrintSideId } from '@/types/customizer';
import { ShoppingCart, Eye, Sparkles, Check, Tag } from 'lucide-react';

interface ProductOptionsPanelProps {
  product: Product;
  selectedColor: ProductColor;
  onSelectColor: (color: ProductColor) => void;
  selectedSize: string;
  onSelectSize: (size: string) => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  pricingSettings: PricingSettings;
  elements: DesignElement[];
  onOpenPreview: () => void;
  onAddToCart: () => void;
}

export const ProductOptionsPanel: React.FC<ProductOptionsPanelProps> = ({
  product,
  selectedColor,
  onSelectColor,
  selectedSize,
  onSelectSize,
  quantity,
  onQuantityChange,
  pricingSettings,
  elements,
  onOpenPreview,
  onAddToCart,
}) => {
  // Calculate dynamic fees
  // 1. Extra sides printed: check unique sides used
  const usedSides = new Set(elements.map((el) => el.sideId));
  const extraSidesCount = Math.max(0, usedSides.size - 1);
  const extraSidesTotal = extraSidesCount * pricingSettings.extraSideFee;

  // 2. Custom element fees
  const textElementsCount = elements.filter((el) => el.type === 'text').length;
  const imageElementsCount = elements.filter((el) => el.type === 'image').length;
  const elementFees =
    textElementsCount * pricingSettings.textElementFee +
    imageElementsCount * pricingSettings.imageUploadFee;

  const itemUnitPriceRaw = product.basePrice + extraSidesTotal + elementFees;

  // 3. Bulk Tier Discount
  const applicableTier = pricingSettings.bulkTiers
    .filter((tier) => quantity >= tier.minQty)
    .sort((a, b) => b.minQty - a.minQty)[0] || { minQty: 1, discountPercent: 0 };

  const unitPrice = itemUnitPriceRaw * (1 - applicableTier.discountPercent / 100);
  const totalPrice = unitPrice * quantity;
  const originalTotalPrice = itemUnitPriceRaw * quantity;
  const totalSavings = originalTotalPrice - totalPrice;

  return (
    <div className="space-y-5 p-4 text-zinc-800">
      {/* Product Color Selection */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-zinc-700">Garment / Base Color</label>
          <span className="text-xs text-zinc-500 font-medium">{selectedColor.name}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((color) => {
            const isSelected = selectedColor.id === color.id;
            return (
              <button
                key={color.id}
                onClick={() => onSelectColor(color)}
                className={`w-7 h-7 rounded-full border border-zinc-300 relative transition-all ${
                  isSelected
                    ? 'ring-2 ring-emerald-600 ring-offset-2 scale-110 shadow-sm'
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {isSelected && (
                  <Check
                    className={`w-3.5 h-3.5 absolute inset-0 m-auto ${
                      color.dark ? 'text-white' : 'text-zinc-900'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Selection */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-zinc-700">Select Size</label>
          <span className="text-xs text-emerald-700 font-medium">In Stock</span>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => onSelectSize(size)}
              className={`py-2 text-xs font-semibold rounded-lg border transition ${
                selectedSize === size
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                  : 'bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity & Bulk Tier Pricing Table */}
      <div className="bg-zinc-50 border border-zinc-200/80 rounded-xl p-3 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-emerald-700" /> Quantity
          </label>
          <div className="flex items-center gap-1 bg-white border border-zinc-300 rounded-lg p-0.5">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="w-7 h-7 rounded flex items-center justify-center text-zinc-600 hover:bg-zinc-100 font-semibold text-sm"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              max="500"
              value={quantity}
              onChange={(e) => onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-12 text-center text-xs font-bold text-zinc-800 focus:outline-none"
            />
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              className="w-7 h-7 rounded flex items-center justify-center text-zinc-600 hover:bg-zinc-100 font-semibold text-sm"
            >
              +
            </button>
          </div>
        </div>

        {/* Volume Discount Tiers */}
        <div className="pt-1">
          <div className="text-[11px] font-semibold text-zinc-500 mb-1.5">Volume Discount Tiers:</div>
          <div className="grid grid-cols-4 gap-1 text-[11px]">
            {pricingSettings.bulkTiers.slice(1).map((tier) => {
              const isCurrent = applicableTier.minQty === tier.minQty;
              return (
                <div
                  key={tier.minQty}
                  className={`p-1.5 rounded-md border text-center transition ${
                    isCurrent
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                      : 'bg-white border-zinc-200 text-zinc-600'
                  }`}
                >
                  <div className="font-semibold">{tier.minQty}+ pcs</div>
                  <div className="text-[10px] text-emerald-600 font-medium">-{tier.discountPercent}% OFF</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live Calculated Pricing Breakdown Box */}
      <div className="bg-white border border-zinc-200 rounded-xl p-3.5 space-y-2 shadow-xs">
        <div className="flex justify-between text-xs text-zinc-600">
          <span>Base Item ({product.name.split(' ')[0]})</span>
          <span>${product.basePrice.toFixed(2)}</span>
        </div>

        {extraSidesCount > 0 && (
          <div className="flex justify-between text-xs text-zinc-600">
            <span>Extra Print Sides ({extraSidesCount}x)</span>
            <span className="text-emerald-700 font-medium">+${extraSidesTotal.toFixed(2)}</span>
          </div>
        )}

        {elementFees > 0 && (
          <div className="flex justify-between text-xs text-zinc-600">
            <span>Artwork & Customization Fee</span>
            <span className="text-emerald-700 font-medium">+${elementFees.toFixed(2)}</span>
          </div>
        )}

        {applicableTier.discountPercent > 0 && (
          <div className="flex justify-between text-xs text-emerald-700 font-semibold pt-1 border-t border-dashed border-zinc-200">
            <span>Volume Tier Discount (-{applicableTier.discountPercent}%)</span>
            <span>-${totalSavings.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between items-baseline pt-2 border-t border-zinc-200">
          <div>
            <span className="text-xs font-bold text-zinc-800">Total Price</span>
            <span className="text-[10px] text-zinc-400 block font-mono">
              (${unitPrice.toFixed(2)} / each)
            </span>
          </div>
          <div className="text-right">
            <span className="text-lg font-extrabold text-zinc-950 font-mono">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Preview & Add to Cart */}
      <div className="space-y-2 pt-1">
        <button
          onClick={onOpenPreview}
          className="w-full py-2.5 px-4 rounded-xl border border-zinc-300 hover:border-zinc-400 bg-white hover:bg-zinc-50 text-zinc-800 font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <Eye className="w-4 h-4 text-zinc-600" />
          <span>Preview Realistic Mockup</span>
        </button>

        <button
          onClick={onAddToCart}
          className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add Customized Product to Cart</span>
        </button>
      </div>
    </div>
  );
};
