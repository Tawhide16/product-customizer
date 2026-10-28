'use client';

import React from 'react';
import { ProductColor } from '@/types/customizer';
import { X, Check, Palette } from 'lucide-react';

interface EditColorModalProps {
  isOpen: boolean;
  onClose: () => void;
  colors: ProductColor[];
  selectedColor: ProductColor;
  onSelectColor: (color: ProductColor) => void;
}

export const EditColorModal: React.FC<EditColorModalProps> = ({
  isOpen,
  onClose,
  colors,
  selectedColor,
  onSelectColor,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-zinc-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-zinc-900">Select Product Color</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-zinc-400 hover:text-zinc-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {colors.map((c) => {
            const isSelected = c.id === selectedColor.id;
            return (
              <div
                key={c.id}
                onClick={() => {
                  onSelectColor(c);
                  onClose();
                }}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-2xs'
                    : 'border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-full border border-zinc-300 shadow-2xs"
                    style={{ backgroundColor: c.hex }}
                  />
                  <div>
                    <span className="text-xs font-bold text-zinc-800 block">{c.name}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">{c.hex}</span>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
