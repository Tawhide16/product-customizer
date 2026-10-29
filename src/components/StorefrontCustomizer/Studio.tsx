'use client';

import React, { useState, useRef } from 'react';
import {
  Product,
  ProductColor,
  DesignElement,
  PricingSettings,
  TextElement,
  ClipartElement,
  ImageElement,
  QRCodeElement,
  RosterElement,
  RosterPlayer,
} from '@/types/customizer';
import { CanvasArea } from './CanvasArea';
import { TextControls } from './TextControls';
import { ClipartControls } from './ClipartControls';
import { UploadControls } from './UploadControls';
import { QRCodeControls } from './QRCodeControls';
import { RosterControls } from './RosterControls';
import { TemplatesControls, TEMPLATES_DATA } from './TemplatesControls';
import { LayersModal } from './LayersModal';
import { ProductChangeModal } from './ProductChangeModal';
import { EditColorModal } from './EditColorModal';
import { OrderNotesModal } from './OrderNotesModal';
import { SizeAndCartModal } from './SizeAndCartModal';
import { RealisticPreviewModal } from './RealisticPreviewModal';
import { CartDrawer } from './CartDrawer';
import { ProductMockupSvg } from '@/components/Mockups/ProductMockupSvg';
import { CLIPART_ITEMS, CLIPART_CATEGORIES, ClipartItem } from '@/data/clipart';
import {
  Type,
  Shapes,
  QrCode,
  Upload,
  Users,
  LayoutTemplate,
  Save,
  FileText,
  Undo2,
  Redo2,
  ZoomIn,
  Eye,
  Ruler,
  Layers,
  Download,
  Share2,
  CheckCircle,
  Shirt,
  X,
  Search,
  ChevronDown,
  Heart,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Image as ImageIcon,
  Plus,
  Trash2,
  Copy,
  AlignHorizontalJustifyCenter,
  AlignVerticalJustifyCenter,
} from 'lucide-react';

interface StudioProps {
  products: Product[];
  initialPricingSettings: PricingSettings;
  onSaveOrderRecord?: (orderData: unknown) => void;
}

type ToolType = 'text' | 'clipart' | 'qrcode' | 'upload' | 'roster' | 'templates';
type RightPanelTab = 'catalog' | 'content' | 'images' | 'assets';

// Curated typography presets for the Right Sidebar "Content" tab
const CURATED_SLOGANS = [
  { text: 'ORIGIN STUDIO', font: "'Bebas Neue', sans-serif", letterSpacing: 3, style: 'Streetwear Bold' },
  { text: 'LIMITED EDITION', font: "'Oswald', sans-serif", letterSpacing: 4, style: 'Varsity Athletics' },
  { text: 'VINTAGE 1994', font: "'Playfair Display', serif", letterSpacing: 1, style: 'Heritage Classic' },
  { text: 'CREATIVE SOUL', font: "'Pacifico', cursive", letterSpacing: 0, style: 'Handwritten Script' },
  { text: 'URBAN RUNWAY', font: "'Montserrat', sans-serif", letterSpacing: 2, style: 'Modern Editorial' },
  { text: 'AUTHENTIC MERCH', font: "'Bebas Neue', sans-serif", letterSpacing: 2, style: 'Industrial Label' },
];

// Curated stock artworks for the Right Sidebar "Images" tab
const CURATED_ARTWORK = [
  {
    name: 'Cyber Tiger Crest',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
    tag: 'Street Art',
    width: 600,
    height: 600,
  },
  {
    name: 'Golden Solar Emblem',
    url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&auto=format&fit=crop&q=80',
    tag: 'Abstract',
    width: 600,
    height: 600,
  },
  {
    name: 'Cosmic Astronaut',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    tag: 'Graphic',
    width: 600,
    height: 600,
  },
  {
    name: 'Botanical Heritage',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    tag: 'Fine Art',
    width: 600,
    height: 600,
  },
];

