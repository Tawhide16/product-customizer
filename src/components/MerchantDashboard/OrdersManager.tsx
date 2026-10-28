'use client';

import React, { useState } from 'react';
import { OrderItem } from '@/types/customizer';
import { CATALOG_PRODUCTS } from '@/data/catalog';
import {
  FileText,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  Printer,
  X,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const OrdersManager: React.FC = () => {
  // Pre-populated demo orders demonstrating Shopify orders with customized print payloads
  const [orders, setOrders] = useState<OrderItem[]>([
    {
      id: 'ord-1042',
      orderNumber: '#SP-1042',
      customerName: 'Sarah Jenkins',
      customerEmail: 'sarah.j@example.com',
      product: CATALOG_PRODUCTS[0],
      selectedColor: CATALOG_PRODUCTS[0].colors[1], // Jet black
      size: 'L',
      quantity: 12,
      totalPrice: 288.0,
      printSidesUsed: ['front', 'back'],
      createdAt: '2026-10-28 09:15 AM',
      status: 'Pending Production',
      previewThumbs: { front: '', back: '' },
      elements: [
        {
          id: 'el-1',
          sideId: 'front',
          type: 'text',
          text: 'BROOKLYN RUN CLUB',
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 38,
          fill: '#ffffff',
          textAlign: 'center',
          x: 20,
          y: 28,
          width: 60,
          height: 18,
          rotation: 0,
          zIndex: 1,
          opacity: 1,
          isBold: true,
          isItalic: false,
          isUnderline: false,
          isCurved: false,
          curveRadius: 0,
        },
      ],
    },
    {
      id: 'ord-1041',
      orderNumber: '#SP-1041',
      customerName: 'Marcus Vance',
      customerEmail: 'marcus.v@studio9.co',
      product: CATALOG_PRODUCTS[1], // Heavyweight hoodie
      selectedColor: CATALOG_PRODUCTS[1].colors[0], // Charcoal
      size: 'XL',
      quantity: 25,
      totalPrice: 1020.0,
      printSidesUsed: ['front'],
      createdAt: '2026-10-27 04:30 PM',
      status: 'In Print',
      previewThumbs: { front: '' },
      elements: [
        {
          id: 'el-2',
          sideId: 'front',
          type: 'text',
          text: 'OFFSHORE CREATIVE',
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 24,
          fill: '#ffffff',
          textAlign: 'center',
          x: 25,
          y: 35,
          width: 50,
          height: 14,
          rotation: 0,
          zIndex: 1,
          opacity: 1,
          isBold: true,
          isItalic: false,
          isUnderline: false,
          isCurved: false,
          curveRadius: 0,
        },
      ],
    },
    {
      id: 'ord-1040',
      orderNumber: '#SP-1040',
      customerName: 'Elena Rostova',
      customerEmail: 'elena@rostova-design.com',
      product: CATALOG_PRODUCTS[2], // Mug
      selectedColor: CATALOG_PRODUCTS[2].colors[0],
      size: '15 oz',
      quantity: 50,
      totalPrice: 507.5,
      printSidesUsed: ['front', 'back'],
      createdAt: '2026-10-26 11:20 AM',
      status: 'Shipped',
      previewThumbs: { front: '' },
      elements: [],
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  // Download production ticket JSON
  const handleDownloadTicket = (order: OrderItem) => {
    const jobTicket = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      platform: 'Shopify Storefront Extension',
      timestamp: new Date().toISOString(),
      customer: {
        name: order.customerName,
        email: order.customerEmail,
      },
      manufacturingSpecs: {
        product: order.product.name,
        color: order.selectedColor.name,
        colorHex: order.selectedColor.hex,
        size: order.size,
        quantity: order.quantity,
        sidesCount: order.printSidesUsed.length,
        sides: order.product.sides.map((s) => ({
          sideId: s.id,
          physicalWidthInches: s.printArea.physicalWidthInches,
          physicalHeightInches: s.printArea.physicalHeightInches,
          dpi: s.printArea.dpi,
        })),
        elementsManifest: order.elements,
      },
    };

    const blob = new Blob([JSON.stringify(jobTicket, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ProductionTicket-${order.orderNumber}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadVectorSvg = (order: OrderItem) => {
    const printArea = order.product.sides[0].printArea;
    const svgContent = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     viewBox="0 0 ${printArea.physicalWidthInches * 300} ${printArea.physicalHeightInches * 300}" 
     width="${printArea.physicalWidthInches}in" 
     height="${printArea.physicalHeightInches}in">
  <desc>Production Vector Job - ${order.orderNumber} - ${order.product.name}</desc>
  <rect width="100%" height="100%" fill="none"/>
  <text x="50" y="100" font-family="sans-serif" font-size="64" fill="#000000">
    ORDER ${order.orderNumber} - PRINT FILE (300 DPI)
  </text>
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PrintVector-${order.orderNumber}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Production Print Orders</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Review incoming personalized customer designs, download production vector files (SVG/PDF), and RIP job tickets.
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-700 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Product / Variant</th>
                <th className="py-3 px-4">Qty</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Production Files</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-50/80 transition">
                  <td className="py-3.5 px-4 font-bold text-zinc-900">{order.orderNumber}</td>
                  <td className="py-3.5 px-4 text-zinc-500">{order.createdAt}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-zinc-800 block">{order.customerName}</span>
                    <span className="text-[11px] text-zinc-400 block">{order.customerEmail}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-zinc-300 shrink-0"
                        style={{ backgroundColor: order.selectedColor.hex }}
                      />
                      <div>
                        <span className="font-semibold text-zinc-800 block">{order.product.name}</span>
                        <span className="text-[11px] text-zinc-500">
                          {order.selectedColor.name} • Size {order.size}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-zinc-800">{order.quantity} pcs</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-zinc-900">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        order.status === 'Shipped'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : order.status === 'In Print'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {order.status === 'Shipped' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      {order.status === 'In Print' && <Printer className="w-3 h-3 text-sky-600" />}
                      {order.status === 'Pending Production' && <Clock className="w-3 h-3 text-amber-600" />}
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        title="Inspect Job Specs"
                        className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-700 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDownloadVectorSvg(order)}
                        title="Download Vector SVG"
                        className="py-1 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] flex items-center gap-1 transition shadow-2xs"
                      >
                        <Download className="w-3 h-3" />
                        <span>SVG</span>
                      </button>
                      <button
                        onClick={() => handleDownloadTicket(order)}
                        title="Download JSON RIP Job Ticket"
                        className="py-1 px-2.5 rounded-lg border border-zinc-300 hover:bg-zinc-50 text-zinc-700 font-semibold text-[11px] flex items-center gap-1 transition"
                      >
                        <FileText className="w-3 h-3" />
                        <span>JSON</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Specification Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-zinc-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-zinc-900">
                  Production Specification • {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-zinc-50 rounded-xl">
                <div>
                  <span className="text-zinc-500 block">Customer</span>
                  <span className="font-semibold text-zinc-800">{selectedOrder.customerName}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Quantity &amp; Size</span>
                  <span className="font-semibold text-zinc-800">
                    {selectedOrder.quantity} units • Size {selectedOrder.size}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-zinc-700 mb-1.5">Print Areas Required:</h4>
                <div className="space-y-1.5">
                  {selectedOrder.product.sides.map((s) => (
                    <div
                      key={s.id}
                      className="p-2.5 rounded-lg border border-zinc-200 flex items-center justify-between"
                    >
                      <span className="font-semibold text-zinc-800">{s.name}</span>
                      <span className="font-mono text-[11px] text-zinc-500">
                        {s.printArea.physicalWidthInches}&quot; × {s.printArea.physicalHeightInches}&quot; ({s.printArea.dpi} DPI)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => handleDownloadVectorSvg(selectedOrder)}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download SVG Output</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
