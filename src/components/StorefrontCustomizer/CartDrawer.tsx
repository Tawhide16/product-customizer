'use client';

import React from 'react';
import { Product, ProductColor, DesignElement } from '@/types/customizer';
import { X, ShoppingBag, ArrowRight, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedColor: ProductColor;
  selectedSize: string;
  quantity: number;
  totalPrice: number;
  elements: DesignElement[];
  onOrderSuccess: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  product,
  selectedColor,
  selectedSize,
  quantity,
  totalPrice,
  elements,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const usedSides = Array.from(new Set(elements.map((el) => el.sideId)));

  const handleCheckout = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onOrderSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-left border-l border-zinc-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 bg-zinc-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-zinc-900">Your Cart (1 Item)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Cart Item Card */}
          <div className="p-3.5 border border-zinc-200 rounded-2xl bg-white shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-zinc-900">{product.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-zinc-300"
                    style={{ backgroundColor: selectedColor.hex }}
                  />
                  <span className="text-xs text-zinc-600">
                    {selectedColor.name} • Size {selectedSize}
                  </span>
                </div>
              </div>
              <span className="text-sm font-extrabold text-zinc-900 font-mono">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            {/* Customization Manifest */}
            <div className="p-3 bg-zinc-50 rounded-xl space-y-2 border border-zinc-200/60 text-xs">
              <div className="font-semibold text-zinc-700 flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5 text-emerald-600" />
                <span>Customization Specification</span>
              </div>
              <div className="text-zinc-600 space-y-1">
                <div className="flex justify-between">
                  <span>Print Locations:</span>
                  <span className="font-semibold capitalize text-zinc-800">
                    {usedSides.length > 0 ? usedSides.join(', ') : 'Base Front'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Custom Design Elements:</span>
                  <span className="font-semibold text-zinc-800">{elements.length} Elements</span>
                </div>
                <div className="flex justify-between">
                  <span>Order Quantity:</span>
                  <span className="font-semibold text-zinc-800">{quantity} units</span>
                </div>
              </div>
            </div>

            {/* Production Quality Assurance */}
            <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Production-ready vector files &amp; print alignment validated</span>
            </div>
          </div>

          {/* Shopify Platform Assurance */}
          <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Encrypted checkout via Shopify Payments. 100% Satisfaction Print Guarantee.</span>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-zinc-200 bg-zinc-50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-zinc-700">Subtotal</span>
            <span className="text-lg font-black text-zinc-900 font-mono">
              ${totalPrice.toFixed(2)} USD
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">Taxes and shipping calculated at checkout.</p>
          <button
            onClick={handleCheckout}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Shopify Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
