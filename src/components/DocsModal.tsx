'use client';

import React from 'react';
import { X, BookOpen, CheckCircle, ShieldCheck, Cpu, Code2, Layers } from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-zinc-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-zinc-900">
              Universal Product Customizer — Blueprint &amp; Specs
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-zinc-400 hover:text-zinc-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-zinc-600 leading-relaxed">
          <div>
            <h4 className="text-sm font-bold text-zinc-900 mb-1 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Origin Product Customizer Architecture
            </h4>
            <p>
              This application implements a universal, cross-platform product personalization engine. The visual designer operates independently of any single e-commerce framework and seamlessly integrates with Standalone Next.js stores, WooCommerce, Shopify, and Headless APIs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
              <span className="font-bold text-zinc-800 block flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-emerald-600" /> Multi-Side Canvas
              </span>
              <p className="text-[11px] text-zinc-500">
                Front, Back, and Sleeves with realistic studio product photos and bounded print zones.
              </p>
            </div>
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
              <span className="font-bold text-zinc-800 block flex items-center gap-1">
                <Code2 className="w-3.5 h-3.5 text-emerald-600" /> 300 DPI Vector Output
              </span>
              <p className="text-[11px] text-zinc-500">
                Instant client-side vector SVG and print ticket generation with physical dimensions.
              </p>
            </div>
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
              <span className="font-bold text-zinc-800 block flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Universal Commerce Design
              </span>
              <p className="text-[11px] text-zinc-500">
                Modern glassmorphic interface designed for standalone D2C web apps and multi-platform stores.
              </p>
            </div>
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
              <span className="font-bold text-zinc-800 block flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-emerald-600" /> Dynamic Pricing Engine
              </span>
              <p className="text-[11px] text-zinc-500">
                Server-validated rules: multi-side fees, upload fees, and volume tiered discounts.
              </p>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-emerald-900">
            <h5 className="font-bold text-xs">How to test the Live Customizer:</h5>
            <ol className="list-decimal pl-4 space-y-1 text-[11px]">
              <li>Use the <strong>Customer Visual Studio</strong> tab to customize text, fonts, curved arch effects, clipart, and upload images.</li>
              <li>Flip between <strong>Front</strong> and <strong>Back</strong> sides using the bottom selector.</li>
              <li>Toggle Garment Colors and watch realistic fabric shadows adapt dynamically.</li>
              <li>Click <strong>&ldquo;Export Vector SVG&rdquo;</strong> to download the production print file.</li>
              <li>Click <strong>&ldquo;Preview Realistic Mockup&rdquo;</strong> for a high-definition clean presentation.</li>
              <li>Click <strong>&ldquo;Add to Cart&rdquo;</strong> to inspect the Shopify checkout manifest with confetti!</li>
            </ol>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs rounded-lg transition"
          >
            Got it, Let&apos;s Design!
          </button>
        </div>
      </div>
    </div>
  );
};
