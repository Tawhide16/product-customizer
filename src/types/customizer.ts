export type PrintSideId = 'front' | 'back' | 'sleeve_left' | 'sleeve_right' | 'wrap_left' | 'wrap_right';

export interface PrintArea {
  id: string;
  name: string;
  // Canvas coordinate percentages or relative box
  x: number; // percentage from left (0 - 100)
  y: number; // percentage from top (0 - 100)
  width: number; // percentage of canvas (0 - 100)
  height: number; // percentage of canvas (0 - 100)
  physicalWidthInches: number; // e.g. 12
  physicalHeightInches: number; // e.g. 16
  dpi: number; // e.g. 300
}

export interface ProductSide {
  id: PrintSideId;
  name: string;
  mockupSvg: string; // SVG path or template
  printArea: PrintArea;
}

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
  dark?: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: 'Apparel' | 'Drinkware' | 'Accessories' | 'Headwear' | 'Bags' | 'Home';
  description: string;
  basePrice: number;
  image?: string;
  colors: ProductColor[];
  sides: ProductSide[];
  sizes: string[];
  features: string[];
}

export type ElementType = 'text' | 'image' | 'clipart' | 'qrcode' | 'roster';

export interface BaseElement {
  id: string;
  sideId: PrintSideId;
  type: ElementType;
  x: number; // percentage relative to print area (0-100)
  y: number; // percentage relative to print area (0-100)
  width: number; // percentage relative to print area (10-100)
  height: number; // percentage relative to print area
  rotation: number; // degrees 0-360
  zIndex: number;
  opacity: number;
  isLocked?: boolean;
  isVisible?: boolean;
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  fill: string;
  textAlign: 'left' | 'center' | 'right';
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isCurved: boolean;
  curveRadius: number; // -100 to 100
  strokeColor?: string;
  strokeWidth?: number;
  shadowColor?: string;
  shadowBlur?: number;
  letterSpacing?: number;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  originalFileName: string;
  naturalWidth: number;
  naturalHeight: number;
  filter?: 'none' | 'grayscale' | 'sepia' | 'invert';
  dpiRating: 'good' | 'medium' | 'low';
}

export interface ClipartElement extends BaseElement {
  type: 'clipart';
  name: string;
  svgContent: string;
  fill: string;
  category: string;
}

export interface QRCodeElement extends BaseElement {
  type: 'qrcode';
  url: string;
  qrSvg: string;
  fill: string;
}

export interface RosterPlayer {
  id: string;
  name: string;
  number: string;
  size: string;
}

export interface RosterElement extends BaseElement {
  type: 'roster';
  sampleName: string;
  sampleNumber: string;
  fontFamily: string;
  fill: string;
  strokeColor?: string;
  strokeWidth?: number;
  rosterList: RosterPlayer[];
}

export type DesignElement = TextElement | ImageElement | ClipartElement | QRCodeElement | RosterElement;

export interface BulkDiscountTier {
  minQty: number;
  discountPercent: number;
}

export interface PricingSettings {
  extraSideFee: number;
  textElementFee: number;
  imageUploadFee: number;
  bulkTiers: BulkDiscountTier[];
}

export interface DesignTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  elements: DesignElement[];
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  product: Product;
  selectedColor: ProductColor;
  size: string;
  quantity: number;
  totalPrice: number;
  elements: DesignElement[];
  printSidesUsed: PrintSideId[];
  createdAt: string;
  status: 'Pending Production' | 'In Print' | 'Shipped';
  previewThumbs: { [key in PrintSideId]?: string };
  orderNotes?: string;
  rosterEntries?: RosterPlayer[];
}
