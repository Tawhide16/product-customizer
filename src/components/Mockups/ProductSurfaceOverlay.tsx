'use client';

import React from 'react';

interface ProductSurfaceOverlayProps {
  mockupKey: string;
  isDarkProduct?: boolean;
}

export const ProductSurfaceOverlay: React.FC<ProductSurfaceOverlayProps> = ({
  mockupKey,
  isDarkProduct,
}) => {
  if (mockupKey === 'case-back') {
    return (
      <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden select-none z-20">
        {/* Sleek Polycarbonate Specular Glass Reflection Sheen */}
        <div
          className="absolute inset-0 mix-blend-overlay opacity-85"
          style={{
            background:
              'linear-gradient(135deg, transparent 20%, rgba(255,255,255,0.03) 35%, rgba(255,255,255,0.4) 48%, rgba(255,255,255,0.1) 54%, transparent 70%)',
          }}
        />
        {/* Subtle Lens & Bumper Edge Inset Contour */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            boxShadow: 'inset 0 0 14px rgba(0,0,0,0.25), inset 0 1px 3px rgba(255,255,255,0.2)',
          }}
        />
      </div>
    );
  }

  if (mockupKey.startsWith('tshirt')) {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-20">
        {/* Fine Cotton Jersey Weave Pattern (embeds into printed text & artwork) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.16] mix-blend-overlay">
          <pattern id="cotton-knit" width="4" height="4" patternUnits="userSpaceOnUse">
            <path d="M 0 1 Q 2 0 4 1 M 0 3 Q 2 2 4 3" fill="none" stroke="currentColor" strokeWidth="0.6" className="text-zinc-950" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#cotton-knit)" />
        </svg>

        {/* Natural Chest Drape Lighting & Fabric Curvature */}
        <div
          className="absolute inset-0 mix-blend-multiply opacity-55"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 22%, rgba(0,0,0,0.05) 55%, rgba(0,0,0,0.14) 100%)',
          }}
        />
        {/* Subtle Vertical Fabric Crease Ripples */}
        <div
          className="absolute inset-0 mix-blend-multiply opacity-45"
          style={{
            background:
              'repeating-linear-gradient(92deg, transparent 0px, transparent 32px, rgba(0,0,0,0.04) 38px, transparent 46px)',
          }}
        />
        {/* Ambient Top Studio Light Reflection */}
        <div
          className="absolute inset-0 mix-blend-soft-light opacity-35"
          style={{
            background:
              'radial-gradient(ellipse at 50% 25%, rgba(255,255,255,0.65) 0%, transparent 68%)',
          }}
        />
      </div>
    );
  }

  if (mockupKey.startsWith('hoodie')) {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-20">
        {/* Brushed Fleece Texture Pattern */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.18] mix-blend-overlay">
          <pattern id="fleece-knit" width="5" height="5" patternUnits="userSpaceOnUse">
            <circle cx="2.5" cy="2.5" r="0.8" fill="currentColor" className="text-zinc-950" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#fleece-knit)" />
        </svg>

        {/* Heavy Fleece Hood Cast Shadow at Top */}
        <div
          className="absolute inset-0 mix-blend-multiply opacity-65"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.24) 0%, rgba(0,0,0,0.08) 20%, transparent 45%)',
          }}
        />
        {/* Kangaroo Pocket Contour Shadow at Bottom */}
        <div
          className="absolute inset-0 mix-blend-multiply opacity-50"
          style={{
            background:
              'linear-gradient(0deg, rgba(0,0,0,0.18) 0%, transparent 24%)',
          }}
        />
        {/* Fleece Surface Warmth & Depth */}
        <div
          className="absolute inset-0 mix-blend-soft-light opacity-30"
          style={{
            background:
              'radial-gradient(circle at 50% 38%, rgba(255,255,255,0.45) 0%, transparent 65%)',
          }}
        />
      </div>
    );
  }

  if (mockupKey.startsWith('pillow')) {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-20">
        {/* Plush Linen Weave Pattern */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.16] mix-blend-overlay">
          <pattern id="linen-weave" width="4" height="4" patternUnits="userSpaceOnUse">
            <path d="M 0 2 Q 2 3 4 2" fill="none" stroke="currentColor" strokeWidth="0.65" className="text-zinc-950" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#linen-weave)" />
        </svg>

        {/* 3D Plush Cushion Spherical Center Volume */}
        <div
          className="absolute inset-0 mix-blend-multiply opacity-60"
          style={{
            background:
              'radial-gradient(circle at 48% 46%, transparent 35%, rgba(0,0,0,0.08) 65%, rgba(0,0,0,0.24) 100%)',
          }}
        />
        {/* Center Plump Highlight */}
        <div
          className="absolute inset-0 mix-blend-screen opacity-25"
          style={{
            background:
              'radial-gradient(circle at 48% 46%, rgba(255,255,255,0.85) 0%, transparent 55%)',
          }}
        />
        {/* Corner Tension Folds Shadow */}
        <div
          className="absolute inset-0 mix-blend-multiply opacity-40"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.18) 100%)',
          }}
        />
      </div>
    );
  }

  if (mockupKey.startsWith('tote')) {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-20">
        {/* Natural Woven Canvas Texture */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.20] mix-blend-overlay">
          <pattern id="canvas-grid" width="4" height="4" patternUnits="userSpaceOnUse">
            <path d="M 0 2 L 4 2 M 2 0 L 2 4" fill="none" stroke="currentColor" strokeWidth="0.75" className="text-zinc-950" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#canvas-grid)" />
        </svg>

        {/* Heavy Woven Canvas Hanging Gravity Shadows */}
        <div
          className="absolute inset-0 mix-blend-multiply opacity-45"
          style={{
            background:
              'linear-gradient(90deg, rgba(0,0,0,0.06) 0%, transparent 12%, transparent 88%, rgba(0,0,0,0.06) 100%)',
          }}
        />
        {/* Vertical subtle canvas drape */}
        <div
          className="absolute inset-0 mix-blend-multiply opacity-35"
          style={{
            background:
              'repeating-linear-gradient(90deg, transparent 0px, transparent 24px, rgba(0,0,0,0.035) 28px, transparent 34px)',
          }}
        />
      </div>
    );
  }

  return null;
};
