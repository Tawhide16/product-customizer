'use client';

import React from 'react';
import { DesignElement, PrintSideId } from '@/types/customizer';
import {
  Layers,
  ArrowUp,
  ArrowDown,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  AlignCenterHorizontal,
  AlignCenterVertical,
  Type,
  Image as ImageIcon,
  Shapes,
} from 'lucide-react';

interface LayersControlsProps {
  elements: DesignElement[];
  activeSideId: PrintSideId;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onReorderLayer: (id: string, direction: 'up' | 'down') => void;
  onAlignCenter: (id: string, axis: 'h' | 'v') => void;
}

export const LayersControls: React.FC<LayersControlsProps> = ({
  elements,
  activeSideId,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onReorderLayer,
  onAlignCenter,
}) => {
  const currentSideElements = elements
    .filter((el) => el.sideId === activeSideId)
    .sort((a, b) => b.zIndex - a.zIndex); // Display highest layer on top

  return (
    <div className="space-y-4 p-4 text-zinc-800">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-emerald-700" /> Active Side Layers ({currentSideElements.length})
        </span>
        <span className="text-[11px] text-zinc-400">Drag or reorder</span>
      </div>

      {currentSideElements.length === 0 ? (
        <div className="py-12 text-center text-zinc-400 text-xs">
          <Layers className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p>No design elements on this side yet.</p>
          <p className="mt-1 text-[11px]">Add text, clipart, or upload an image to begin.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {currentSideElements.map((el, idx) => {
            const isSelected = el.id === selectedElementId;

            return (
              <div
                key={el.id}
                onClick={() => onSelectElement(el.id)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-emerald-50/80 border-emerald-500 shadow-sm'
                    : 'bg-white border-zinc-200 hover:border-zinc-300'
                }`}
              >
                {/* Element icon & label */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-emerald-600 text-white' : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    {el.type === 'text' && <Type className="w-3.5 h-3.5" />}
                    {el.type === 'clipart' && <Shapes className="w-3.5 h-3.5" />}
                    {el.type === 'image' && <ImageIcon className="w-3.5 h-3.5" />}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-zinc-800 truncate">
                      {el.type === 'text'
                        ? el.text
                        : el.type === 'clipart'
                        ? el.name
                        : el.type === 'qrcode'
                        ? 'QR Code'
                        : el.type === 'roster'
                        ? 'Player Roster'
                        : el.type === 'image'
                        ? el.originalFileName || 'Uploaded Graphic'
                        : 'Custom Element'}
                    </p>
                    <p className="text-[10px] text-zinc-400 capitalize">
                      {el.type} • Layer #{el.zIndex}
                    </p>
                  </div>
                </div>

                {/* Layer Actions */}
                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onReorderLayer(el.id, 'up')}
                    disabled={idx === 0}
                    title="Bring Forward"
                    className="p-1 rounded text-zinc-500 hover:text-zinc-900 disabled:opacity-30 transition"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onReorderLayer(el.id, 'down')}
                    disabled={idx === currentSideElements.length - 1}
                    title="Send Backward"
                    className="p-1 rounded text-zinc-500 hover:text-zinc-900 disabled:opacity-30 transition"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onUpdateElement(el.id, { isVisible: el.isVisible === false ? true : false })}
                    title={el.isVisible === false ? 'Show' : 'Hide'}
                    className="p-1 rounded text-zinc-500 hover:text-zinc-900 transition"
                  >
                    {el.isVisible === false ? <EyeOff className="w-3.5 h-3.5 text-zinc-400" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => onUpdateElement(el.id, { isLocked: !el.isLocked })}
                    title={el.isLocked ? 'Unlock' : 'Lock'}
                    className="p-1 rounded text-zinc-500 hover:text-zinc-900 transition"
                  >
                    {el.isLocked ? <Lock className="w-3.5 h-3.5 text-amber-600" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => onDeleteElement(el.id)}
                    title="Delete"
                    className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Alignment Fast Actions (if an element is selected) */}
      {selectedElementId && (
        <div className="pt-3 border-t border-zinc-200">
          <label className="block text-xs font-semibold text-zinc-600 mb-2">Align to Center</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onAlignCenter(selectedElementId, 'h')}
              className="py-2 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition"
            >
              <AlignCenterHorizontal className="w-3.5 h-3.5" />
              <span>Center Horizontally</span>
            </button>
            <button
              onClick={() => onAlignCenter(selectedElementId, 'v')}
              className="py-2 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition"
            >
              <AlignCenterVertical className="w-3.5 h-3.5" />
              <span>Center Vertically</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
