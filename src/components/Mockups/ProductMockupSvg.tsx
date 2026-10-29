'use client';

import React from 'react';
import { PrintSideId } from '@/types/customizer';

interface ProductMockupSvgProps {
  mockupKey: string;
  colorHex: string;
  sideId: PrintSideId;
  children?: React.ReactNode;
}

const PHOTO_MOCKUPS: Record<
  string,
  {
    image: string;
    alt: string;
  }
> = {
  'case-back': {
    image: '/products/iphone-case.png',
    alt: 'Apple iPhone 16 Pro Tough Case',
  },
  'hoodie-front': {
    image: '/products/hoodie.png',
    alt: 'Streetwear Heavyweight Fleece Hoodie',
  },
  'hoodie-back': {
    image: '/products/hoodie.png',
    alt: 'Streetwear Heavyweight Fleece Hoodie (Back)',
  },
  'tshirt-front': {
    image: '/products/tshirt.png',
    alt: 'Unisex Premium Heavy Cotton T-Shirt',
  },
  'tshirt-back': {
    image: '/products/tshirt.png',
    alt: 'Unisex Premium Heavy Cotton T-Shirt (Back)',
  },
  'tote-front': {
    image: '/products/tote-bag.png',
    alt: 'Heavy Cotton Canvas Market Tote Bag',
  },
  'tote-back': {
    image: '/products/tote-bag.png',
    alt: 'Heavy Cotton Canvas Market Tote Bag (Back)',
  },
  'pillow-front': {
    image: '/products/throw-pillow.png',
    alt: 'Custom Square Plush Throw Pillow',
  },
  'pillow-back': {
    image: '/products/throw-pillow.png',
    alt: 'Custom Square Plush Throw Pillow (Back)',
  },
};

