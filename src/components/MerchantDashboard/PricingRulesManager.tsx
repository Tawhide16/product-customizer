'use client';

import React, { useState } from 'react';
import { PricingSettings, BulkDiscountTier } from '@/types/customizer';
import { DollarSign, Tag, Plus, Trash2, CheckCircle, Percent } from 'lucide-react';

interface PricingRulesManagerProps {
  pricingSettings: PricingSettings;
  onUpdatePricing: (settings: PricingSettings) => void;
}

export const PricingRulesManager: React.FC<PricingRulesManagerProps> = ({
  pricingSettings,
  onUpdatePricing,
}) => {
  const [settings, setSettings] = useState<PricingSettings>(pricingSettings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdatePricing(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAddTier = () => {
    const lastTier = settings.bulkTiers[settings.bulkTiers.length - 1];
    const newTier: BulkDiscountTier = {
      minQty: (lastTier?.minQty || 0) + 12,
      discountPercent: Math.min(50, (lastTier?.discountPercent || 0) + 5),
    };
    setSettings({
      ...settings,
      bulkTiers: [...settings.bulkTiers, newTier],
    });
  };

  const handleDeleteTier = (idx: number) => {
    if (settings.bulkTiers.length <= 1) return;
    const updated = settings.bulkTiers.filter((_, i) => i !== idx);
    setSettings({ ...settings, bulkTiers: updated });
  };

  return (
    <div className="space-y-6">
      {/* Polaris Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Customization Pricing Engine</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Configure dynamic customization surcharges and volume tiered quantity discounts validated on checkout.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-xs text-emerald-700 font-medium flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Pricing rules saved
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            Save Pricing Rules
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dynamic Surcharges Card */}
        <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
            <DollarSign className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-zinc-900">Customization Surcharges</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1">
                Extra Print Side Surcharge ($ USD)
              </label>
              <p className="text-[11px] text-zinc-500 mb-1.5">
                Applied when customer customizes a second or third side (e.g. Back or Sleeve).
              </p>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-zinc-400 font-mono">$</span>
                <input
                  type="number"
                  step="0.25"
                  value={settings.extraSideFee}
                  onChange={(e) =>
                    setSettings({ ...settings, extraSideFee: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full pl-7 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-300 rounded-lg font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1">
                Customer Image Upload Surcharge ($ USD)
              </label>
              <p className="text-[11px] text-zinc-500 mb-1.5">
                Applied per uploaded raster graphic or custom corporate logo.
              </p>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-zinc-400 font-mono">$</span>
                <input
                  type="number"
                  step="0.25"
                  value={settings.imageUploadFee}
                  onChange={(e) =>
                    setSettings({ ...settings, imageUploadFee: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full pl-7 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-300 rounded-lg font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1">
                Custom Text Surcharge ($ USD)
              </label>
              <p className="text-[11px] text-zinc-500 mb-1.5">
                Applied per customized text line or personalized name/number.
              </p>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-zinc-400 font-mono">$</span>
                <input
                  type="number"
                  step="0.25"
                  value={settings.textElementFee}
                  onChange={(e) =>
                    setSettings({ ...settings, textElementFee: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full pl-7 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-300 rounded-lg font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Volume Tiered Discounts Card */}
        <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-zinc-900">Wholesale Volume Tiers</h3>
            </div>
            <button
              onClick={handleAddTier}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Tier
            </button>
          </div>

          <div className="space-y-2.5">
            {settings.bulkTiers.map((tier, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 p-3 bg-zinc-50 rounded-lg border border-zinc-200/80"
              >
                <div className="flex items-center gap-2 text-xs">
                  <Tag className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="font-semibold text-zinc-700">Minimum Quantity:</span>
                  <input
                    type="number"
                    min="1"
                    disabled={idx === 0}
                    value={tier.minQty}
                    onChange={(e) => {
                      const updated = [...settings.bulkTiers];
                      updated[idx].minQty = parseInt(e.target.value) || 1;
                      setSettings({ ...settings, bulkTiers: updated });
                    }}
                    className="w-14 px-2 py-1 text-xs bg-white border border-zinc-300 rounded font-mono text-center disabled:opacity-50"
                  />
                  <span>units</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-zinc-700">Discount:</span>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={tier.discountPercent}
                    onChange={(e) => {
                      const updated = [...settings.bulkTiers];
                      updated[idx].discountPercent = parseInt(e.target.value) || 0;
                      setSettings({ ...settings, bulkTiers: updated });
                    }}
                    className="w-14 px-2 py-1 text-xs bg-white border border-zinc-300 rounded font-mono text-center"
                  />
                  <span>%</span>

                  {idx > 0 && (
                    <button
                      onClick={() => handleDeleteTier(idx)}
                      className="p-1 text-zinc-400 hover:text-red-600 transition"
                      title="Remove tier"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
