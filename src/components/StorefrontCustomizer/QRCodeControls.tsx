'use client';

import React, { useState } from 'react';
import QRCode from 'qrcode';
import { QRCodeElement } from '@/types/customizer';
import { QrCode, Sparkles, Link2 } from 'lucide-react';

interface QRCodeControlsProps {
  selectedElement: QRCodeElement | null;
  onUpdateQRCode: (updates: Partial<QRCodeElement>) => void;
  onAddQRCode: (url: string, qrSvg: string, fill: string) => void;
}

const PRESET_COLORS = ['#000000', '#ffffff', '#1e293b', '#dc2626', '#16a34a', '#2563eb', '#9333ea'];

export const QRCodeControls: React.FC<QRCodeControlsProps> = ({
  selectedElement,
  onUpdateQRCode,
  onAddQRCode,
}) => {
  const [qrText, setQrText] = useState('https://inkybay.com');
  const [qrColor, setQrColor] = useState('#000000');
  const [previewSvg, setPreviewSvg] = useState<string>('');

  React.useEffect(() => {
    QRCode.toString(qrText || 'https://inkybay.com', {
      type: 'svg',
      color: {
        dark: qrColor,
        light: '#00000000', // transparent background
      },
      margin: 1,
    })
      .then((svgStr) => setPreviewSvg(svgStr))
      .catch((err) => console.error(err));
  }, [qrText, qrColor]);

  const handleAdd = async () => {
    if (!qrText.trim()) return;
    try {
      const svgStr = await QRCode.toString(qrText, {
        type: 'svg',
        color: {
          dark: qrColor,
          light: '#00000000',
        },
        margin: 1,
      });
      onAddQRCode(qrText, svgStr, qrColor);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-4 p-4 text-zinc-800">
      <div className="flex items-center gap-2 pb-2 border-b border-zinc-200">
        <QrCode className="w-4 h-4 text-emerald-700" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700">
          {selectedElement ? 'Edit QR Code' : 'Generate Vector QR Code'}
        </h3>
      </div>

      <div>
        <label className="block text-xs font-semibold text-zinc-600 mb-1">
          Website Link or Text Content
        </label>
        <div className="relative">
          <Link2 className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
          <input
            type="text"
            value={selectedElement ? selectedElement.url : qrText}
            onChange={(e) => {
              if (selectedElement) {
                QRCode.toString(e.target.value, {
                  type: 'svg',
                  color: { dark: selectedElement.fill, light: '#00000000' },
                  margin: 1,
                }).then((svg) => onUpdateQRCode({ url: e.target.value, qrSvg: svg }));
              } else {
                setQrText(e.target.value);
              }
            }}
            placeholder="https://example.com or phone"
            className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* QR Color Picker */}
      <div>
        <label className="block text-xs font-semibold text-zinc-600 mb-1.5">QR Code Color</label>
        <div className="flex flex-wrap items-center gap-1.5">
          {PRESET_COLORS.map((col) => (
            <button
              key={col}
              onClick={() => {
                if (selectedElement) {
                  QRCode.toString(selectedElement.url, {
                    type: 'svg',
                    color: { dark: col, light: '#00000000' },
                    margin: 1,
                  }).then((svg) => onUpdateQRCode({ fill: col, qrSvg: svg }));
                } else {
                  setQrColor(col);
                }
              }}
              className={`w-6 h-6 rounded-full border border-zinc-300 transition-transform ${
                (selectedElement ? selectedElement.fill : qrColor).toLowerCase() === col.toLowerCase()
                  ? 'scale-110 ring-2 ring-emerald-500 ring-offset-1'
                  : 'hover:scale-105'
              }`}
              style={{ backgroundColor: col }}
            />
          ))}
          <input
            type="color"
            value={selectedElement ? selectedElement.fill : qrColor}
            onChange={(e) => {
              const col = e.target.value;
              if (selectedElement) {
                QRCode.toString(selectedElement.url, {
                  type: 'svg',
                  color: { dark: col, light: '#00000000' },
                  margin: 1,
                }).then((svg) => onUpdateQRCode({ fill: col, qrSvg: svg }));
              } else {
                setQrColor(col);
              }
            }}
            className="w-7 h-7 rounded cursor-pointer p-0"
          />
        </div>
      </div>

      {/* Live Preview Box */}
      <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl flex flex-col items-center justify-center">
        <span className="text-[11px] font-semibold text-zinc-500 mb-2">Vector Output Preview</span>
        <div
          className="w-28 h-28 bg-white p-2 rounded-lg border border-zinc-200 shadow-2xs flex items-center justify-center"
          dangerouslySetInnerHTML={{
            __html: selectedElement ? selectedElement.qrSvg : previewSvg,
          }}
        />
      </div>

      {!selectedElement && (
        <button
          onClick={handleAdd}
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <QrCode className="w-4 h-4" />
          <span>Insert QR Code to Canvas</span>
        </button>
      )}
    </div>
  );
};
