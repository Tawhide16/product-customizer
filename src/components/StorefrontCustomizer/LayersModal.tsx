'use client';

import React from 'react';
import { DesignElement, PrintSideId } from '@/types/customizer';
import {
  X,
  Layers,
  ArrowUp,
  ArrowDown,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  Type,
  Shapes,
  Image as ImageIcon,
  QrCode,
  Users,
} from 'lucide-react';

interface LayersModalProps {
  isOpen: boolean;
  onClose: () => void;
  elements: DesignElement[];
  activeSideId: PrintSideId;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onReorderLayer: (id: string, direction: 'up' | 'down') => void;
}

export const LayersModal: React.FC<LayersModalProps> = ({
  isOpen,
  onClose,
  elements,
  activeSideId,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onReorderLayer,
}) => {
  if (!isOpen) return null;

  const currentSideElements = elements
    .filter((el) => el.sideId === activeSideId)
    .sort((a, b) => b.zIndex - a.zIndex);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-zinc-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-zinc-900">
              Manage Design Layers ({currentSideElements.length})
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-zinc-400 hover:text-zinc-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentSideElements.length === 0 ? (
          <p className="text-xs text-zinc-400 text-center py-8">
            No design elements on this side yet.
          </p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {currentSideElements.map((el, idx) => {
              const isSelected = el.id === selectedElementId;
              return (
                <div
                  key={el.id}
                  onClick={() => onSelectElement(el.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition ${
                    isSelected ? 'border-emerald-600 bg-emerald-50/50 shadow-2xs' : 'border-zinc-200 bg-white hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600 shrink-0">
                      {el.type === 'text' && <Type className="w-3.5 h-3.5" />}
                      {el.type === 'clipart' && <Shapes className="w-3.5 h-3.5" />}
                      {el.type === 'image' && <ImageIcon className="w-3.5 h-3.5" />}
                      {el.type === 'qrcode' && <QrCode className="w-3.5 h-3.5" />}
                      {el.type === 'roster' && <Users className="w-3.5 h-3.5" />}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-zinc-800 block truncate">
                        {el.type === 'text'
                          ? el.text
                          : el.type === 'clipart'
                          ? el.name
                          : el.type === 'qrcode'
                          ? 'QR Code'
                          : el.type === 'roster'
                          ? 'Player Roster'
                          : el.originalFileName || 'Graphic'}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        Level #{el.zIndex} • Opacity {Math.round((el.opacity ?? 1) * 100)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onReorderLayer(el.id, 'up')}
                      disabled={idx === 0}
                      title="Bring Forward"
                      className="p-1 rounded text-zinc-500 hover:text-zinc-900 disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onReorderLayer(el.id, 'down')}
                      disabled={idx === currentSideElements.length - 1}
                      title="Send Backward"
                      className="p-1 rounded text-zinc-500 hover:text-zinc-900 disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onUpdateElement(el.id, { isVisible: el.isVisible === false ? true : false })}
                      title={el.isVisible === false ? 'Show' : 'Hide'}
                      className="p-1 rounded text-zinc-500 hover:text-zinc-900"
                    >
                      {el.isVisible === false ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => onUpdateElement(el.id, { isLocked: !el.isLocked })}
                      title={el.isLocked ? 'Unlock' : 'Lock'}
                      className="p-1 rounded text-zinc-500 hover:text-zinc-900"
                    >
                      {el.isLocked ? <Lock className="w-3.5 h-3.5 text-amber-600" /> : <Unlock className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => onDuplicateElement(el.id)}
                      title="Duplicate"
                      className="p-1 rounded text-zinc-500 hover:text-zinc-900"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteElement(el.id)}
                      title="Delete"
                      className="p-1 rounded text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-semibold hover:bg-zinc-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