export const ProductMockupSvg: React.FC<ProductMockupSvgProps> = ({
  mockupKey,
  colorHex,
  children,
}) => {
  const photo = PHOTO_MOCKUPS[mockupKey];

  if (photo) {
    const isTintable =
      mockupKey.startsWith('tshirt') ||
      mockupKey.startsWith('pillow') ||
      mockupKey.startsWith('hoodie') ||
      mockupKey.startsWith('tote');
    const isCustomColor = Boolean(
      colorHex &&
        colorHex.toLowerCase() !== '#ffffff' &&
        colorHex.toLowerCase() !== '#f5f0e8' &&
        colorHex.toLowerCase() !== '#f8fafc'
    );

    return (
      <div className="relative w-full h-full flex items-center justify-center select-none">
        {/* Real Photographic Studio Mockup Image */}
        <img
          src={photo.image}
          alt={photo.alt}
          className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.18)] select-none pointer-events-none mix-blend-multiply"
          draggable={false}
        />

        {/* Dynamic Color Tint overlay preserving textures & fabric folds */}
        {isTintable && isCustomColor && (
          <div
            className="absolute inset-0 pointer-events-none mix-blend-multiply transition-colors duration-300"
            style={{
              backgroundColor: colorHex,
              opacity:
                colorHex === '#18181b' || colorHex === '#1e293b' || colorHex === '#27272a' ? 0.88 : 0.65,
              maskImage: `url(${photo.image})`,
              WebkitMaskImage: `url(${photo.image})`,
              maskSize: 'contain',
              WebkitMaskSize: 'contain',
              maskPosition: 'center',
              WebkitMaskPosition: 'center',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
            }}
          />
        )}

        {children}
      </div>
    );
  }

  // Render realistic vector mockups based on mockupKey
  switch (mockupKey) {
    case 'tshirt-front':
      return (
        <svg viewBox="0 0 600 700" className="w-full h-full select-none" fill="none">
          <defs>
            <filter id="fabric-shadow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="12" stdDeviation="16" floodOpacity="0.12" />
            </filter>
            <linearGradient id="tshirt-shading-front" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
              <stop offset="45%" stopColor="#000000" stopOpacity="0.03" />
              <stop offset="85%" stopColor="#000000" stopOpacity="0.22" />
            </linearGradient>
            <linearGradient id="fold-left" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="fold-right" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Main T-Shirt Body Shape */}
          <g filter="url(#fabric-shadow)">
            <path
              d="M 230 85 
                 C 255 115, 345 115, 370 85 
                 L 460 120 
                 L 535 240 
                 L 465 285 
                 L 440 230 
                 L 445 610 
                 C 445 625, 435 635, 415 635 
                 L 185 635 
                 C 165 635, 155 625, 155 610 
                 L 160 230 
                 L 135 285 
                 L 65 240 
                 L 140 120 
                 Z"
              fill={colorHex}
              stroke="#000000"
              strokeOpacity="0.1"
              strokeWidth="1.5"
            />
          </g>

          {/* Shading overlay */}
          <path
            d="M 230 85 C 255 115, 345 115, 370 85 L 460 120 L 535 240 L 465 285 L 440 230 L 445 610 C 445 625, 435 635, 415 635 L 185 635 C 165 635, 155 625, 155 610 L 160 230 L 135 285 L 65 240 L 140 120 Z"
            fill="url(#tshirt-shading-front)"
          />

          {/* Side Folds */}
          <path d="M 160 230 L 165 620 L 195 620 L 185 240 Z" fill="url(#fold-left)" opacity="0.6" />
          <path d="M 440 230 L 435 620 L 405 620 L 415 240 Z" fill="url(#fold-right)" opacity="0.6" />

          {/* Collar Ribbing */}
          <path
            d="M 230 85 C 265 130, 335 130, 370 85 C 345 105, 255 105, 230 85 Z"
            fill="none"
            stroke="#000000"
            strokeOpacity="0.25"
            strokeWidth="3.5"
          />
          <path
            d="M 233 87 C 265 125, 335 125, 367 87"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.35"
            strokeWidth="1.5"
          />

          {/* Sleeve Stitch lines */}
          <path d="M 465 285 L 440 230" stroke="#000000" strokeOpacity="0.18" strokeWidth="1.5" strokeDasharray="3 2" />
          <path d="M 135 285 L 160 230" stroke="#000000" strokeOpacity="0.18" strokeWidth="1.5" strokeDasharray="3 2" />

          {/* Bottom Hem */}
          <path d="M 160 622 L 440 622" stroke="#000000" strokeOpacity="0.15" strokeWidth="1.5" strokeDasharray="4 2" />

          {/* Children: Print Area & Artwork elements */}
          {children}
        </svg>
      );

    case 'tshirt-back':
      return (
        <svg viewBox="0 0 600 700" className="w-full h-full select-none" fill="none">
          <defs>
            <filter id="fabric-shadow-back" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="12" stdDeviation="16" floodOpacity="0.12" />
            </filter>
            <linearGradient id="tshirt-shading-back" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
              <stop offset="50%" stopColor="#000000" stopOpacity="0.04" />
              <stop offset="90%" stopColor="#000000" stopOpacity="0.25" />
            </linearGradient>
          </defs>

          {/* Back T-Shirt Body Shape */}
          <g filter="url(#fabric-shadow-back)">
            <path
              d="M 230 85 
                 C 270 95, 330 95, 370 85 
                 L 460 120 
                 L 535 240 
                 L 465 285 
                 L 440 230 
                 L 445 610 
                 C 445 625, 435 635, 415 635 
                 L 185 635 
                 C 165 635, 155 625, 155 610 
                 L 160 230 
                 L 135 285 
                 L 65 240 
                 L 140 120 
                 Z"
              fill={colorHex}
              stroke="#000000"
              strokeOpacity="0.1"
              strokeWidth="1.5"
            />
          </g>

          {/* Shading */}
          <path
            d="M 230 85 C 270 95, 330 95, 370 85 L 460 120 L 535 240 L 465 285 L 440 230 L 445 610 C 445 625, 435 635, 415 635 L 185 635 C 165 635, 155 625, 155 610 L 160 230 L 135 285 L 65 240 L 140 120 Z"
            fill="url(#tshirt-shading-back)"
          />

          {/* Back Collar Seam */}
          <path
            d="M 230 85 C 275 97, 325 97, 370 85"
            fill="none"
            stroke="#000000"
            strokeOpacity="0.25"
            strokeWidth="3"
          />

          {/* Subtle Shoulder Seams */}
          <path d="M 230 85 L 140 120" stroke="#000000" strokeOpacity="0.15" strokeWidth="2" strokeDasharray="3 2" />
          <path d="M 370 85 L 460 120" stroke="#000000" strokeOpacity="0.15" strokeWidth="2" strokeDasharray="3 2" />

          {/* Children */}
          {children}
        </svg>
      );

    case 'hoodie-front':
      return (
        <svg viewBox="0 0 600 700" className="w-full h-full select-none" fill="none">
          <defs>
            <filter id="hoodie-shadow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="14" stdDeviation="18" floodOpacity="0.16" />
            </filter>
            <linearGradient id="hoodie-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
              <stop offset="60%" stopColor="#000000" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
            </linearGradient>
          </defs>

          {/* Hoodie Body */}
          <g filter="url(#hoodie-shadow)">
            <path
              d="M 210 110 
                 L 140 135 
                 L 50 310 
                 L 115 345 
                 L 145 270 
                 L 140 620 
                 L 460 620 
                 L 455 270 
                 L 485 345 
                 L 550 310 
                 L 460 135 
                 L 390 110 
                 Z"
              fill={colorHex}
              stroke="#000000"
              strokeOpacity="0.1"
              strokeWidth="2"
            />
          </g>

          <path
            d="M 210 110 L 140 135 L 50 310 L 115 345 L 145 270 L 140 620 L 460 620 L 455 270 L 485 345 L 550 310 L 460 135 L 390 110 Z"
            fill="url(#hoodie-grad)"
          />

          {/* Thick Double Hood Layers */}
          <path
            d="M 200 115 C 215 50, 385 50, 400 115 C 360 170, 240 170, 200 115 Z"
            fill={colorHex}
            stroke="#000000"
            strokeOpacity="0.2"
            strokeWidth="2"
          />
          <path
            d="M 240 115 C 265 145, 335 145, 360 115 C 330 130, 270 130, 240 115 Z"
            fill="#000000"
            opacity="0.25"
          />

          {/* Kangaroo Pocket */}
          <path
            d="M 210 470 
               L 390 470 
               L 415 570 
               L 185 570 
               Z"
            fill={colorHex}
            stroke="#000000"
            strokeOpacity="0.2"
            strokeWidth="2"
          />
          <path d="M 210 470 L 185 570" stroke="#000000" strokeOpacity="0.3" strokeWidth="2.5" />
          <path d="M 390 470 L 415 570" stroke="#000000" strokeOpacity="0.3" strokeWidth="2.5" />

          {/* Ribbed Hem & Cuffs */}
          <rect x="140" y="590" width="320" height="30" fill="#000000" opacity="0.1" />
          <line x1="140" y1="590" x2="460" y2="590" stroke="#000000" strokeOpacity="0.2" strokeWidth="2" />

          {children}
        </svg>
      );

    case 'hoodie-back':
      return (
        <svg viewBox="0 0 600 700" className="w-full h-full select-none" fill="none">
          <defs>
            <filter id="hoodie-back-shadow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="14" stdDeviation="18" floodOpacity="0.16" />
            </filter>
            <linearGradient id="hoodie-back-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
              <stop offset="60%" stopColor="#000000" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
            </linearGradient>
          </defs>

          <g filter="url(#hoodie-back-shadow)">
            <path
              d="M 210 110 L 140 135 L 50 310 L 115 345 L 145 270 L 140 620 L 460 620 L 455 270 L 485 345 L 550 310 L 460 135 L 390 110 Z"
              fill={colorHex}
              stroke="#000000"
              strokeOpacity="0.1"
              strokeWidth="2"
            />
          </g>

          <path
            d="M 210 110 L 140 135 L 50 310 L 115 345 L 145 270 L 140 620 L 460 620 L 455 270 L 485 345 L 550 310 L 460 135 L 390 110 Z"
            fill="url(#hoodie-back-grad)"
          />

          {/* Hood Resting on Back */}
          <path
            d="M 200 95 C 240 50, 360 50, 400 95 C 380 180, 220 180, 200 95 Z"
            fill={colorHex}
            stroke="#000000"
            strokeOpacity="0.2"
            strokeWidth="2.5"
          />
          <path d="M 250 140 C 300 160, 350 140, 350 140" stroke="#000000" strokeOpacity="0.2" strokeWidth="2" />

          {/* Ribbed Bottom */}
          <rect x="140" y="590" width="320" height="30" fill="#000000" opacity="0.1" />

          {children}
        </svg>
      );

    case 'mug-front':
    case 'mug-back':
      return (
        <svg viewBox="0 0 600 600" className="w-full h-full select-none" fill="none">
          <defs>
            <filter id="mug-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="16" stdDeviation="20" floodOpacity="0.18" />
            </filter>
            <linearGradient id="mug-cylinder-gloss" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.25" />
              <stop offset="15%" stopColor="#ffffff" stopOpacity="0.35" />
              <stop offset="40%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="80%" stopColor="#000000" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          <g filter="url(#mug-shadow)">
            {/* Handle */}
            {mockupKey === 'mug-front' ? (
              <path
                d="M 430 180 C 540 180, 540 400, 430 400 L 430 350 C 490 350, 490 230, 430 230 Z"
                fill={colorHex}
                stroke="#000000"
                strokeOpacity="0.15"
                strokeWidth="2"
              />
            ) : (
              <path
                d="M 170 180 C 60 180, 60 400, 170 400 L 170 350 C 110 350, 110 230, 170 230 Z"
                fill={colorHex}
                stroke="#000000"
                strokeOpacity="0.15"
                strokeWidth="2"
              />
            )}

            {/* Mug Body */}
            <rect
              x="170"
              y="130"
              width="260"
              height="340"
              rx="12"
              fill={colorHex}
              stroke="#000000"
              strokeOpacity="0.15"
              strokeWidth="2"
            />
            {/* Cylinder 3D Top Rim Ellipse */}
            <ellipse cx="300" cy="130" rx="130" ry="24" fill={colorHex} stroke="#000000" strokeOpacity="0.15" strokeWidth="2" />
            {/* Inner Depth */}
            <ellipse cx="300" cy="130" rx="118" ry="18" fill="#18181b" opacity="0.35" />
            {/* Bottom Ellipse Rim */}
            <ellipse cx="300" cy="470" rx="130" ry="20" fill={colorHex} stroke="#000000" strokeOpacity="0.15" strokeWidth="2" />
          </g>

          {/* Ceramic Gloss Reflection */}
          <rect x="170" y="130" width="260" height="340" rx="12" fill="url(#mug-cylinder-gloss)" />

          {children}
        </svg>
      );

    case 'case-back':
      return (
        <svg viewBox="0 0 600 700" className="w-full h-full select-none" fill="none">
          <defs>
            <filter id="phone-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="16" stdDeviation="22" floodOpacity="0.2" />
            </filter>
            <linearGradient id="phone-case-bevel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Outer Protective Bezel */}
          <g filter="url(#phone-shadow)">
            <rect x="180" y="60" width="240" height="520" rx="42" fill="#18181b" />
            {/* Printable Sublimation Plate */}
            <rect
              x="192"
              y="72"
              width="216"
              height="496"
              rx="34"
              fill={colorHex}
              stroke="#000000"
              strokeOpacity="0.1"
              strokeWidth="1.5"
            />
          </g>

          {/* Gloss overlay */}
          <rect x="192" y="72" width="216" height="496" rx="34" fill="url(#phone-case-bevel)" />

          {/* Camera Bump */}
          <rect x="208" y="88" width="80" height="80" rx="20" fill="#09090b" stroke="#27272a" strokeWidth="2" />
          <circle cx="228" cy="108" r="14" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
          <circle cx="228" cy="148" r="14" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
          <circle cx="268" cy="128" r="14" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
          <circle cx="268" cy="98" r="4" fill="#e4e4e7" />

          {children}
        </svg>
      );

    case 'tote-front':
    case 'tote-back':
      return (
        <svg viewBox="0 0 600 700" className="w-full h-full select-none" fill="none">
          <defs>
            <filter id="tote-shadow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="14" stdDeviation="18" floodOpacity="0.15" />
            </filter>
            <linearGradient id="canvas-texture" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
              <stop offset="50%" stopColor="#000000" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Shoulder Straps */}
          <path
            d="M 230 250 C 230 60, 370 60, 370 250 L 340 250 C 340 100, 260 100, 260 250 Z"
            fill={colorHex}
            stroke="#000000"
            strokeOpacity="0.2"
            strokeWidth="2"
          />

          {/* Bag Body */}
          <g filter="url(#tote-shadow)">
            <rect
              x="150"
              y="240"
              width="300"
              height="380"
              rx="8"
              fill={colorHex}
              stroke="#000000"
              strokeOpacity="0.15"
              strokeWidth="2"
            />
          </g>

          {/* Shading */}
          <rect x="150" y="240" width="300" height="380" rx="8" fill="url(#canvas-texture)" />

          {/* Top Fold & Seam */}
          <line x1="150" y1="270" x2="450" y2="270" stroke="#000000" strokeOpacity="0.2" strokeWidth="2" strokeDasharray="5 3" />
          {/* Strap Box-X Stitches */}
          <rect x="225" y="248" width="30" height="30" fill="none" stroke="#000000" strokeOpacity="0.25" strokeWidth="1.5" />
          <line x1="225" y1="248" x2="255" y2="278" stroke="#000000" strokeOpacity="0.25" strokeWidth="1.5" />
          <line x1="225" y1="278" x2="255" y2="248" stroke="#000000" strokeOpacity="0.25" strokeWidth="1.5" />

          <rect x="345" y="248" width="30" height="30" fill="none" stroke="#000000" strokeOpacity="0.25" strokeWidth="1.5" />
          <line x1="345" y1="248" x2="375" y2="278" stroke="#000000" strokeOpacity="0.25" strokeWidth="1.5" />
          <line x1="345" y1="278" x2="375" y2="248" stroke="#000000" strokeOpacity="0.25" strokeWidth="1.5" />

          {children}
        </svg>
      );

    case 'pillow-front':
    case 'pillow-back':
      return (
        <svg viewBox="0 0 600 600" className="w-full h-full select-none" fill="none">
          <defs>
            <filter id="pillow-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="14" stdDeviation="18" floodOpacity="0.2" />
            </filter>
            <radialGradient id="pillow-shading" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#000000" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.28" />
            </radialGradient>
          </defs>

          {/* Plump Pillow Body */}
          <g filter="url(#pillow-shadow)">
            <path
              d="M 160 140 
                 C 210 110, 390 110, 440 140 
                 C 490 190, 490 410, 440 460 
                 C 390 490, 210 490, 160 460 
                 C 110 410, 110 190, 160 140 
                 Z"
              fill={colorHex}
              stroke="#000000"
              strokeOpacity="0.12"
              strokeWidth="2"
            />
          </g>

          {/* Plump cushion depth gradient */}
          <path
            d="M 160 140 C 210 110, 390 110, 440 140 C 490 190, 490 410, 440 460 C 390 490, 210 490, 160 460 C 110 410, 110 190, 160 140 Z"
            fill="url(#pillow-shading)"
          />

          {/* Pillow Corner Pinch Folds */}
          <path d="M 160 140 Q 200 180 230 200" stroke="#000000" strokeOpacity="0.15" strokeWidth="2" fill="none" />
          <path d="M 440 140 Q 400 180 370 200" stroke="#000000" strokeOpacity="0.15" strokeWidth="2" fill="none" />
          <path d="M 160 460 Q 200 420 230 400" stroke="#000000" strokeOpacity="0.15" strokeWidth="2" fill="none" />
          <path d="M 440 460 Q 400 420 370 400" stroke="#000000" strokeOpacity="0.15" strokeWidth="2" fill="none" />

          {/* Piped seam border */}
          <path
            d="M 160 140 C 210 110, 390 110, 440 140 C 490 190, 490 410, 440 460 C 390 490, 210 490, 160 460 C 110 410, 110 190, 160 140 Z"
            fill="none"
            stroke="#000000"
            strokeOpacity="0.15"
            strokeWidth="3"
            strokeDasharray="4 2"
          />

          {children}
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 600 700" className="w-full h-full select-none" fill="none">
          <rect x="150" y="100" width="300" height="500" rx="16" fill={colorHex} stroke="#000000" strokeOpacity="0.1" />
          {children}
        </svg>
      );
  }
};
