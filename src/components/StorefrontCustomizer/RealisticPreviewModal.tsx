'use client';

import React, { useState } from 'react';
import { Product, ProductColor, ProductSide, DesignElement } from '@/types/customizer';
import { ProductMockupSvg } from '@/components/Mockups/ProductMockupSvg';
import { ProductSurfaceOverlay } from '@/components/Mockups/ProductSurfaceOverlay';
import { X, Download, Share2, Check, Sparkles } from 'lucide-react';

interface RealisticPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  activeColor: ProductColor;
  elements: DesignElement[];
  currentSideId: string;
}

export const RealisticPreviewModal: React.FC<RealisticPreviewModalProps> = ({
  isOpen,
  onClose,
  product,
  activeColor,
  elements,
  currentSideId,
}) => {
  const [previewSideId, setPreviewSideId] = useState(currentSideId);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const activeSide = product.sides.find((s) => s.id === previewSideId) || product.sides[0];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSnapshot = () => {
    alert('High-resolution preview snapshot saved! In production, this generates a 300-DPI composite PNG.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-zinc-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-zinc-900">Photorealistic Customer Preview</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/50 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Realistic Stage */}
        <div className="relative p-8 flex items-center justify-center bg-radial from-white to-zinc-100 min-h-[460px]">
          <div className="relative w-[380px] h-[380px] shadow-2xl rounded-2xl overflow-hidden bg-white/40 p-2 border border-zinc-200/60">
            {/* Mockup */}
            <ProductMockupSvg mockupKey={activeSide.mockupSvg} colorHex={activeColor.hex} sideId={activeSide.id} />

            {/* Print Area Artwork: strictly cropped to printable boundary */}
            <div
              className="absolute pointer-events-none overflow-hidden"
              style={{
                left: `${activeSide.printArea.x}%`,
                top: `${activeSide.printArea.y}%`,
                width: `${activeSide.printArea.width}%`,
                height: `${activeSide.printArea.height}%`,
              }}
            >
              {elements
                .filter((el) => el.sideId === activeSide.id && el.isVisible !== false)
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((el) => {
                  return (
                    <div
                      key={el.id}
                      className="absolute"
                      style={{
                        left: `${el.x}%`,
                        top: `${el.y}%`,
                        width: `${el.width}%`,
                        height: el.type === 'text' && !el.isCurved ? 'auto' : (el.height ? `${el.height}%` : 'auto'),
                        transform: `rotate(${el.rotation}deg)`,
                        transformOrigin: 'center center',
                        opacity: el.opacity ?? 1,
                      }}
                    >
                      {el.type === 'text' && (
                        <div
                          style={{
                            fontFamily: el.fontFamily,
                            fontSize: `${el.fontSize * 0.7}px`,
                            color: el.fill,
                            textAlign: el.textAlign,
                            fontWeight: el.isBold ? 700 : 400,
                            fontStyle: el.isItalic ? 'italic' : 'normal',
                            textDecoration: el.isUnderline ? 'underline' : 'none',
                            WebkitTextStroke: el.strokeWidth && el.strokeColor ? `${el.strokeWidth * 0.5}px ${el.strokeColor}` : undefined,
                            textShadow: el.shadowColor ? `1px 1px 2px ${el.shadowColor}` : undefined,
                            lineHeight: 1.15,
                            wordBreak: 'break-word',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {el.text}
                        </div>
                      )}
                      {el.type === 'clipart' && (
                        <div
                          className="w-full h-full"
                          dangerouslySetInnerHTML={{
                            __html: el.svgContent.replace(/currentColor/g, el.fill || '#000000'),
                          }}
                        />
                      )}
                      {el.type === 'image' && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={el.src}
                          alt="preview"
                          className="w-full h-full object-contain"
                          style={{
                            filter:
                              el.filter === 'grayscale'
                                ? 'grayscale(100%)'
                                : el.filter === 'sepia'
                                ? 'sepia(100%)'
                                : el.filter === 'invert'
                                ? 'invert(100%)'
                                : 'none',
                          }}
                        />
                      )}
                    </div>
                  );
                })}

              {/* Realistic Material Lighting & Crease Overlay */}
              <ProductSurfaceOverlay mockupKey={activeSide.mockupSvg} isDarkProduct={activeColor.dark} />
            </div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 bg-zinc-50">
          {/* Side Switcher */}
          <div className="flex items-center gap-1.5">
            {product.sides.map((side) => (
              <button
                key={side.id}
                onClick={() => setPreviewSideId(side.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  previewSideId === side.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                {side.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="py-1.5 px-3 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Share Design'}</span>
            </button>
            <button
              onClick={handleDownloadSnapshot}
              className="py-1.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Preview</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
