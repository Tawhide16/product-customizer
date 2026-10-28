'use client';

import React, { useState } from 'react';
import { Product, ProductColor, PricingSettings, DesignElement, PrintSideId } from '@/types/customizer';
import { X, ShoppingCart, Tag, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SizeAndCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedColor: ProductColor;
  pricingSettings: PricingSettings;
  elements: DesignElement[];
  onSuccess: (sizeSummary: { [size: string]: number }, totalQty: number, totalPrice: number) => void;
}

export const SizeAndCartModal: React.FC<SizeAndCartModalProps> = ({
  isOpen,
  onClose,
  product,
  selectedColor,
  pricingSettings,
  elements,
  onSuccess,
}) => {
  // Quantities for each size
  const [quantities, setQuantities] = useState<{ [size: string]: number }>(() => {
    const init: { [size: string]: number } = {};
    product.sizes.forEach((s, idx) => {
      init[s] = idx === 0 ? 1 : 0;
    });
    return init;
  });

  if (!isOpen) return null;

  const totalQty = Object.values(quantities).reduce((acc, q) => acc + q, 0);

  // Dynamic fee calculation
  const usedSides = new Set(elements.map((el) => el.sideId));
  const extraSidesCount = Math.max(0, usedSides.size - 1);
  const extraSidesTotal = extraSidesCount * pricingSettings.extraSideFee;

  const textCount = elements.filter((el) => el.type === 'text').length;
  const imageCount = elements.filter((el) => el.type === 'image').length;
  const customFees =
    textCount * pricingSettings.textElementFee + imageCount * pricingSettings.imageUploadFee;

  const baseUnitCost = product.basePrice + extraSidesTotal + customFees;

  const applicableTier = pricingSettings.bulkTiers
    .filter((t) => totalQty >= t.minQty)
    .sort((a, b) => b.minQty - a.minQty)[0] || { minQty: 1, discountPercent: 0 };

  const discountedUnitCost = baseUnitCost * (1 - applicableTier.discountPercent / 100);
  const totalPrice = discountedUnitCost * totalQty;
  const originalTotalPrice = baseUnitCost * totalQty;
  const savings = originalTotalPrice - totalPrice;

  const updateSizeQty = (size: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [size]: Math.max(0, (prev[size] || 0) + delta),
    }));
  };

  const handleCheckout = () => {
    if (totalQty === 0) {
      alert('Please select at least 1 item.');
      return;
    }
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onSuccess(quantities, totalQty, totalPrice);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full flex flex-col shadow-2xl border border-zinc-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-zinc-900">
              Select Sizes &amp; Add to Cart
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-zinc-400 hover:text-zinc-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Product Summary */}
          <div className="flex items-center justify-between p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs">
            <div>
              <span className="font-bold text-zinc-900 text-sm block">{product.name}</span>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-zinc-300"
                  style={{ backgroundColor: selectedColor.hex }}
                />
                <span className="text-zinc-600 font-medium">{selectedColor.name}</span>
                <span className="text-zinc-400">•</span>
                <span className="text-zinc-600">{elements.length} Custom Elements</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-zinc-400 block">Unit Base</span>
              <span className="text-sm font-bold text-zinc-900 font-mono">
                ${baseUnitCost.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Bulk Discount Tiers Strip */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-emerald-600" /> Bulk Quantity Discounts:
            </span>
            <div className="grid grid-cols-5 gap-1.5 text-xs">
              {pricingSettings.bulkTiers.map((t) => {
                const isActive = applicableTier.minQty === t.minQty;
                return (
                  <div
                    key={t.minQty}
                    className={`p-2 rounded-lg border text-center transition ${
                      isActive
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold shadow-2xs'
                        : 'bg-white border-zinc-200 text-zinc-600'
                    }`}
                  >
                    <div>{t.minQty}+ pcs</div>
                    <div className="text-[10px] text-emerald-600">
                      {t.discountPercent > 0 ? `-${t.discountPercent}%` : 'Base'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Size Breakdown Quantity Table */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-zinc-700 block">Enter Quantities by Size:</span>
            <div className="border border-zinc-200 rounded-xl divide-y divide-zinc-100 overflow-hidden">
              {product.sizes.map((s) => (
                <div key={s} className="p-3 flex items-center justify-between bg-white hover:bg-zinc-50">
                  <span className="text-xs font-semibold text-zinc-800">{s}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateSizeQty(s, -1)}
                      className="w-7 h-7 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 flex items-center justify-center font-bold text-sm text-zinc-700"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={quantities[s] || 0}
                      onChange={(e) =>
                        setQuantities({
                          ...quantities,
                          [s]: Math.max(0, parseInt(e.target.value) || 0),
                        })
                      }
                      className="w-14 text-center text-xs font-bold font-mono py-1 border border-zinc-300 rounded-lg"
                    />
                    <button
                      onClick={() => updateSizeQty(s, 1)}
                      className="w-7 h-7 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 flex items-center justify-center font-bold text-sm text-zinc-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Calculation Summary */}
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between text-zinc-600">
              <span>Total Quantity</span>
              <span className="font-bold text-zinc-900">{totalQty} units</span>
            </div>
            {applicableTier.discountPercent > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Tier Discount Savings ({applicableTier.discountPercent}%)</span>
                <span>-${savings.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-600">
              <span>Final Effective Unit Price</span>
              <span className="font-mono font-semibold">${discountedUnitCost.toFixed(2)} / ea</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-zinc-200 text-sm">
              <span className="font-bold text-zinc-900">Total Price</span>
              <span className="text-lg font-extrabold text-zinc-950 font-mono">
                ${totalPrice.toFixed(2)} USD
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-zinc-300 hover:bg-zinc-100 text-zinc-700 font-semibold text-xs rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCheckout}
            disabled={totalQty === 0}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart (${totalPrice.toFixed(2)})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
