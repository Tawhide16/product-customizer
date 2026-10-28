'use client';

import React, { useRef, useState } from 'react';
import { ImageElement, PrintArea } from '@/types/customizer';
import { Upload, CheckCircle2, AlertCircle, Sparkles, SlidersHorizontal, Image as ImageIcon } from 'lucide-react';

interface UploadControlsProps {
  selectedElement: ImageElement | null;
  activePrintArea: PrintArea;
  onUpdateImage: (updates: Partial<ImageElement>) => void;
  onAddImage: (imgData: {
    src: string;
    originalFileName: string;
    naturalWidth: number;
    naturalHeight: number;
    dpiRating: 'good' | 'medium' | 'low';
  }) => void;
}

// Built-in starter artworks so user can test upload with 1-click immediately!
const SAMPLE_GRAPHICS = [
  {
    name: 'Cyber Tiger Crest',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    width: 600,
    height: 600,
  },
  {
    name: 'Golden Solar Emblem',
    url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&auto=format&fit=crop&q=80',
    width: 600,
    height: 600,
  },
  {
    name: 'Cosmic Retro Astronaut',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    width: 600,
    height: 600,
  },
];

export const UploadControls: React.FC<UploadControlsProps> = ({
  selectedElement,
  activePrintArea,
  onUpdateImage,
  onAddImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Compute DPI rating given image resolution and physical print dimensions
  const calculateDpiRating = (w: number, h: number): 'good' | 'medium' | 'low' => {
    // Print size target in inches e.g. 12" x 16"
    const reqW = activePrintArea.physicalWidthInches * 150; // min 150 DPI for medium, 300 for good
    if (w >= reqW) return 'good';
    if (w >= reqW * 0.5) return 'medium';
    return 'low';
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, SVG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const rating = calculateDpiRating(img.naturalWidth, img.naturalHeight);
        onAddImage({
          src,
          originalFileName: file.name,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          dpiRating: rating,
        });
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="space-y-4 p-4 text-zinc-800">
      {/* If an image is selected, show filter and DPI inspector */}
      {selectedElement ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4" /> Selected Artwork Filter
            </span>
            <span className="text-xs text-zinc-500 truncate max-w-[140px]">
              {selectedElement.originalFileName || 'Uploaded Graphic'}
            </span>
          </div>

          {/* DPI Rating Badge */}
          <div
            className={`p-3 rounded-xl border flex items-center gap-3 ${
              selectedElement.dpiRating === 'good'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : selectedElement.dpiRating === 'medium'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            {selectedElement.dpiRating === 'good' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            )}
            <div className="text-xs">
              <p className="font-semibold">
                {selectedElement.dpiRating === 'good'
                  ? 'High Resolution Print-Ready (300+ DPI)'
                  : selectedElement.dpiRating === 'medium'
                  ? 'Standard Resolution (150 - 250 DPI)'
                  : 'Low Resolution (Sub-optimal clarity)'}
              </p>
              <p className="text-[11px] opacity-80 mt-0.5 font-mono">
                {selectedElement.naturalWidth} × {selectedElement.naturalHeight}px native size
              </p>
            </div>
          </div>

          {/* Color & Photo Filters */}
          <div>
            <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Image Filter</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'none', label: 'Normal' },
                { id: 'grayscale', label: 'B & W' },
                { id: 'sepia', label: 'Vintage' },
                { id: 'invert', label: 'Invert' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => onUpdateImage({ filter: f.id as ImageElement['filter'] })}
                  className={`py-2 px-1 text-center rounded-lg border text-xs font-medium transition cursor-pointer ${
                    (selectedElement.filter || 'none') === f.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Upload Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
            : 'border-zinc-300 hover:border-emerald-500 bg-white hover:bg-zinc-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/svg+xml, image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 shadow-inner">
          <Upload className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-semibold text-zinc-800">Drop your logo or design here</h4>
        <p className="text-xs text-zinc-500 mt-1">Supports PNG, JPG, SVG, WebP up to 25MB</p>
        <span className="inline-block mt-3 px-3 py-1 rounded-md bg-zinc-100 text-zinc-700 text-xs font-medium border border-zinc-200">
          Browse Device Files
        </span>
      </div>

      {/* 1-Click Sample Artworks */}
      <div className="pt-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Or test with demo sample artworks:</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {SAMPLE_GRAPHICS.map((sample) => (
            <button
              key={sample.name}
              onClick={() =>
                onAddImage({
                  src: sample.url,
                  originalFileName: `${sample.name}.png`,
                  naturalWidth: sample.width,
                  naturalHeight: sample.height,
                  dpiRating: 'good',
                })
              }
              className="group relative rounded-xl overflow-hidden border border-zinc-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition aspect-square"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sample.url}
                alt={sample.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-semibold text-center p-1">
                + Add
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
