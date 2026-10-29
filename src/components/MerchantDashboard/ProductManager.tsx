'use client';

import React, { useState } from 'react';
import { Product } from '@/types/customizer';
import { Package, Plus, CheckCircle, Sliders, Ruler, Edit3, Trash2 } from 'lucide-react';

interface ProductManagerProps {
  products: Product[];
  onUpdateProduct: (product: Product) => void;
}

export const ProductManager: React.FC<ProductManagerProps> = ({
  products,
  onUpdateProduct,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [activeTab, setActiveTab] = useState<'info' | 'printAreas' | 'colors'>('printAreas');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onUpdateProduct(selectedProduct);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Polaris Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Customizable Products Catalog</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Map Shopify catalog items, define physical printable boundaries, and setup multi-side print configurations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-700 font-medium flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Changes synced to Shopify
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition"
          >
            Save Configuration
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Product Selection List */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs divide-y divide-zinc-200 overflow-hidden">
          <div className="p-3.5 bg-zinc-50 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">
              Enabled Products ({products.length})
            </span>
            <button className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Map Product
            </button>
          </div>

          <div className="divide-y divide-zinc-100 max-h-[500px] overflow-y-auto">
            {products.map((p) => {
              const isSelected = selectedProduct.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className={`p-3.5 cursor-pointer transition flex items-center justify-between ${
                    isSelected ? 'bg-emerald-50/70 border-l-4 border-l-emerald-600' : 'hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-600 font-bold text-xs overflow-hidden shrink-0">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-full h-full object-contain p-0.5" />
                      ) : (
                        <Package className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900">{p.name}</h4>
                      <p className="text-[11px] text-zinc-500">
                        {p.category} • {p.sides.length} Print Sides • From ${p.basePrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Configuration Editor for Selected Product */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
          {/* Polaris Tab Header */}
          <div className="flex border-b border-zinc-200 bg-zinc-50/60 px-4 pt-2">
            {[
              { id: 'printAreas', label: 'Print Zones & Dimensions' },
              { id: 'info', label: 'Pricing & General Info' },
              { id: 'colors', label: 'Color Variants' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-emerald-600 text-emerald-800'
                    : 'border-transparent text-zinc-500 hover:text-zinc-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-6">
            {activeTab === 'printAreas' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Configured Print Areas</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Define the exact physical dimensions (inches) and canvas boundary coordinates for manufacturing files.
                  </p>
                </div>

                <div className="space-y-4">
                  {selectedProduct.sides.map((side, idx) => (
                    <div
                      key={side.id}
                      className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                          <Ruler className="w-4 h-4 text-emerald-600" />
                          Side {idx + 1}: {side.name} ({side.id})
                        </span>
                        <span className="text-[11px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold font-mono">
                          {side.printArea.dpi} DPI Output
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <label className="text-zinc-500 block mb-1">Print Width (Inches)</label>
                          <input
                            type="number"
                            step="0.5"
                            value={side.printArea.physicalWidthInches}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              const updatedSides = [...selectedProduct.sides];
                              updatedSides[idx].printArea.physicalWidthInches = val;
                              setSelectedProduct({ ...selectedProduct, sides: updatedSides });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg font-mono text-zinc-800"
                          />
                        </div>
                        <div>
                          <label className="text-zinc-500 block mb-1">Print Height (Inches)</label>
                          <input
                            type="number"
                            step="0.5"
                            value={side.printArea.physicalHeightInches}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              const updatedSides = [...selectedProduct.sides];
                              updatedSides[idx].printArea.physicalHeightInches = val;
                              setSelectedProduct({ ...selectedProduct, sides: updatedSides });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg font-mono text-zinc-800"
                          />
                        </div>
                        <div>
                          <label className="text-zinc-500 block mb-1">Canvas Width (%)</label>
                          <input
                            type="number"
                            value={side.printArea.width}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              const updatedSides = [...selectedProduct.sides];
                              updatedSides[idx].printArea.width = val;
                              setSelectedProduct({ ...selectedProduct, sides: updatedSides });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg font-mono text-zinc-800"
                          />
                        </div>
                        <div>
                          <label className="text-zinc-500 block mb-1">Canvas Height (%)</label>
                          <input
                            type="number"
                            value={side.printArea.height}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              const updatedSides = [...selectedProduct.sides];
                              updatedSides[idx].printArea.height = val;
                              setSelectedProduct({ ...selectedProduct, sides: updatedSides });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg font-mono text-zinc-800"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'info' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Product Title</label>
                  <input
                    type="text"
                    value={selectedProduct.name}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-zinc-300 rounded-lg font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                      Base Retail Price ($ USD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={selectedProduct.basePrice}
                      onChange={(e) =>
                        setSelectedProduct({
                          ...selectedProduct,
                          basePrice: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-zinc-300 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={selectedProduct.category}
                      disabled
                      className="w-full px-3 py-2 text-xs bg-zinc-100 border border-zinc-200 rounded-lg text-zinc-500 font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={selectedProduct.description}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-zinc-300 rounded-lg"
                  />
                </div>
              </div>
            )}

            {activeTab === 'colors' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                    Garment Colors ({selectedProduct.colors.length})
                  </h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedProduct.colors.map((c) => (
                    <div
                      key={c.id}
                      className="p-2.5 rounded-lg border border-zinc-200 flex items-center gap-2 bg-white"
                    >
                      <div
                        className="w-6 h-6 rounded-full border border-zinc-300 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-zinc-800 block truncate">{c.name}</span>
                        <span className="text-[10px] text-zinc-400 font-mono block">{c.hex}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
