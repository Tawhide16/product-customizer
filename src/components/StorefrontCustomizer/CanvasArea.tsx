'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { DesignElement, Product, ProductSide, ProductColor, TextElement, ClipartElement, ImageElement, QRCodeElement, RosterElement } from '@/types/customizer';
import { ProductMockupSvg } from '@/components/Mockups/ProductMockupSvg';
import { ZoomIn, ZoomOut, Maximize2, Eye, EyeOff, RotateCw, Trash2, Copy, Move, AlertTriangle } from 'lucide-react';

interface CanvasAreaProps {
  product: Product;
  activeSide: ProductSide;
  activeColor: ProductColor;
  elements: DesignElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  showGuides: boolean;
  onToggleGuides: () => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  unit?: 'inch' | 'cm';
  onRotateSide?: (direction: 'next' | 'prev') => void;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  product,
  activeSide,
  activeColor,
  elements,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  showGuides,
  onToggleGuides,
  zoom,
  onZoomChange,
  onRotateSide,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const printAreaRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);

  // Interaction drag state
  const [dragState, setDragState] = useState<{
    type: 'move' | 'resize' | 'rotate' | null;
    elementId: string | null;
    startX: number;
    startY: number;
    startElX: number;
    startElY: number;
    startWidth: number;
    startHeight: number;
    startRotation: number;
    handle?: string;
  }>({
    type: null,
    elementId: null,
    startX: 0,
    startY: 0,
    startElX: 0,
    startElY: 0,
    startWidth: 0,
    startHeight: 0,
    startRotation: 0,
  });

  const selectedElement = elements.find((el) => el.id === selectedElementId && el.sideId === activeSide.id);

  // Check if any element exceeds the print area (x < 0, y < 0, x+w > 100, y+h > 100)
  const hasBoundaryOverflow = elements.some((el) => {
    if (el.sideId !== activeSide.id) return false;
    return el.x < -2 || el.y < -2 || el.x + el.width > 102 || el.y + el.height > 102;
  });

  // Start Move
  const handlePointerDownElement = (e: React.PointerEvent, el: DesignElement) => {
    if (el.isLocked) return;
    e.stopPropagation();
    isDraggingRef.current = false;
    onSelectElement(el.id);

    setDragState({
      type: 'move',
      elementId: el.id,
      startX: e.clientX,
      startY: e.clientY,
      startElX: el.x,
      startElY: el.y,
      startWidth: el.width,
      startHeight: el.height,
      startRotation: el.rotation,
    });
  };

  // Start Resize
  const handlePointerDownResize = (e: React.PointerEvent, handle: string, el: DesignElement) => {
    e.stopPropagation();
    setDragState({
      type: 'resize',
      elementId: el.id,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startElX: el.x,
      startElY: el.y,
      startWidth: el.width,
      startHeight: el.height,
      startRotation: el.rotation,
    });
  };

  // Start Rotate
  const handlePointerDownRotate = (e: React.PointerEvent, el: DesignElement) => {
    e.stopPropagation();
    setDragState({
      type: 'rotate',
      elementId: el.id,
      startX: e.clientX,
      startY: e.clientY,
      startElX: el.x,
      startElY: el.y,
      startWidth: el.width,
      startHeight: el.height,
      startRotation: el.rotation,
    });
  };

  // Pointer Move (Window level for smooth drag)
  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!dragState.type || !dragState.elementId || !printAreaRef.current) return;

      const printRect = printAreaRef.current.getBoundingClientRect();
      const currentElement = elements.find((el) => el.id === dragState.elementId);
      if (!currentElement) return;

      // Track whether the pointer has moved enough to be a drag gesture
      if (Math.abs(e.clientX - dragState.startX) > 3 || Math.abs(e.clientY - dragState.startY) > 3) {
        isDraggingRef.current = true;
      }

      // Delta in % relative to the print area box
      const deltaXPercent = ((e.clientX - dragState.startX) / printRect.width) * 100;
      const deltaYPercent = ((e.clientY - dragState.startY) / printRect.height) * 100;

      if (dragState.type === 'move') {
        const nextX = Math.round((dragState.startElX + deltaXPercent) * 10) / 10;
        const nextY = Math.round((dragState.startElY + deltaYPercent) * 10) / 10;
        onUpdateElement(dragState.elementId, { x: nextX, y: nextY });
      } else if (dragState.type === 'resize') {
        const aspectRatio = dragState.startWidth / (dragState.startHeight || 1);
        let newWidth = dragState.startWidth;
        let newHeight = dragState.startHeight;
        let newX = dragState.startElX;
        let newY = dragState.startElY;

        if (dragState.handle === 'se') {
          newWidth = Math.max(8, dragState.startWidth + deltaXPercent);
          newHeight = newWidth / aspectRatio;
        } else if (dragState.handle === 'sw') {
          const w = Math.max(8, dragState.startWidth - deltaXPercent);
          newX = dragState.startElX + (dragState.startWidth - w);
          newWidth = w;
          newHeight = newWidth / aspectRatio;
        } else if (dragState.handle === 'ne') {
          newWidth = Math.max(8, dragState.startWidth + deltaXPercent);
          newHeight = newWidth / aspectRatio;
          newY = dragState.startElY - (newHeight - dragState.startHeight);
        } else if (dragState.handle === 'nw') {
          const w = Math.max(8, dragState.startWidth - deltaXPercent);
          newX = dragState.startElX + (dragState.startWidth - w);
          newWidth = w;
          newHeight = newWidth / aspectRatio;
          newY = dragState.startElY - (newHeight - dragState.startHeight);
        }

        onUpdateElement(dragState.elementId, {
          x: Math.round(newX * 10) / 10,
          y: Math.round(newY * 10) / 10,
          width: Math.round(newWidth * 10) / 10,
          height: Math.round(newHeight * 10) / 10,
        });
      } else if (dragState.type === 'rotate') {
        const elCenterX = printRect.left + ((dragState.startElX + dragState.startWidth / 2) / 100) * printRect.width;
        const elCenterY = printRect.top + ((dragState.startElY + dragState.startHeight / 2) / 100) * printRect.height;
        const rad = Math.atan2(e.clientY - elCenterY, e.clientX - elCenterX);
        let deg = Math.round((rad * 180) / Math.PI) + 90; // offset so top handle is 0
        if (deg < 0) deg += 360;
        // Snap to 0, 90, 180, 270 if close
        if (Math.abs(deg % 90) < 3 || Math.abs((deg % 90) - 90) < 3) {
          deg = Math.round(deg / 90) * 90;
        }
        onUpdateElement(dragState.elementId, { rotation: deg % 360 });
      }
    },
    [dragState, elements, onUpdateElement]
  );

  const handlePointerUp = useCallback(() => {
    if (dragState.type) {
      setDragState({
        type: null,
        elementId: null,
        startX: 0,
        startY: 0,
        startElX: 0,
        startElY: 0,
        startWidth: 0,
        startHeight: 0,
        startRotation: 0,
      });
      // Allow click event to finish before clearing drag flag
      setTimeout(() => {
        isDraggingRef.current = false;
      }, 50);
    }
  }, [dragState.type]);

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  // Click on background deselects (only if clicked outside any element or control)
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (isDraggingRef.current) return;

    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Never deselect if clicked on a design element, transform handle, or button
    if (
      target.closest('[data-canvas-element]') ||
      target.closest('[data-element-control]') ||
      target.closest('button')
    ) {
      return;
    }

    onSelectElement(null);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleCanvasClick}
      className="relative flex-1 h-full min-h-[500px] flex items-center justify-center bg-gradient-to-b from-[#f8f9fb] via-[#f2f4f8] to-[#e7ebf2] overflow-hidden select-none"
    >
      {/* Background Soft Studio Ambient Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Overflow Safety Warning Bar */}
      {hasBoundaryOverflow && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-amber-500 text-zinc-950 font-bold px-4 py-1.5 rounded-full shadow-xl text-xs animate-pulse">
          <AlertTriangle className="w-4 h-4 text-zinc-950" />
          <span>Notice: One or more design elements exceed the print safe boundary!</span>
        </div>
      )}

      {/* Side Rotation Controls (Reference 1 & Reference 2 style curved arrows) */}
      {onRotateSide && (
        <>
          <button
            onClick={() => onRotateSide('prev')}
            title="Turn Product View (Previous Side)"
            className="absolute left-6 top-1/2 -translate-y-1/2 z-30 flex items-center gap-2 px-3 py-2 rounded-full bg-white/90 hover:bg-white text-zinc-800 border border-zinc-200/80 shadow-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer text-xs font-bold group"
          >
            <span className="text-base group-hover:-translate-x-0.5 transition-transform">⤹</span>
            <span className="hidden sm:inline">Rotate</span>
          </button>

          <button
            onClick={() => onRotateSide('next')}
            title="Turn Product View (Next Side)"
            className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex items-center gap-2 px-3 py-2 rounded-full bg-white/90 hover:bg-white text-zinc-800 border border-zinc-200/80 shadow-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer text-xs font-bold group"
          >
            <span className="hidden sm:inline">Rotate</span>
            <span className="text-base group-hover:translate-x-0.5 transition-transform">⤸</span>
          </button>
        </>
      )}

      {/* Floating Canvas Action Controls (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-30 flex items-center gap-1.5 bg-white/90 backdrop-blur-xl px-2.5 py-1.5 rounded-full border border-white/80 shadow-[0_8px_25px_rgba(0,0,0,0.08)]">
        <button
          onClick={() => onZoomChange(Math.max(0.6, zoom - 0.15))}
          title="Zoom out"
          className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-700 transition cursor-pointer"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <span className="text-[11px] font-bold text-zinc-700 px-1 w-9 text-center font-mono">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => onZoomChange(Math.min(1.6, zoom + 0.15))}
          title="Zoom in"
          className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-700 transition cursor-pointer"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <div className="w-[1px] h-3.5 bg-zinc-200 mx-1" />
        <button
          onClick={() => onZoomChange(1.0)}
          title="Reset Zoom"
          className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-700 transition cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onToggleGuides}
          title={showGuides ? 'Hide Printable Area Guides' : 'Show Printable Area Guides'}
          className={`p-1.5 rounded-full transition cursor-pointer ${
            showGuides ? 'bg-zinc-900 text-amber-300 shadow-xs' : 'hover:bg-zinc-100 text-zinc-600'
          }`}
        >
          {showGuides ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Active Side & Dimension Watermark Pill (Top Left) */}
      <div className="absolute top-5 left-6 z-20 flex items-center gap-2">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/90 border border-white/90 shadow-md backdrop-blur-md text-zinc-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {product.name} • {activeSide.name}
        </span>
        <span className="text-[11px] text-zinc-500 font-semibold bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-zinc-200/50 shadow-xs hidden md:inline-block">
          {activeSide.printArea.physicalWidthInches}&quot; × {activeSide.printArea.physicalHeightInches}&quot; ({activeSide.printArea.dpi} DPI Print Specs)
        </span>
      </div>

      {/* 3D Turntable Podium (Reference 2 style round turntable platform) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center z-0">
        {/* Turntable Top Disk */}
        <div className="w-[360px] sm:w-[420px] h-[58px] rounded-[50%] bg-gradient-to-b from-white via-zinc-100 to-zinc-200 border-2 border-white shadow-[0_15px_35px_rgba(0,0,0,0.12)] flex items-center justify-center relative">
          <div className="w-[320px] sm:w-[380px] h-[44px] rounded-[50%] border border-zinc-300/60 bg-gradient-to-b from-zinc-50/50 to-zinc-100/50" />
        </div>
        {/* Turntable Base Bevel */}
        <div className="w-[380px] sm:w-[440px] h-[16px] -mt-[24px] rounded-[50%] bg-gradient-to-b from-zinc-300 to-zinc-400 opacity-60 shadow-lg blur-[1px]" />
        {/* 360 Rotation Arc Badge */}
        <div className="mt-2 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/80 border border-zinc-200/80 text-[10px] font-bold text-zinc-600 shadow-xs">
          <span>⤾ 360° ⤿</span>
        </div>
      </div>

      {/* Zoomable Stage Container */}
      <div
        className="canvas-backdrop relative flex items-center justify-center transition-transform duration-100 ease-out z-10"
        style={{
          transform: `scale(${zoom})`,
          width: '560px',
          height: '630px',
        }}
      >
        {/* Photorealistic Product Mockup SVG */}
        <div className="absolute inset-0 pointer-events-none filter drop-shadow-[0_25px_30px_rgba(0,0,0,0.18)]">
          <ProductMockupSvg mockupKey={activeSide.mockupSvg} colorHex={activeColor.hex} sideId={activeSide.id} />
        </div>

        {/* Defined Print Area Container */}
        <div
          ref={printAreaRef}
          className={`absolute transition-colors ${
            showGuides
              ? hasBoundaryOverflow
                ? 'border-2 border-dashed border-red-500 bg-red-500/[0.04]'
                : 'border-2 border-dashed border-sky-500/80 bg-sky-500/[0.03]'
              : 'border border-transparent'
          }`}
          style={{
            left: `${activeSide.printArea.x}%`,
            top: `${activeSide.printArea.y}%`,
            width: `${activeSide.printArea.width}%`,
            height: `${activeSide.printArea.height}%`,
          }}
        >
          {/* Printable Boundary Label Tag */}
          {showGuides && (
            <div className="absolute -top-6 left-0 flex items-center gap-1 bg-zinc-900 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-t shadow-sm tracking-wider uppercase">
              <span>{activeSide.printArea.name}</span>
            </div>
          )}

          {/* Render Elements inside this print area */}
          {elements
            .filter((el) => el.sideId === activeSide.id && el.isVisible !== false)
            .sort((a, b) => a.zIndex - b.zIndex)
            .map((el) => {
              const isSelected = el.id === selectedElementId;

              return (
                <div
                  key={el.id}
                  data-canvas-element="true"
                  onPointerDown={(e) => handlePointerDownElement(e, el)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectElement(el.id);
                  }}
                  className={`absolute group cursor-move select-none touch-none ${
                    isSelected ? 'z-50' : ''
                  }`}
                  style={{
                    left: `${el.x}%`,
                    top: `${el.y}%`,
                    width: `${el.width}%`,
                    height: el.height ? `${el.height}%` : 'auto',
                    transform: `rotate(${el.rotation}deg)`,
                    transformOrigin: 'center center',
                    opacity: el.opacity ?? 1,
                    zIndex: isSelected ? 50 : (el.zIndex ?? 1),
                  }}
                >
                  {/* Element Content Render */}
                  <div className="w-full h-full relative pointer-events-auto">
                    {el.type === 'text' && <RenderTextElement element={el} />}
                    {el.type === 'clipart' && <RenderClipartElement element={el} />}
                    {el.type === 'image' && <RenderImageElement element={el} />}
                    {el.type === 'qrcode' && <RenderQRCodeElement element={el} />}
                    {el.type === 'roster' && <RenderRosterElement element={el} />}
                  </div>

                  {/* Selected Element Bounding Box & Transform Handles */}
                  {isSelected && !el.isLocked && (
                    <>
                      {/* Active Boundary Outline */}
                      <div className="absolute inset-0 border-2 border-emerald-500 pointer-events-none rounded-[1px] shadow-sm" />

                      {/* Rotation Handle on Top */}
                      <div
                        data-element-control="true"
                        onPointerDown={(e) => handlePointerDownRotate(e, el)}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute -top-7 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-2 border-emerald-600 shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
                        title="Rotate element"
                      >
                        <RotateCw className="w-2.5 h-2.5 text-emerald-700" />
                      </div>
                      {/* Stem connecting top border to rotation handle */}
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-[1.5px] h-4 bg-emerald-600 pointer-events-none" />

                      {/* 4 Corner Resize Handles */}
                      <div
                        data-element-control="true"
                        onPointerDown={(e) => handlePointerDownResize(e, 'nw', el)}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-emerald-600 rounded-sm shadow-sm cursor-nwse-resize hover:scale-125 transition-transform"
                      />
                      <div
                        data-element-control="true"
                        onPointerDown={(e) => handlePointerDownResize(e, 'ne', el)}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-emerald-600 rounded-sm shadow-sm cursor-nesw-resize hover:scale-125 transition-transform"
                      />
                      <div
                        data-element-control="true"
                        onPointerDown={(e) => handlePointerDownResize(e, 'se', el)}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-emerald-600 rounded-sm shadow-sm cursor-nwse-resize hover:scale-125 transition-transform"
                      />
                      <div
                        data-element-control="true"
                        onPointerDown={(e) => handlePointerDownResize(e, 'sw', el)}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-emerald-600 rounded-sm shadow-sm cursor-nesw-resize hover:scale-125 transition-transform"
                      />

                      {/* Quick Action Floating Bar above Element */}
                      <div
                        data-element-control="true"
                        className="absolute -bottom-9 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-zinc-900/90 text-white rounded-md px-1.5 py-1 shadow-xl z-50 text-[11px]"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => onDuplicateElement(el.id)}
                          className="p-1 hover:bg-zinc-700 rounded transition"
                          title="Duplicate element"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <div className="w-[1px] h-3 bg-zinc-700" />
                        <button
                          onClick={() => onDeleteElement(el.id)}
                          className="p-1 hover:bg-red-600 rounded transition text-red-300 hover:text-white"
                          title="Delete element"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

// Renderers for Text, Clipart, Image, QRCode, and Roster
const RenderTextElement: React.FC<{ element: TextElement }> = ({ element }) => {
  const {
    text,
    fontFamily,
    fontSize,
    fill,
    textAlign,
    isBold,
    isItalic,
    isUnderline,
    isCurved,
    curveRadius,
    strokeColor,
    strokeWidth,
    shadowColor,
    shadowBlur,
    letterSpacing,
  } = element;

  if (isCurved) {
    const pathId = `curve-path-${element.id}`;
    const radius = Math.abs(curveRadius) || 50;
    const isDownward = curveRadius < 0;
    const pathD = isDownward
      ? `M 10,70 Q 150,${70 - radius} 290,70`
      : `M 10,30 Q 150,${30 + radius} 290,30`;

    return (
      <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible select-none">
        <path id={pathId} d={pathD} fill="none" />
        <text
          fill={fill}
          fontSize={fontSize * 2.2}
          fontFamily={fontFamily}
          fontWeight={isBold ? 'bold' : 'normal'}
          fontStyle={isItalic ? 'italic' : 'normal'}
          textDecoration={isUnderline ? 'underline' : 'none'}
          letterSpacing={letterSpacing || 0}
          stroke={strokeColor || 'none'}
          strokeWidth={strokeWidth ? strokeWidth * 0.5 : 0}
          style={{
            filter: shadowColor ? `drop-shadow(2px 2px ${shadowBlur || 2}px ${shadowColor})` : undefined,
          }}
        >
          <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
            {text}
          </textPath>
        </text>
      </svg>
    );
  }

  return (
    <div
      style={{
        fontFamily,
        fontSize: `${fontSize}px`,
        color: fill,
        textAlign,
        fontWeight: isBold ? 700 : 400,
        fontStyle: isItalic ? 'italic' : 'normal',
        textDecoration: isUnderline ? 'underline' : 'none',
        letterSpacing: letterSpacing ? `${letterSpacing}px` : 'normal',
        WebkitTextStroke: strokeWidth && strokeColor ? `${strokeWidth}px ${strokeColor}` : undefined,
        textShadow: shadowColor ? `2px 2px ${shadowBlur || 3}px ${shadowColor}` : undefined,
        lineHeight: 1.15,
        wordBreak: 'break-word',
      }}
      className="w-full select-none"
    >
      {text}
    </div>
  );
};

const RenderClipartElement: React.FC<{ element: ClipartElement }> = ({ element }) => {
  const svgWithColor = element.svgContent.replace(/currentColor/g, element.fill || '#000000');
  return (
    <div
      className="w-full h-full flex items-center justify-center select-none"
      dangerouslySetInnerHTML={{ __html: svgWithColor }}
    />
  );
};

const RenderImageElement: React.FC<{ element: ImageElement }> = ({ element }) => {
  let filterStyle = 'none';
  if (element.filter === 'grayscale') filterStyle = 'grayscale(100%)';
  if (element.filter === 'sepia') filterStyle = 'sepia(100%)';
  if (element.filter === 'invert') filterStyle = 'invert(100%)';

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={element.src}
      alt={element.originalFileName || 'Uploaded Design'}
      className="w-full h-full object-contain pointer-events-none select-none"
      style={{ filter: filterStyle }}
    />
  );
};

const RenderQRCodeElement: React.FC<{ element: QRCodeElement }> = ({ element }) => {
  return (
    <div
      className="w-full h-full flex items-center justify-center select-none pointer-events-none"
      dangerouslySetInnerHTML={{ __html: element.qrSvg }}
    />
  );
};

const RenderRosterElement: React.FC<{ element: RosterElement }> = ({ element }) => {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center select-none"
      style={{
        fontFamily: element.fontFamily || "'Bebas Neue', sans-serif",
        color: element.fill || '#ffffff',
      }}
    >
      <div className="text-sm font-bold tracking-widest uppercase">
        {element.sampleName}
      </div>
      <div className="text-4xl font-black font-mono tracking-tight leading-none">
        {element.sampleNumber}
      </div>
    </div>
  );
};
