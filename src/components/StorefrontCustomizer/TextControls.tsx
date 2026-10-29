'use client';

import React from 'react';
import { TextElement } from '@/types/customizer';
import { Type, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, Sparkles } from 'lucide-react';

interface TextControlsProps {
  selectedElement: TextElement | null;
  onUpdateText: (updates: Partial<TextElement>) => void;
  onAddText: (text: string, fontFamily: string, fill: string) => void;
}

const POPULAR_FONTS = [
  { name: 'Bebas Neue', family: "'Bebas Neue', sans-serif" },
  { name: 'Montserrat Bold', family: "'Montserrat', sans-serif" },
  { name: 'Pacifico Script', family: "'Pacifico', cursive" },
  { name: 'Playfair Display', family: "'Playfair Display', serif" },
  { name: 'Oswald', family: "'Oswald', sans-serif" },
  { name: 'Dancing Script', family: "'Dancing Script', cursive" },
  { name: 'Caveat Hand', family: "'Caveat', cursive" },
  { name: 'Inter Clean', family: "'Inter', sans-serif" },
  { name: 'Roboto Classic', family: "'Roboto', sans-serif" },
];

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
  '#db2777',
  '#71717a',
  '#e2e8f0',
];

export const TextControls: React.FC<TextControlsProps> = ({
  selectedElement,
  onUpdateText,
  onAddText,
}) => {
  const [newText, setNewText] = React.useState('YOUR TEXT HERE');
  const [selectedFont, setSelectedFont] = React.useState(POPULAR_FONTS[0].family);
  const [selectedColor, setSelectedColor] = React.useState('#18181b');

  const handleCreateText = () => {
    if (!newText.trim()) return;
    onAddText(newText, selectedFont, selectedColor);
  };

  return (
    <div className="space-y-5 p-4 text-zinc-800">
      {/* If an element is selected, edit that element; otherwise quick add */}
      {selectedElement ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <Type className="w-4 h-4" /> Editing Selected Text
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">ID: {selectedElement.id.slice(0, 6)}</span>
          </div>

          {/* Text Content */}
          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1">Text String</label>
            <textarea
              rows={2}
              value={selectedElement.text}
              onChange={(e) => onUpdateText({ text: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition resize-none font-sans"
              placeholder="Enter text (multi-line supported)..."
            />
          </div>

          {/* Font Family Selector */}
          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1">Font Family</label>
            <select
              value={selectedElement.fontFamily}
              onChange={(e) => onUpdateText({ fontFamily: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {POPULAR_FONTS.map((font) => (
                <option key={font.name} value={font.family} style={{ fontFamily: font.family }}>
                  {font.name}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size & Letter Spacing */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-zinc-600 mb-1">
                <span>Font Size</span>
                <span className="text-emerald-700 font-mono">{selectedElement.fontSize}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="72"
                value={selectedElement.fontSize}
                onChange={(e) => onUpdateText({ fontSize: Number(e.target.value) })}
                className="w-full accent-emerald-600"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold text-zinc-600 mb-1">
                <span>Letter Spacing</span>
                <span className="text-emerald-700 font-mono">{selectedElement.letterSpacing || 0}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="16"
                value={selectedElement.letterSpacing || 0}
                onChange={(e) => onUpdateText({ letterSpacing: Number(e.target.value) })}
                className="w-full accent-emerald-600"
              />
            </div>
          </div>

          {/* Text Style & Alignment Toolbar */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center border border-zinc-200 rounded-lg p-0.5 bg-zinc-50">
              <button
                onClick={() => onUpdateText({ isBold: !selectedElement.isBold })}
                className={`p-1.5 rounded-md transition ${
                  selectedElement.isBold ? 'bg-white shadow-xs text-emerald-700 font-bold' : 'text-zinc-600 hover:text-zinc-900'
                }`}
                title="Bold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onUpdateText({ isItalic: !selectedElement.isItalic })}
                className={`p-1.5 rounded-md transition ${
                  selectedElement.isItalic ? 'bg-white shadow-xs text-emerald-700 font-bold' : 'text-zinc-600 hover:text-zinc-900'
                }`}
                title="Italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onUpdateText({ isUnderline: !selectedElement.isUnderline })}
                className={`p-1.5 rounded-md transition ${
                  selectedElement.isUnderline ? 'bg-white shadow-xs text-emerald-700 font-bold' : 'text-zinc-600 hover:text-zinc-900'
                }`}
                title="Underline"
              >
                <Underline className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center border border-zinc-200 rounded-lg p-0.5 bg-zinc-50">
              <button
                onClick={() => onUpdateText({ textAlign: 'left' })}
                className={`p-1.5 rounded-md transition ${
                  selectedElement.textAlign === 'left' ? 'bg-white shadow-xs text-emerald-700' : 'text-zinc-600'
                }`}
                title="Align Left"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onUpdateText({ textAlign: 'center' })}
                className={`p-1.5 rounded-md transition ${
                  selectedElement.textAlign === 'center' ? 'bg-white shadow-xs text-emerald-700' : 'text-zinc-600'
                }`}
                title="Align Center"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onUpdateText({ textAlign: 'right' })}
                className={`p-1.5 rounded-md transition ${
                  selectedElement.textAlign === 'right' ? 'bg-white shadow-xs text-emerald-700' : 'text-zinc-600'
                }`}
                title="Align Right"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Color Picker Swatches */}
          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Text Color</label>
            <div className="flex flex-wrap items-center gap-1.5">
              {PRESET_COLORS.map((col) => (
                <button
                  key={col}
                  onClick={() => onUpdateText({ fill: col })}
                  className={`w-6 h-6 rounded-full border border-zinc-300 transition-transform ${
                    selectedElement.fill.toLowerCase() === col.toLowerCase()
                      ? 'scale-110 ring-2 ring-emerald-500 ring-offset-1'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: col }}
                  title={col}
                />
              ))}
              <input
                type="color"
                value={selectedElement.fill}
                onChange={(e) => onUpdateText({ fill: e.target.value })}
                className="w-7 h-7 rounded-md border border-zinc-300 cursor-pointer p-0"
                title="Custom color picker"
              />
            </div>
          </div>

          {/* Text Effects: Curved / Arch Text */}
          <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Curve / Arch Effect
              </span>
              <input
                type="checkbox"
                checked={selectedElement.isCurved || false}
                onChange={(e) => onUpdateText({ isCurved: e.target.checked })}
                className="accent-emerald-600 w-4 h-4 cursor-pointer"
              />
            </div>
            {selectedElement.isCurved && (
              <div>
                <div className="flex justify-between text-[11px] text-zinc-500 mb-1">
                  <span>Arch Curvature</span>
                  <span className="font-mono">{selectedElement.curveRadius || 45}</span>
                </div>
                <input
                  type="range"
                  min="-90"
                  max="90"
                  value={selectedElement.curveRadius || 45}
                  onChange={(e) => onUpdateText({ curveRadius: Number(e.target.value) })}
                  className="w-full accent-emerald-600"
                />
              </div>
            )}
          </div>

          {/* Stroke / Outline Effect */}
          <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-700">Outline / Stroke</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedElement.strokeColor || '#000000'}
                  onChange={(e) => onUpdateText({ strokeColor: e.target.value })}
                  className="w-5 h-5 rounded cursor-pointer p-0"
                />
                <input
                  type="checkbox"
                  checked={Boolean(selectedElement.strokeWidth && selectedElement.strokeWidth > 0)}
                  onChange={(e) =>
                    onUpdateText({
                      strokeWidth: e.target.checked ? 2 : 0,
                      strokeColor: selectedElement.strokeColor || '#000000',
                    })
                  }
                  className="accent-emerald-600 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
            {Boolean(selectedElement.strokeWidth && selectedElement.strokeWidth > 0) && (
              <input
                type="range"
                min="1"
                max="8"
                value={selectedElement.strokeWidth || 2}
                onChange={(e) => onUpdateText({ strokeWidth: Number(e.target.value) })}
                className="w-full accent-emerald-600"
              />
            )}
          </div>
        </div>
      ) : (
        /* New Text Quick Creator */
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-200">
            <Type className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700">Add Text to Design</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1">Enter Text</label>
            <textarea
              rows={2}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="e.g. BROOKLYN ATHLETICS"
              className="w-full px-3 py-2 text-sm bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1">Choose Font Style</label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1 border border-zinc-200 rounded-lg p-1 bg-white">
              {POPULAR_FONTS.map((font) => (
                <button
                  key={font.name}
                  onClick={() => setSelectedFont(font.family)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition flex items-center justify-between ${
                    selectedFont === font.family
                      ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-300'
                      : 'hover:bg-zinc-100 text-zinc-700'
                  }`}
                  style={{ fontFamily: font.family }}
                >
                  <span>{font.name}</span>
                  <span className="text-xs text-zinc-400 font-sans">Aa</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Initial Color</label>
            <div className="flex flex-wrap items-center gap-1.5">
              {PRESET_COLORS.map((col) => (
                <button
                  key={col}
                  onClick={() => setSelectedColor(col)}
                  className={`w-6 h-6 rounded-full border border-zinc-300 transition-transform ${
                    selectedColor.toLowerCase() === col.toLowerCase()
                      ? 'scale-110 ring-2 ring-emerald-500 ring-offset-1'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: col }}
                  title={col}
                />
              ))}
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-7 h-7 rounded cursor-pointer p-0"
              />
            </div>
          </div>

          <button
            onClick={handleCreateText}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Type className="w-4 h-4" />
            <span>Add Text to Canvas</span>
          </button>
        </div>
      )}
    </div>
  );
};