export const Studio: React.FC<StudioProps> = ({
  products,
  initialPricingSettings,
  onSaveOrderRecord,
}) => {
  // Current active product & configuration (defaulting to the Premium T-Shirt)
  const defaultProduct = products.find((p) => p.id === 'prod-tshirt-crewneck') || products[0];
  const [selectedProductId, setSelectedProductId] = useState<string>(defaultProduct.id);
  const currentProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const [selectedColor, setSelectedColor] = useState<ProductColor>(currentProduct.colors[0]);
  const [activeSideId, setActiveSideId] = useState<string>(currentProduct.sides[0].id);
  const activeSide = currentProduct.sides.find((s) => s.id === activeSideId) || currentProduct.sides[0];

  // Left Tool Panel state
  const [activeTool, setActiveTool] = useState<ToolType | null>('text');

  // Right Panel navigation state: 'catalog' | 'content' | 'images' | 'assets'
  const [rightPanelTab, setRightPanelTab] = useState<RightPanelTab>('catalog');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Apparel' | 'Accessories' | 'Bags' | 'Home'>('All');
  const [wishlist, setWishlist] = useState<string[]>(['prod-tshirt-crewneck']);

  // Content tab state
  const [quickText, setQuickText] = useState('');

  // Assets tab state
  const [assetCategoryFilter, setAssetCategoryFilter] = useState('All');
  const [assetSearchQuery, setAssetSearchQuery] = useState('');

  // Hidden file input for right-sidebar image uploads
  const rightUploadInputRef = useRef<HTMLInputElement>(null);

  // Canvas View state
  const [zoom, setZoom] = useState<number>(1.0);
  const [showGuides, setShowGuides] = useState<boolean>(true);
  const [unitSystem, setUnitSystem] = useState<'inch' | 'cm'>('cm');

  // Order state
  const [orderNote, setOrderNote] = useState<string>('');
  const [totalQuantity, setTotalQuantity] = useState<number>(1);
  const [sizeQuantities, setSizeQuantities] = useState<{ [size: string]: number }>({
    [currentProduct.sizes[0]]: 1,
  });

  // Modals state
  const [isSizeCartOpen, setIsSizeCartOpen] = useState(false);
  const [isProductChangeOpen, setIsProductChangeOpen] = useState(false);
  const [isEditColorOpen, setIsEditColorOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isLayersModalOpen, setIsLayersModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    materials: true,
    turnaround: false,
    notes: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleRotateSide = (direction: 'next' | 'prev') => {
    const currentIndex = currentProduct.sides.findIndex((s) => s.id === activeSideId);
    const total = currentProduct.sides.length;
    const targetIndex = direction === 'next' ? (currentIndex + 1) % total : (currentIndex - 1 + total) % total;
    setActiveSideId(currentProduct.sides[targetIndex].id);
    setSelectedElementId(null);
    showToast(`Switched view to ${currentProduct.sides[targetIndex].name}`);
  };

  // Initial starter elements
  const [elements, setElements] = useState<DesignElement[]>([
    {
      id: 'init-text-1',
      sideId: currentProduct.sides[0].id,
      type: 'text',
      text: 'INKYBAY STUDIO',
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: 36,
      fill: '#18181b',
      textAlign: 'center',
      x: 15,
      y: 26,
      width: 70,
      height: 28,
      rotation: 0,
      zIndex: 1,
      opacity: 1,
      isBold: true,
      isItalic: false,
      isUnderline: false,
      isCurved: false,
      curveRadius: 0,
      letterSpacing: 2,
    },
    {
      id: 'init-clipart-1',
      sideId: currentProduct.sides[0].id,
      type: 'clipart',
      name: 'Four-Point Chrome Star',
      category: 'Streetwear & Y2K',
      svgContent: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 5 Q50 45 95 50 Q50 50 50 95 Q50 50 5 50 Q50 45 50 5 Z"/></svg>`,
      fill: '#0284c7',
      x: 35,
      y: 48,
      width: 30,
      height: 30,
      rotation: 0,
      zIndex: 2,
      opacity: 1,
    },
  ]);

  const [history, setHistory] = useState<DesignElement[][]>([elements]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>('init-text-1');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const pushHistory = (newElements: DesignElement[]) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newElements);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setElements(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setElements(next);
    }
  };

  // Product Switch
  const handleProductSelect = (newProd: Product) => {
    setSelectedProductId(newProd.id);
    setSelectedColor(newProd.colors[0]);
    setActiveSideId(newProd.sides[0].id);
    setSizeQuantities({ [newProd.sizes[0]]: 1 });
    setSelectedElementId(null);
    showToast(`Product changed to ${newProd.name}`);
  };

  // Element actions
  const handleUpdateElement = (id: string, updates: Partial<DesignElement>) => {
    setElements((prev) => {
      const next = prev.map((el) => (el.id === id ? ({ ...el, ...updates } as DesignElement) : el));
      pushHistory(next);
      return next;
    });
  };

  const handleDeleteElement = (id: string) => {
    setElements((prev) => {
      const next = prev.filter((el) => el.id !== id);
      pushHistory(next);
      return next;
    });
    if (selectedElementId === id) setSelectedElementId(null);
  };

  const handleDuplicateElement = (id: string) => {
    const target = elements.find((el) => el.id === id);
    if (!target) return;
    const duplicated: DesignElement = {
      ...target,
      id: `el-${Date.now()}`,
      x: Math.min(80, target.x + 5),
      y: Math.min(80, target.y + 5),
      zIndex: elements.length + 1,
    };
    const next = [...elements, duplicated];
    setElements(next);
    pushHistory(next);
    setSelectedElementId(duplicated.id);
  };

  const handleSelectAll = () => {
    const sideEls = elements.filter((el) => el.sideId === activeSide.id);
    if (sideEls.length > 0) {
      setSelectedElementId(sideEls[0].id);
      showToast(`Selected ${sideEls.length} elements on this side.`);
    }
  };

  const handleClearAll = () => {
    if (confirm('Clear all design elements from this side?')) {
      const next = elements.filter((el) => el.sideId !== activeSide.id);
      setElements(next);
      pushHistory(next);
      setSelectedElementId(null);
      showToast('Canvas cleared.');
    }
  };

  const handleSelectElement = (id: string | null) => {
    setSelectedElementId(id);
    if (id) {
      const el = elements.find((e) => e.id === id);
      if (el) {
        if (el.type === 'text') setActiveTool('text');
        else if (el.type === 'clipart') setActiveTool('clipart');
        else if (el.type === 'image') setActiveTool('upload');
        else if (el.type === 'qrcode') setActiveTool('qrcode');
        else if (el.type === 'roster') setActiveTool('roster');
      }
    }
  };

  // Add Element Handlers
  const handleAddText = (text: string, fontFamily: string = "'Bebas Neue', sans-serif", fill: string = '#18181b') => {
    const newEl: TextElement = {
      id: `text-${Date.now()}`,
      sideId: activeSide.id,
      type: 'text',
      text: text || 'CUSTOM TEXT',
      fontFamily,
      fontSize: 36,
      fill,
      textAlign: 'center',
      x: 20,
      y: 35,
      width: 60,
      height: 28,
      rotation: 0,
      zIndex: elements.length + 1,
      opacity: 1,
      isBold: true,
      isItalic: false,
      isUnderline: false,
      isCurved: false,
      curveRadius: 0,
      letterSpacing: 2,
    };
    const next = [...elements, newEl];
    setElements(next);
    pushHistory(next);
    setSelectedElementId(newEl.id);
    showToast('Text element added to canvas!');
  };

  const handleAddClipart = (item: ClipartItem, fill?: string) => {
    const newEl: ClipartElement = {
      id: `clipart-${Date.now()}`,
      sideId: activeSide.id,
      type: 'clipart',
      name: item.name,
      category: item.category,
      svgContent: item.svg,
      fill: fill || '#18181b',
      x: 30,
      y: 30,
      width: 40,
      height: 40,
      rotation: 0,
      zIndex: elements.length + 1,
      opacity: 1,
    };
    const next = [...elements, newEl];
    setElements(next);
    pushHistory(next);
    setSelectedElementId(newEl.id);
    showToast(`Added graphic: ${item.name}`);
  };

  const handleAddImage = (imgData: {
    src: string;
    originalFileName: string;
    naturalWidth: number;
    naturalHeight: number;
    dpiRating: 'good' | 'medium' | 'low';
  }) => {
    const aspect = imgData.naturalWidth / imgData.naturalHeight;
    const width = 45;
    const height = width / aspect;

    const newEl: ImageElement = {
      id: `img-${Date.now()}`,
      sideId: activeSide.id,
      type: 'image',
      src: imgData.src,
      originalFileName: imgData.originalFileName,
      naturalWidth: imgData.naturalWidth,
      naturalHeight: imgData.naturalHeight,
      dpiRating: imgData.dpiRating,
      x: 27.5,
      y: 25,
      width,
      height,
      rotation: 0,
      zIndex: elements.length + 1,
      opacity: 1,
    };
    const next = [...elements, newEl];
    setElements(next);
    pushHistory(next);
    setSelectedElementId(newEl.id);
    showToast('Customer artwork placed on canvas!');
  };

  const handleAddQRCode = (url: string, qrSvg: string, fill: string) => {
    const newEl: QRCodeElement = {
      id: `qr-${Date.now()}`,
      sideId: activeSide.id,
      type: 'qrcode',
      url,
      qrSvg,
      fill,
      x: 35,
      y: 35,
      width: 30,
      height: 30,
      rotation: 0,
      zIndex: elements.length + 1,
      opacity: 1,
    };
    const next = [...elements, newEl];
    setElements(next);
    pushHistory(next);
    setSelectedElementId(newEl.id);
    showToast('QR Code generated on canvas!');
  };

  const handleAddRoster = (rosterData: {
    sampleName: string;
    sampleNumber: string;
    fontFamily: string;
    fill: string;
    rosterList: RosterPlayer[];
  }) => {
    const newEl: RosterElement = {
      id: `roster-${Date.now()}`,
      sideId: activeSide.id,
      type: 'roster',
      sampleName: rosterData.sampleName,
      sampleNumber: rosterData.sampleNumber,
      fontFamily: rosterData.fontFamily,
      fill: rosterData.fill,
      rosterList: rosterData.rosterList,
      x: 25,
      y: 25,
      width: 50,
      height: 50,
      rotation: 0,
      zIndex: elements.length + 1,
      opacity: 1,
    };
    const next = [...elements, newEl];
    setElements(next);
    pushHistory(next);
    setSelectedElementId(newEl.id);
    showToast('Applied jersey names & numbers!');
  };

  const handleApplyTemplate = (templateElements: DesignElement[]) => {
    const mapped = templateElements.map((el) => ({
      ...el,
      id: `tpl-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      sideId: activeSide.id,
    }));
    const next = [...elements.filter((el) => el.sideId !== activeSide.id), ...mapped];
    setElements(next);
    pushHistory(next);
    showToast('Design idea template applied!');
  };

  const handleReorderLayer = (id: string, direction: 'up' | 'down') => {
    const currentSideElements = elements
      .filter((el) => el.sideId === activeSide.id)
      .sort((a, b) => a.zIndex - b.zIndex);
    const index = currentSideElements.findIndex((el) => el.id === id);
    if (index === -1) return;

    if (direction === 'up' && index < currentSideElements.length - 1) {
      const temp = currentSideElements[index].zIndex;
      currentSideElements[index].zIndex = currentSideElements[index + 1].zIndex;
      currentSideElements[index + 1].zIndex = temp;
    } else if (direction === 'down' && index > 0) {
      const temp = currentSideElements[index].zIndex;
      currentSideElements[index].zIndex = currentSideElements[index - 1].zIndex;
      currentSideElements[index - 1].zIndex = temp;
    }
    setElements([...elements]);
  };

  const handleAlignCenter = (id: string, axis: 'h' | 'v') => {
    const el = elements.find((item) => item.id === id);
    if (!el) return;
    if (axis === 'h') {
      const nextX = Math.round((50 - el.width / 2) * 10) / 10;
      handleUpdateElement(id, { x: nextX });
    } else {
      const nextY = Math.round((50 - (el.height || 20) / 2) * 10) / 10;
      handleUpdateElement(id, { y: nextY });
    }
  };

  // Export Print Ready SVG
  const handleExportPrintSvg = () => {
    const printArea = activeSide.printArea;
    const sideElements = elements.filter((el) => el.sideId === activeSide.id);

    const svgHeader = `<?xml version="1.0" encoding="utf-8"?>
<!-- Inkybay DesignLab Vector Print File -->
<svg xmlns="http://www.w3.org/2000/svg" 
     viewBox="0 0 ${printArea.physicalWidthInches * 300} ${printArea.physicalHeightInches * 300}" 
     width="${printArea.physicalWidthInches}in" 
     height="${printArea.physicalHeightInches}in">
  <desc>Product: ${currentProduct.name} | Side: ${activeSide.name} | Specs: ${printArea.dpi} DPI</desc>
  <rect width="100%" height="100%" fill="none"/>
`;
    const svgFooter = `\n</svg>`;
    const svgBody = sideElements
      .map((el) => {
        if (el.type === 'text') {
          const t = el as TextElement;
          return `  <text x="${t.x}%" y="${t.y}%" fill="${t.fill}" font-family="${t.fontFamily}" font-size="${t.fontSize}px" text-anchor="${t.textAlign}">${t.text}</text>`;
        }
        if (el.type === 'clipart') {
          const c = el as ClipartElement;
          return `  <g transform="translate(${c.x}, ${c.y}) scale(${c.width / 100})">${c.svgContent}</g>`;
        }
        return '';
      })
      .join('\n');

    const fullSvg = svgHeader + svgBody + svgFooter;
    const blob = new Blob([fullSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PrintProof_${currentProduct.id}_${activeSide.name}_300DPI.svg`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Vector Print File (300 DPI) exported successfully!');
  };

  // Handle Right Sidebar Image Upload
  const handleRightSidebarImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const url = loadEvent.target?.result as string;
      const img = new Image();
      img.onload = () => {
        handleAddImage({
          src: url,
          originalFileName: file.name,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          dpiRating: img.naturalWidth >= 1200 ? 'good' : 'medium',
        });
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const selectedElement = elements.find((el) => el.id === selectedElementId) || null;

  // Pricing calculations
  const usedSides = new Set(elements.map((e) => e.sideId));
  const extraSidesCost = Math.max(0, usedSides.size - 1) * (initialPricingSettings.extraSideFee || 5);
  const unitCustomPrice = currentProduct.basePrice + extraSidesCost;

  const bulkTiers = initialPricingSettings.bulkTiers || [];
  const applicableTier = bulkTiers.reduce((acc, tier) => {
    if (totalQuantity >= tier.minQty) return tier;
    return acc;
  }, bulkTiers[0] || { minQty: 1, discountPercent: 0 });

  const discountMultiplier = 1 - (applicableTier?.discountPercent || 0) / 100;
  const effectiveUnitPrice = unitCustomPrice * discountMultiplier;
  const totalPrice = effectiveUnitPrice * totalQuantity;

  // Filter products for catalog tab
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchesCategory =
      categoryFilter === 'All' ? true : p.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Filter clipart for assets tab
  const filteredClipart = CLIPART_ITEMS.filter((item) => {
    const matchesCategory = assetCategoryFilter === 'All' || item.category === assetCategoryFilter;
    const matchesQuery = item.name.toLowerCase().includes(assetSearchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-[#f6f8fb] via-[#eef2f8] to-[#e4eaf3] overflow-hidden select-none p-2 sm:p-3 gap-2.5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 flex items-center gap-2 bg-zinc-900/95 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-semibold animate-bounce border border-white/20">
          <CheckCircle className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP STUDIO ACTION STRIP (Glassmorphic Pill Bar) */}
      <div className="bg-white/90 backdrop-blur-xl border border-white/90 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] px-4 py-2 flex items-center justify-between shrink-0 z-30 text-zinc-700 text-xs">
        {/* Left Actions: Reset, Undo, Redo, Zoom, Realistic Preview */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoom(1.0)}
            title="Reset Product View"
            className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-zinc-700 font-bold text-xs transition cursor-pointer"
          >
            Reset
          </button>
          <div className="w-[1px] h-4 bg-zinc-200 mx-1" />
          <button
            onClick={handleUndo}
            disabled={historyIndex === 0}
            title="Undo"
            className="p-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-zinc-700 transition disabled:opacity-30 cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            title="Redo"
            className="p-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-zinc-700 transition disabled:opacity-30 cursor-pointer"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
          <div className="w-[1px] h-4 bg-zinc-200 mx-1" />
          <button
            onClick={() => setZoom(zoom >= 1.4 ? 1.0 : zoom + 0.2)}
            title="Zoom"
            className="p-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-zinc-700 transition cursor-pointer flex items-center gap-1"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold">{Math.round(zoom * 100)}%</span>
          </button>

          {/* Realistic Preview Pill */}
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="ml-2 px-3 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-amber-300" />
            <span>Realistic Preview</span>
          </button>
        </div>

        {/* Center Actions: Unit Switch, Selection, Layers */}
        <div className="flex items-center gap-2">
          {/* Size Unit Switcher (CM / INCH) */}
          <div className="flex items-center gap-1 px-2.5 py-1 bg-zinc-100/90 rounded-full border border-zinc-200/60 text-[11px] font-medium text-zinc-600">
            <Ruler className="w-3 h-3 text-zinc-400" />
            <span>Unit:</span>
            <button
              onClick={() => setUnitSystem(unitSystem === 'cm' ? 'inch' : 'cm')}
              className="ml-0.5 px-2 py-0.5 rounded-full bg-white font-extrabold text-zinc-900 shadow-xs uppercase font-mono text-[10px] cursor-pointer"
            >
              {unitSystem}
            </button>
          </div>

          <button
            onClick={handleSelectAll}
            className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-[11px] font-bold text-zinc-700 transition cursor-pointer"
          >
            Select All
          </button>

          <button
            onClick={() => setIsLayersModalOpen(true)}
            className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-[11px] font-bold text-zinc-700 transition flex items-center gap-1 cursor-pointer"
          >
            <Layers className="w-3 h-3 text-zinc-500" />
            <span>Layers ({elements.filter((e) => e.sideId === activeSide.id).length})</span>
          </button>

          <button
            onClick={handleClearAll}
            className="px-2.5 py-1 bg-zinc-100 hover:bg-red-50 hover:text-red-600 rounded-lg text-[11px] font-bold text-zinc-500 transition cursor-pointer"
          >
            Clear
          </button>
        </div>

        {/* Right Action Icons: Download 300 DPI Vector, Share, Save */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleExportPrintSvg}
            title="Download Print Vector SVG (300 DPI)"
            className="p-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-zinc-700 transition cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export SVG</span>
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              showToast('Design share link copied to clipboard!');
            }}
            title="Share Design"
            className="p-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-zinc-700 transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              showToast('Design saved to account!');
              if (onSaveOrderRecord) onSaveOrderRecord({ product: currentProduct, elements });
            }}
            title="Save Design"
            className="p-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-zinc-700 transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE: THREE-PANEL ARCHITECTURE */}
      <div className="flex-1 flex overflow-hidden gap-3 relative">
        {/* ========================================================================= */}
        {/* PANEL A: LEFT SIDEBAR — ALL EDITING TOOLS & ACTIVE CONTROLS DRAWER       */}
        {/* ========================================================================= */}
        <div className="w-80 lg:w-[320px] bg-white/95 backdrop-blur-xl border border-white/80 rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden shrink-0 z-20">
          {/* Header Bar */}
          <div className="p-3.5 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Origin" className="h-4 w-auto object-contain select-none" />
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-zinc-400">
                Editing Tools
              </span>
            </div>
            <button
              onClick={() => setIsLayersModalOpen(true)}
              className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition flex items-center gap-1 cursor-pointer"
            >
              <Layers className="w-3 h-3 text-zinc-500" />
              <span>{elements.filter((e) => e.sideId === activeSide.id).length} Layers</span>
            </button>
          </div>

          {/* Left Panel Content Area */}
          <div className="flex-1 overflow-y-auto">
            {activeTool ? (
              // Active Tool Controls Drawer
              <div className="flex-1 flex flex-col h-full">
                <div className="p-3 bg-zinc-50/80 border-b border-zinc-100 flex items-center justify-between">
                  <button
                    onClick={() => setActiveTool(null)}
                    className="text-xs font-bold text-zinc-600 hover:text-zinc-900 flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>All Tools</span>
                  </button>
                  <span className="text-xs font-extrabold uppercase tracking-wide text-zinc-800">
                    {activeTool === 'text' && 'Typography'}
                    {activeTool === 'clipart' && 'Clipart Library'}
                    {activeTool === 'qrcode' && 'QR Generator'}
                    {activeTool === 'upload' && 'Upload Art'}
                    {activeTool === 'roster' && 'Team Jersey'}
                    {activeTool === 'templates' && 'Design Ideas'}
                  </span>
                  <button
                    onClick={() => setActiveTool(null)}
                    className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 cursor-pointer"
                    title="Close Tool Settings"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                  {activeTool === 'text' && (
                    <TextControls
                      selectedElement={selectedElement?.type === 'text' ? (selectedElement as TextElement) : null}
                      onUpdateText={(updates) => selectedElement && handleUpdateElement(selectedElement.id, updates)}
                      onAddText={(text, fontFamily, fill) => handleAddText(text, fontFamily, fill)}
                    />
                  )}
                  {activeTool === 'clipart' && (
                    <ClipartControls
                      selectedElement={selectedElement?.type === 'clipart' ? (selectedElement as ClipartElement) : null}
                      onUpdateClipart={(updates) => selectedElement && handleUpdateElement(selectedElement.id, updates)}
                      onAddClipart={handleAddClipart}
                    />
                  )}
                  {activeTool === 'qrcode' && (
                    <QRCodeControls
                      selectedElement={selectedElement?.type === 'qrcode' ? (selectedElement as QRCodeElement) : null}
                      onUpdateQRCode={(updates) => selectedElement && handleUpdateElement(selectedElement.id, updates)}
                      onAddQRCode={handleAddQRCode}
                    />
                  )}
                  {activeTool === 'upload' && (
                    <UploadControls
                      selectedElement={selectedElement?.type === 'image' ? (selectedElement as ImageElement) : null}
                      activePrintArea={activeSide.printArea}
                      onUpdateImage={(updates) => selectedElement && handleUpdateElement(selectedElement.id, updates)}
                      onAddImage={handleAddImage}
                    />
                  )}
                  {activeTool === 'roster' && (
                    <RosterControls
                      selectedElement={selectedElement?.type === 'roster' ? (selectedElement as RosterElement) : null}
                      productSizes={currentProduct.sizes}
                      onUpdateRoster={(updates) => selectedElement && handleUpdateElement(selectedElement.id, updates)}
                      onAddRoster={handleAddRoster}
                    />
                  )}
                  {activeTool === 'templates' && (
                    <TemplatesControls onApplyTemplate={handleApplyTemplate} />
                  )}
                </div>
              </div>
            ) : (
              // Tool Selection Menu (Clean Cards with Category Distinction)
              <div className="p-3 space-y-3">
                {/* Selected Element Quick Utilities */}
                {selectedElement && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900">
                        Selected: {selectedElement.type}
                      </span>
                      <button
                        onClick={() => setSelectedElementId(null)}
                        className="text-[10px] font-bold text-amber-700 hover:text-amber-950"
                      >
                        Deselect
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      <button
                        onClick={() => handleAlignCenter(selectedElement.id, 'h')}
                        title="Align Center Horizontally"
                        className="p-2 bg-white hover:bg-amber-100 rounded-xl text-zinc-700 transition flex items-center justify-center border border-amber-200/60 cursor-pointer"
                      >
                        <AlignHorizontalJustifyCenter className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleAlignCenter(selectedElement.id, 'v')}
                        title="Align Center Vertically"
                        className="p-2 bg-white hover:bg-amber-100 rounded-xl text-zinc-700 transition flex items-center justify-center border border-amber-200/60 cursor-pointer"
                      >
                        <AlignVerticalJustifyCenter className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicateElement(selectedElement.id)}
                        title="Duplicate Element"
                        className="p-2 bg-white hover:bg-amber-100 rounded-xl text-zinc-700 transition flex items-center justify-center border border-amber-200/60 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteElement(selectedElement.id)}
                        title="Delete Element"
                        className="p-2 bg-white hover:bg-red-50 hover:text-red-600 rounded-xl text-zinc-700 transition flex items-center justify-center border border-amber-200/60 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Primary Tools List */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block px-1">
                    Design Utilities
                  </span>
                  {[
                    { id: 'text', label: 'Typography & Text', desc: 'Add custom slogans, curved fonts & text', icon: Type, color: 'text-sky-600 bg-sky-50' },
                    { id: 'clipart', label: 'Vector Clipart & Shapes', desc: 'Streetwear badges, stars & graphics', icon: Shapes, color: 'text-amber-600 bg-amber-50' },
                    { id: 'upload', label: 'Upload Customer Artwork', desc: 'PNG, SVG, JPG with auto-DPI check', icon: Upload, color: 'text-emerald-600 bg-emerald-50' },
                    { id: 'qrcode', label: 'QR Code Generator', desc: 'Scan-to-link, Instagram & website QR', icon: QrCode, color: 'text-purple-600 bg-purple-50' },
                    { id: 'roster', label: 'Jersey Names & Numbers', desc: 'Bulk team roster with auto-sizing', icon: Users, color: 'text-rose-600 bg-rose-50' },
                    { id: 'templates', label: 'Curated Design Ideas', desc: 'Ready-to-use streetwear layouts', icon: LayoutTemplate, color: 'text-indigo-600 bg-indigo-50' },
                  ].map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => setActiveTool(tool.id as ToolType)}
                        className="w-full p-2.5 rounded-2xl border border-zinc-100 hover:border-zinc-300 bg-white hover:bg-zinc-50/80 transition-all flex items-center gap-3 text-left shadow-2xs hover:shadow-sm cursor-pointer group"
                      >
                        <div className={`w-9 h-9 rounded-xl ${tool.color} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-xs text-zinc-900 group-hover:text-zinc-950 flex items-center justify-between">
                            <span>{tool.label}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-600 transition" />
                          </div>
                          <p className="text-[11px] text-zinc-500 truncate">{tool.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Quick Access Layers Button */}
                <div className="pt-2">
                  <button
                    onClick={() => setIsLayersModalOpen(true)}
                    className="w-full py-2.5 px-3 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-zinc-600" />
                    <span>Manage Canvas Layers ({elements.filter((e) => e.sideId === activeSide.id).length})</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PANEL B: CENTER WORKSPACE — MAIN EDITING CANVAS & VIEWPORT CONTROLS       */}
        {/* ========================================================================= */}
        <div className="flex-1 bg-white/80 backdrop-blur-xl border border-white/90 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.06)] relative overflow-hidden flex flex-col min-w-0">
          {/* Top Stage Controls Pill Bar */}
          <div className="absolute top-4 right-6 z-20 flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/60 shadow-sm text-xs font-bold">
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="px-3 py-1 rounded-full bg-zinc-900 text-white shadow-2xs hover:bg-zinc-800 transition cursor-pointer flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-amber-300" />
                <span>Realistic Preview</span>
              </button>
              <button
                onClick={() => setShowGuides(!showGuides)}
                className={`px-3 py-1 rounded-full transition cursor-pointer ${
                  showGuides ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                Safe Area: {showGuides ? 'On' : 'Off'}
              </button>
            </div>
          </div>

          {/* Interactive Canvas Area */}
          <div className="flex-1 w-full h-full relative">
            <CanvasArea
              product={currentProduct}
              activeSide={activeSide}
              activeColor={selectedColor}
              elements={elements}
              selectedElementId={selectedElementId}
              onSelectElement={handleSelectElement}
              onUpdateElement={handleUpdateElement}
              onDeleteElement={handleDeleteElement}
              onDuplicateElement={handleDuplicateElement}
              showGuides={showGuides}
              onToggleGuides={() => setShowGuides(!showGuides)}
              zoom={zoom}
              onZoomChange={setZoom}
              unit={unitSystem}
              onRotateSide={handleRotateSide}
            />
          </div>

          {/* FLOATING BOTTOM DOCK: "ON A HANGER" */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/90 backdrop-blur-xl border border-white/90 shadow-[0_15px_35px_rgba(0,0,0,0.12)]">
              {/* Label */}
              <div className="flex items-center gap-1.5 pr-2 border-r border-zinc-200/80 text-zinc-800">
                <Shirt className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-[11px] font-extrabold uppercase tracking-tight whitespace-nowrap">
                  On a hanger
                </span>
              </div>

              {/* Garment Sides Selection Pill Items */}
              <div className="flex items-center gap-2">
                {currentProduct.sides.map((side) => {
                  const isCurrent = activeSideId === side.id;
                  const sideElCount = elements.filter((e) => e.sideId === side.id).length;

                  return (
                    <button
                      key={side.id}
                      onClick={() => {
                        setActiveSideId(side.id);
                        setSelectedElementId(null);
                      }}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-zinc-900 text-white shadow-sm ring-2 ring-zinc-900/20'
                          : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                      }`}
                    >
                      <div className="w-5 h-5 relative pointer-events-none">
                        <ProductMockupSvg mockupKey={side.mockupSvg} colorHex={selectedColor.hex} sideId={side.id} />
                      </div>
                      <span className="text-xs font-bold whitespace-nowrap">{side.name}</span>
                      {sideElCount > 0 && (
                        <span
                          className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                            isCurrent ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-300 text-zinc-800'
                          }`}
                        >
                          {sideElCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Quick Change Product Button in Hanger Dock */}
              <div className="pl-2 border-l border-zinc-200/80">
                <button
                  onClick={() => {
                    setRightPanelTab('catalog');
                    setIsProductChangeOpen(true);
                  }}
                  className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-600 transition cursor-pointer"
                  title="Switch to another garment"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PANEL C: RIGHT SIDEBAR — CATALOG, CONTENT, IMAGES, ASSETS & PARAMETERS    */}
        {/* ========================================================================= */}
        <div className="w-80 lg:w-[340px] xl:w-[360px] bg-white/95 backdrop-blur-xl border border-white/80 rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden shrink-0 z-20">
          {/* Top Segmented Navigation Tabs */}
          <div className="p-3 border-b border-zinc-100 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-zinc-400">
                Library &amp; Assets
              </span>
              <div className="font-mono font-extrabold text-xs text-zinc-950 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 text-amber-900">
                ${totalPrice.toFixed(2)}
              </div>
            </div>

            {/* 4 Primary Navigation Tabs (Strict Requirement) */}
            <div className="grid grid-cols-4 p-1 rounded-full bg-zinc-100 border border-zinc-200/60 text-[11px] font-bold">
              {[
                { id: 'catalog', label: 'Catalog', icon: Shirt },
                { id: 'content', label: 'Content', icon: FileText },
                { id: 'images', label: 'Images', icon: ImageIcon },
                { id: 'assets', label: 'Assets', icon: Shapes },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = rightPanelTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setRightPanelTab(tab.id as RightPanelTab)}
                    className={`py-1.5 px-1 rounded-full text-center transition flex items-center justify-center gap-1 cursor-pointer ${
                      isActive ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Tab Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
            {/* ----------------------------------------------------------- */}
            {/* TAB 1: CATALOG (Styles, Categories, Grid, Selection)        */}
            {/* ----------------------------------------------------------- */}
            {rightPanelTab === 'catalog' && (
              <div className="space-y-3">
                {/* Search Input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search styles, garments..."
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-full bg-zinc-100/80 border border-zinc-200/60 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:bg-white transition"
                  />
                </div>

                {/* Category Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {(['All', 'Apparel', 'Accessories', 'Bags', 'Home'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                        categoryFilter === cat
                          ? 'bg-zinc-900 text-white shadow-2xs'
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Product Card Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  {filteredProducts.map((prod) => {
                    const isCurrent = prod.id === currentProduct.id;
                    const isWish = wishlist.includes(prod.id);

                    return (
                      <div
                        key={prod.id}
                        onClick={() => handleProductSelect(prod)}
                        className={`rounded-2xl border p-2.5 flex flex-col justify-between cursor-pointer transition-all relative group ${
                          isCurrent
                            ? 'border-zinc-900 bg-zinc-50/50 shadow-md ring-2 ring-zinc-900/10'
                            : 'border-zinc-200/80 bg-white hover:border-zinc-300 hover:shadow-sm'
                        }`}
                      >
                        {/* Wishlist Heart Icon */}
                        <button
                          onClick={(e) => toggleWishlist(prod.id, e)}
                          className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white text-zinc-400 hover:text-rose-500 shadow-2xs transition z-10"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isWish ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>

                        {/* Product Cutout Mockup */}
                        <div className="w-full h-24 relative flex items-center justify-center p-1 pointer-events-none mb-1">
                          {prod.image ? (
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-full h-full object-contain drop-shadow-xs group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <ProductMockupSvg
                              mockupKey={prod.sides[0].mockupSvg}
                              colorHex={prod.colors[0].hex}
                              sideId={prod.sides[0].id}
                            />
                          )}
                        </div>

                        <div>
                          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                            {prod.category}
                          </div>
                          <div className="font-bold text-xs text-zinc-900 line-clamp-1 group-hover:text-amber-600 transition">
                            {prod.name}
                          </div>
                          <div className="flex items-center justify-between mt-1 pt-1 border-t border-zinc-100">
                            <span className="font-mono font-bold text-xs text-zinc-900">
                              ${prod.basePrice.toFixed(2)}
                            </span>
                            {isCurrent ? (
                              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-zinc-900 text-white">
                                Active
                              </span>
                            ) : (
                              <span className="text-[10px] text-zinc-500 group-hover:text-zinc-900 font-bold">
                                Select →
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------- */}
            {/* TAB 2: CONTENT (Slogans, Phrases & Quick Text Insert)       */}
            {/* ----------------------------------------------------------- */}
            {rightPanelTab === 'content' && (
              <div className="space-y-4">
                {/* Quick Add Custom Text Input */}
                <div className="p-3 bg-zinc-50/80 rounded-2xl border border-zinc-200/80 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 block">
                    Quick Text Insertion
                  </span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="Type custom phrase..."
                      value={quickText}
                      onChange={(e) => setQuickText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddText(quickText.trim() || 'CUSTOM TEXT');
                          setQuickText('');
                        }
                      }}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    />
                    <button
                      onClick={() => {
                        handleAddText(quickText.trim() || 'CUSTOM TEXT');
                        setQuickText('');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* Curated Slogans / Typography Elements */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block px-1">
                    Curated Typography Presets (1-Click Add)
                  </span>
                  <div className="space-y-2">
                    {CURATED_SLOGANS.map((slogan, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          handleAddText(slogan.text, slogan.font, '#18181b');
                        }}
                        className="w-full p-3 rounded-2xl border border-zinc-100 hover:border-zinc-300 bg-white hover:bg-zinc-50/80 transition-all flex items-center justify-between text-left shadow-2xs hover:shadow-sm cursor-pointer group"
                      >
                        <div>
                          <div
                            className="text-sm font-bold text-zinc-900 group-hover:text-amber-600 transition"
                            style={{ fontFamily: slogan.font, letterSpacing: `${slogan.letterSpacing}px` }}
                          >
                            {slogan.text}
                          </div>
                          <span className="text-[10px] text-zinc-400 font-medium">
                            {slogan.style}
                          </span>
                        </div>
                        <Plus className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:scale-110 transition" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------- */}
            {/* TAB 3: IMAGES (Upload Box, DPI Guide & Stock Artworks)      */}
            {/* ----------------------------------------------------------- */}
            {rightPanelTab === 'images' && (
              <div className="space-y-4">
                {/* Direct Upload Trigger Box */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-zinc-200 hover:border-zinc-400 bg-zinc-50/50 hover:bg-white transition text-center space-y-2">
                  <input
                    ref={rightUploadInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleRightSidebarImageUpload}
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-zinc-900">Upload Artwork</h4>
                    <p className="text-[10px] text-zinc-500">Supports PNG, SVG, JPG up to 25MB</p>
                  </div>
                  <button
                    onClick={() => rightUploadInputRef.current?.click()}
                    className="px-4 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs transition cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                  >
                    <span>Browse Local Files</span>
                  </button>
                </div>

                {/* Resolution & Print Spec Info */}
                <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-zinc-800 block text-[11px]">Print Ready Standard</span>
                    <span className="text-[10px] text-zinc-500">Ultra-HD 300 DPI Direct-to-Garment</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                    Passed
                  </span>
                </div>

                {/* Curated High-Res Graphics */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block px-1">
                    Sample Stock Graphics (1-Click Insert)
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {CURATED_ARTWORK.map((art, i) => (
                      <div
                        key={i}
                        onClick={() =>
                          handleAddImage({
                            src: art.url,
                            originalFileName: art.name,
                            naturalWidth: art.width,
                            naturalHeight: art.height,
                            dpiRating: 'good',
                          })
                        }
                        className="rounded-2xl border border-zinc-200/80 bg-white p-2 hover:border-zinc-400 hover:shadow-sm cursor-pointer transition group"
                      >
                        <div className="w-full h-24 rounded-xl overflow-hidden bg-zinc-100 mb-1.5">
                          <img
                            src={art.url}
                            alt={art.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="text-xs font-bold text-zinc-900 truncate group-hover:text-amber-600 transition">
                          {art.name}
                        </div>
                        <div className="flex items-center justify-between mt-1 text-[10px] text-zinc-400">
                          <span>{art.tag}</span>
                          <span className="font-bold text-zinc-700">Add +</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------- */}
            {/* TAB 4: ASSETS (Vector Clipart, Badges & Design Templates)    */}
            {/* ----------------------------------------------------------- */}
            {rightPanelTab === 'assets' && (
              <div className="space-y-4">
                {/* Clipart Search & Category Filter */}
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search vector graphics..."
                      value={assetSearchQuery}
                      onChange={(e) => setAssetSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-full bg-zinc-100/80 border border-zinc-200/60 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:bg-white transition"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                    {CLIPART_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setAssetCategoryFilter(cat)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition cursor-pointer ${
                          assetCategoryFilter === cat
                            ? 'bg-zinc-900 text-white shadow-2xs'
                            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vector Clipart Grid */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block px-1">
                    Vector Elements ({filteredClipart.length})
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {filteredClipart.slice(0, 15).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleAddClipart(item, '#18181b')}
                        title={`Add ${item.name}`}
                        className="p-3 bg-white hover:bg-zinc-50 border border-zinc-200/80 hover:border-zinc-400 rounded-2xl flex flex-col items-center justify-center transition cursor-pointer group shadow-2xs"
                      >
                        <div
                          className="w-8 h-8 text-zinc-800 group-hover:scale-110 group-hover:text-amber-600 transition"
                          dangerouslySetInnerHTML={{ __html: item.svg }}
                        />
                        <span className="text-[9px] font-bold text-zinc-500 mt-1 truncate w-full text-center">
                          {item.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Curated Streetwear Templates */}
                <div className="space-y-2 pt-2 border-t border-zinc-100">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block px-1">
                    Curated Layout Templates
                  </span>
                  <div className="space-y-2">
                    {TEMPLATES_DATA.map((tpl) => (
                      <div
                        key={tpl.id}
                        onClick={() => handleApplyTemplate(tpl.elements as DesignElement[])}
                        className="p-3 rounded-2xl border border-zinc-200/80 bg-white hover:border-zinc-400 hover:shadow-sm transition cursor-pointer flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold text-xs text-zinc-900 group-hover:text-amber-600 transition">
                            {tpl.name}
                          </div>
                          <p className="text-[10px] text-zinc-500 line-clamp-1">{tpl.description}</p>
                        </div>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 group-hover:bg-zinc-900 group-hover:text-white transition">
                          Apply →
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------- */}
            {/* PINNED SECTION: CONFIGURED GARMENT, COLOR, SIZES & ACCORDIONS */}
            {/* ----------------------------------------------------------- */}
            <div className="pt-3 border-t border-zinc-100 space-y-4">
              {/* Product Info Card */}
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-500 block">
                  Configured Garment
                </span>
                <div className="bg-zinc-50/70 rounded-2xl p-3 border border-zinc-200/70 flex gap-3 items-center">
                  <div className="w-14 h-14 rounded-xl bg-white border border-zinc-200/80 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                    <ProductMockupSvg
                      mockupKey={activeSide.mockupSvg}
                      colorHex={selectedColor.hex}
                      sideId={activeSide.id}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-xs text-zinc-900 truncate">
                      {currentProduct.name}
                    </h4>
                    <div className="text-[10px] font-mono text-zinc-500">
                      Ref. {currentProduct.id.replace('prod-', '').toUpperCase()}-2026
                    </div>
                    <div className="text-xs font-bold text-zinc-800 mt-0.5">
                      Base ${currentProduct.basePrice.toFixed(2)}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setRightPanelTab('catalog');
                      setIsProductChangeOpen(true);
                    }}
                    className="p-1.5 rounded-full hover:bg-zinc-200 text-zinc-600 transition cursor-pointer"
                    title="Change Garment"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Color Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-500">
                    Color
                  </span>
                  <span className="text-xs font-bold text-zinc-800">
                    {selectedColor.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {currentProduct.colors.map((c) => {
                    const isSelected = selectedColor.id === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedColor(c)}
                        title={c.name}
                        className={`w-7 h-7 rounded-full border transition-all cursor-pointer ${
                          isSelected
                            ? 'ring-2 ring-zinc-900 ring-offset-2 scale-110 shadow-sm border-white'
                            : 'border-zinc-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    );
                  })}
                  <button
                    onClick={() => setIsEditColorOpen(true)}
                    className="px-2.5 py-1 rounded-full border border-dashed border-zinc-300 hover:border-zinc-500 text-[10px] font-bold text-zinc-600 hover:text-zinc-900 transition cursor-pointer"
                  >
                    + Custom
                  </button>
                </div>
              </div>

              {/* Size Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-500">
                    Size
                  </span>
                  <button
                    onClick={() => setIsSizeCartOpen(true)}
                    className="text-[10px] font-bold text-zinc-700 underline cursor-pointer"
                  >
                    Size breakdown &amp; qty
                  </button>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {currentProduct.sizes.map((sz) => {
                    const activeSizeKey = Object.keys(sizeQuantities).find((k) => sizeQuantities[k] > 0) || currentProduct.sizes[0];
                    const isSelected = activeSizeKey === sz;

                    return (
                      <button
                        key={sz}
                        onClick={() => {
                          setSizeQuantities({ [sz]: totalQuantity || 1 });
                        }}
                        className={`w-9 h-9 rounded-full text-xs font-extrabold flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-zinc-900 text-white shadow-sm'
                            : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Accordions: Care, Turnaround & Notes */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-100">
                <div className="rounded-2xl border border-zinc-100 overflow-hidden bg-zinc-50/60">
                  <button
                    onClick={() => toggleAccordion('materials')}
                    className="w-full px-3 py-2.5 flex items-center justify-between text-xs font-bold text-zinc-800 text-left cursor-pointer hover:bg-zinc-100/60 transition"
                  >
                    <span>Materials, care and source</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${
                        openAccordions.materials ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openAccordions.materials && (
                    <div className="px-3 pb-3 text-[11px] text-zinc-500 space-y-1 border-t border-zinc-100/60 pt-2">
                      <p>• {currentProduct.description}</p>
                      <p>• Print Method: Direct-to-Garment (DTG) Ultra-HD soft-feel inks.</p>
                      <p>• Wash cold inside-out, tumble dry low.</p>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-zinc-100 overflow-hidden bg-zinc-50/60">
                  <button
                    onClick={() => toggleAccordion('turnaround')}
                    className="w-full px-3 py-2.5 flex items-center justify-between text-xs font-bold text-zinc-800 text-left cursor-pointer hover:bg-zinc-100/60 transition"
                  >
                    <span>In-store availability &amp; delivery</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${
                        openAccordions.turnaround ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openAccordions.turnaround && (
                    <div className="px-3 pb-3 text-[11px] text-zinc-500 space-y-1 border-t border-zinc-100/60 pt-2">
                      <p>• Custom production turnaround: 2-3 business days.</p>
                      <p>• Ships via Priority Tracked Courier.</p>
                      <p>• 100% Quality Guaranteed Print Proof.</p>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-zinc-100 overflow-hidden bg-zinc-50/60">
                  <button
                    onClick={() => toggleAccordion('notes')}
                    className="w-full px-3 py-2.5 flex items-center justify-between text-xs font-bold text-zinc-800 text-left cursor-pointer hover:bg-zinc-100/60 transition"
                  >
                    <span>Production notes {orderNote ? '✓' : ''}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${
                        openAccordions.notes ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openAccordions.notes && (
                    <div className="px-3 pb-3 text-[11px] text-zinc-500 space-y-2 border-t border-zinc-100/60 pt-2">
                      <p>{orderNote || 'No special production notes attached.'}</p>
                      <button
                        onClick={() => setIsNotesOpen(true)}
                        className="w-full py-1.5 px-2 rounded-xl bg-white border border-zinc-200 text-zinc-800 font-bold text-center block hover:bg-zinc-50 cursor-pointer"
                      >
                        {orderNote ? 'Edit Production Note' : '+ Add Special Instructions'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Live Pricing & Vibrant CTA Button */}
          <div className="p-4 border-t border-zinc-100 bg-white/60 space-y-2 shrink-0">
            <div className="flex items-center justify-between text-xs text-zinc-600">
              <span>Unit Price:</span>
              <span className="font-bold text-zinc-900">${effectiveUnitPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-zinc-600">
              <span>Quantity:</span>
              <span className="font-bold text-zinc-900">{totalQuantity}</span>
            </div>
            {applicableTier.discountPercent > 0 && (
              <div className="flex items-center justify-between text-xs text-emerald-600 font-bold">
                <span>Tier Discount:</span>
                <span>-{applicableTier.discountPercent}% OFF</span>
              </div>
            )}

            <button
              onClick={() => setIsSizeCartOpen(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#facc15] hover:bg-[#eab308] text-zinc-950 font-black text-sm shadow-[0_4px_15px_rgba(250,204,21,0.4)] transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-tight"
            >
              <ShoppingBag className="w-4 h-4 text-zinc-950" />
              <span>Add to bag ({totalQuantity}) • ${totalPrice.toFixed(2)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. MODALS */}
      {/* Size & Cart Modal */}
      <SizeAndCartModal
        isOpen={isSizeCartOpen}
        onClose={() => setIsSizeCartOpen(false)}
        product={currentProduct}
        selectedColor={selectedColor}
        pricingSettings={initialPricingSettings}
        elements={elements}
        onSuccess={(quantities, totalQty) => {
          setSizeQuantities(quantities);
          setTotalQuantity(totalQty);
          setIsSizeCartOpen(false);
          setIsCartDrawerOpen(true);
        }}
      />

      {/* Change Product Modal */}
      <ProductChangeModal
        isOpen={isProductChangeOpen}
        onClose={() => setIsProductChangeOpen(false)}
        products={products}
        currentProductId={currentProduct.id}
        onSelectProduct={handleProductSelect}
      />

      {/* Edit Color Modal */}
      <EditColorModal
        isOpen={isEditColorOpen}
        onClose={() => setIsEditColorOpen(false)}
        colors={currentProduct.colors}
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
      />

      {/* Order Notes Modal */}
      <OrderNotesModal
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        note={orderNote}
        onSaveNote={(note) => {
          setOrderNote(note);
          showToast('Order note saved for production!');
        }}
      />

      {/* Edit Layers Modal */}
      <LayersModal
        isOpen={isLayersModalOpen}
        onClose={() => setIsLayersModalOpen(false)}
        elements={elements}
        activeSideId={activeSide.id}
        selectedElementId={selectedElementId}
        onSelectElement={handleSelectElement}
        onUpdateElement={handleUpdateElement}
        onDeleteElement={handleDeleteElement}
        onDuplicateElement={handleDuplicateElement}
        onReorderLayer={handleReorderLayer}
      />

      {/* Photorealistic Preview Modal */}
      <RealisticPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        product={currentProduct}
        activeColor={selectedColor}
        elements={elements}
        currentSideId={activeSide.id}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        product={currentProduct}
        selectedColor={selectedColor}
        selectedSize={Object.keys(sizeQuantities).find((k) => sizeQuantities[k] > 0) || currentProduct.sizes[0]}
        quantity={totalQuantity}
        totalPrice={totalPrice}
        elements={elements}
        onOrderSuccess={() => {
          setIsCartDrawerOpen(false);
          showToast('Order submitted to checkout!');
        }}
      />
    </div>
  );
};
