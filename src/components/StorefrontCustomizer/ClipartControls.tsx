'use client';

import React, { useState } from 'react';
import { CLIPART_ITEMS, CLIPART_CATEGORIES, ClipartItem } from '@/data/clipart';
import { ClipartElement } from '@/types/customizer';
import { Shapes, Search, Palette } from 'lucide-react';

interface ClipartControlsProps {
  selectedElement: ClipartElement | null;
  onUpdateClipart: (updates: Partial<ClipartElement>) => void;
  onAddClipart: (item: ClipartItem, fill: string) => void;
}

const PRESET_COLORS = [
  '#000000',
  '#ffffff',
  '#dc2626',
  '#ea580c',
  '#f59e0b',
  '#16a34a',
  '#0284c7',
  '#4f46e5',
  '#9333ea',
  '#1e293b',
  '#64748b',
];

export const ClipartControls: React.FC<ClipartControlsProps> = ({
  selectedElement,
  onUpdateClipart,
  onAddClipart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeColor, setActiveColor] = useState('#18181b');

  const filteredItems = CLIPART_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-4 p-4 text-zinc-800">
      {/* If a clipart element is selected, allow recoloring it */}
      {selectedElement ? (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <Palette className="w-4 h-4" /> Recolor Selected Graphic
            </span>
            <span className="text-xs text-emerald-700 font-medium">{selectedElement.name}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {PRESET_COLORS.map((col) => (
              <button
                key={col}
                onClick={() => onUpdateClipart({ fill: col })}
                className={`w-6 h-6 rounded-full border border-zinc-300 transition-transform ${
                  selectedElement.fill.toLowerCase() === col.toLowerCase()
                    ? 'scale-110 ring-2 ring-emerald-600 ring-offset-1'
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: col }}
                title={col}
              />
            ))}
            <input
              type="color"
              value={selectedElement.fill}
              onChange={(e) => onUpdateClipart({ fill: e.target.value })}
              className="w-7 h-7 rounded cursor-pointer p-0"
            />
          </div>
        </div>
      ) : (
        /* Clipart Default Tint */
        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Initial Graphic Color</label>
          <div className="flex flex-wrap items-center gap-1.5">
            {PRESET_COLORS.map((col) => (
              <button
                key={col}
                onClick={() => setActiveColor(col)}
                className={`w-6 h-6 rounded-full border border-zinc-300 transition-transform ${
                  activeColor.toLowerCase() === col.toLowerCase()
                    ? 'scale-110 ring-2 ring-emerald-500 ring-offset-1'
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: col }}
                title={col}
              />
            ))}
            <input
              type="color"
              value={activeColor}
              onChange={(e) => setActiveColor(e.target.value)}
              className="w-7 h-7 rounded cursor-pointer p-0"
            />
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Search vectors & graphics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1 pb-1">
        {CLIPART_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
              selectedCategory === cat
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Clipart Grid */}
      <div className="grid grid-cols-3 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
        {filteredItems.map((item) => {
          const previewSvg = item.svg.replace(/currentColor/g, activeColor);

          return (
            <button
              key={item.id}
              onClick={() => onAddClipart(item, activeColor)}
              title={item.name}
              className="group flex flex-col items-center justify-center p-3 aspect-square bg-white border border-zinc-200 hover:border-emerald-500 rounded-xl hover:shadow-md transition-all cursor-pointer"
            >
              <div
                className="w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform"
                dangerouslySetInnerHTML={{ __html: previewSvg }}
              />
              <span className="text-[10px] text-zinc-500 font-medium truncate w-full text-center mt-2 group-hover:text-emerald-700">
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
