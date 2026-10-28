'use client';

import React from 'react';
import { DesignElement } from '@/types/customizer';
import { LayoutTemplate, Sparkles, Check } from 'lucide-react';

interface TemplatesControlsProps {
  onApplyTemplate: (elements: DesignElement[]) => void;
}

export const TEMPLATES_DATA = [
  {
    id: 'tpl-brooklyn-athletic',
    name: 'Brooklyn Athletics 1994',
    category: 'Sports & Streetwear',
    description: 'Arch text with laurel wreath and varsity typography.',
    elements: [
      {
        id: 'tpl-el-1',
        sideId: 'front',
        type: 'text',
        text: 'BROOKLYN',
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 42,
        fill: '#ffffff',
        textAlign: 'center',
        x: 18,
        y: 20,
        width: 64,
        height: 18,
        rotation: 0,
        zIndex: 1,
        opacity: 1,
        isBold: true,
        isItalic: false,
        isUnderline: false,
        isCurved: true,
        curveRadius: 40,
        letterSpacing: 2,
      },
      {
        id: 'tpl-el-2',
        sideId: 'front',
        type: 'clipart',
        name: 'Champion Laurel Wreath',
        category: 'Badges & Emblems',
        svgContent: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M30 20 C25 28 25 40 32 50 C22 45 18 35 22 25 Z M25 45 C18 55 20 68 30 76 C20 70 15 58 18 48 Z M35 70 C30 80 40 90 50 92 C42 86 36 78 38 70 Z M70 20 C75 28 75 40 68 50 C78 45 82 35 78 25 Z M75 45 C82 55 80 68 70 76 C80 70 85 58 82 48 Z M65 70 C70 80 60 90 50 92 C58 86 64 78 62 70 Z"/></svg>`,
        fill: '#f59e0b',
        x: 32,
        y: 44,
        width: 36,
        height: 36,
        rotation: 0,
        zIndex: 2,
        opacity: 1,
      },
      {
        id: 'tpl-el-3',
        sideId: 'front',
        type: 'text',
        text: 'VARSITY LEAGUE',
        fontFamily: "'Montserrat', sans-serif",
        fontSize: 16,
        fill: '#ffffff',
        textAlign: 'center',
        x: 22,
        y: 84,
        width: 56,
        height: 12,
        rotation: 0,
        zIndex: 3,
        opacity: 1,
        isBold: true,
        isItalic: false,
        isUnderline: false,
        isCurved: false,
        curveRadius: 0,
        letterSpacing: 3,
      },
    ] as DesignElement[],
  },
  {
    id: 'tpl-mountain-adventure',
    name: 'Alpine Explorer Club',
    category: 'Nature & Outdoor',
    description: 'Mountain twin peaks emblem with compass coordinate.',
    elements: [
      {
        id: 'tpl-el-4',
        sideId: 'front',
        type: 'clipart',
        name: 'Alpine Mountain Peaks',
        category: 'Nature & Adventure',
        svgContent: `<svg viewBox="0 0 100 100" fill="currentColor"><polygon points="10,85 45,25 65,60 80,40 95,85" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><polygon points="45,25 35,42 42,40 45,46 48,41 55,43" fill="currentColor"/><polygon points="80,40 74,52 80,50 86,52" fill="currentColor"/><circle cx="75" cy="22" r="8" fill="currentColor"/></svg>`,
        fill: '#ffffff',
        x: 25,
        y: 22,
        width: 50,
        height: 48,
        rotation: 0,
        zIndex: 1,
        opacity: 1,
      },
      {
        id: 'tpl-el-5',
        sideId: 'front',
        type: 'text',
        text: 'WILDERNESS EXPEDITION',
        fontFamily: "'Oswald', sans-serif",
        fontSize: 18,
        fill: '#f59e0b',
        textAlign: 'center',
        x: 10,
        y: 74,
        width: 80,
        height: 14,
        rotation: 0,
        zIndex: 2,
        opacity: 1,
        isBold: true,
        isItalic: false,
        isUnderline: false,
        isCurved: false,
        curveRadius: 0,
        letterSpacing: 2,
      },
    ] as DesignElement[],
  },
  {
    id: 'tpl-cyber-streetwear',
    name: 'Tokyo Cyberpunk Y2K',
    category: 'Streetwear',
    description: 'Futuristic chrome star with acid drip tag.',
    elements: [
      {
        id: 'tpl-el-6',
        sideId: 'front',
        type: 'clipart',
        name: 'Four-Point Chrome Star',
        category: 'Streetwear & Y2K',
        svgContent: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 5 Q50 45 95 50 Q50 50 50 95 Q50 50 5 50 Q50 45 50 5 Z"/></svg>`,
        fill: '#10b981',
        x: 25,
        y: 25,
        width: 50,
        height: 50,
        rotation: 0,
        zIndex: 1,
        opacity: 1,
      },
      {
        id: 'tpl-el-7',
        sideId: 'front',
        type: 'text',
        text: 'CYBER DIVISION',
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 32,
        fill: '#ffffff',
        textAlign: 'center',
        x: 15,
        y: 78,
        width: 70,
        height: 16,
        rotation: 0,
        zIndex: 2,
        opacity: 1,
        isBold: true,
        isItalic: false,
        isUnderline: false,
        isCurved: false,
        curveRadius: 0,
        letterSpacing: 4,
      },
    ] as DesignElement[],
  },
];

export const TemplatesControls: React.FC<TemplatesControlsProps> = ({ onApplyTemplate }) => {
  return (
    <div className="space-y-4 p-4 text-zinc-800">
      <div className="flex items-center gap-2 pb-2 border-b border-zinc-200">
        <LayoutTemplate className="w-4 h-4 text-emerald-700" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700">
          Browse Design Ideas
        </h3>
      </div>

      <p className="text-[11px] text-zinc-500 leading-relaxed">
        Choose a professionally pre-made design template and customize the text, colors, and layout.
      </p>

      <div className="space-y-3">
        {TEMPLATES_DATA.map((tpl) => (
          <div
            key={tpl.id}
            className="p-3 bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-emerald-500 rounded-xl transition shadow-2xs group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-zinc-900 group-hover:text-emerald-700">
                  {tpl.name}
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-medium">
                  {tpl.category}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">{tpl.description}</p>
            </div>

            <button
              onClick={() => onApplyTemplate(tpl.elements)}
              className="mt-3 w-full py-1.5 px-3 bg-zinc-900 group-hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Use This Template</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
