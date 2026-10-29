'use client';

import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Layers,
  Terminal,
  Globe,
  ShoppingBag,
  Cpu,
  Boxes,
} from 'lucide-react';

export const IntegrationGuide: React.FC = () => {
  const [activePlatform, setActivePlatform] = useState<'universal' | 'woocommerce' | 'shopify' | 'api'>('universal');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const reactSnippet = `// 1. Next.js / React Standalone D2C Integration
import { ProductCustomizer } from '@origin/3d-customizer';

export default function ProductPage({ product }) {
  return (
    <div className="product-view">
      <ProductCustomizer
        productId={product.id}
        theme="minimal-dark"
        onAddToCart={(manifest) => {
          // Direct checkout or cart state dispatch
          cart.addItem({
            productId: product.id,
            vectorSvg: manifest.vectorSvg,
            printSpecs: manifest.printSpecs,
            quantity: manifest.quantity
          });
        }}
      />
    </div>
  );
}`;

  const wooCommerceSnippet = `<?php
/**
 * WooCommerce Plugin Hook: Universal 3D Customizer
 */
add_action('woocommerce_after_add_to_cart_button', 'origin_render_customizer_button');

function origin_render_customizer_button() {
    global $product;
    echo '<button type="button" id="origin-customize-btn" class="button alt" 
          data-product-id="' . esc_attr($product->get_id()) . '">
          🎨 Launch 3D Customizer
          </button>';
}
?>`;

  const shopifyLiquidSnippet = `<!-- Shopify Online Store 2.0 App Block -->
<div class="origin-customizer-app-block" data-product-id="{{ product.id }}">
  <button 
    type="button" 
    class="button button--primary w-full"
    onclick="window.OriginCustomizer.openModal({
      productId: '{{ product.id }}',
      variantId: '{{ product.selected_or_first_available_variant.id }}'
    })">
    ✨ Design in 3D Studio
  </button>
</div>`;

  const apiSnippet = `// REST & Webhook Fulfillment API (300 DPI Print Vectors)
POST https://api.origin-studio.com/v1/orders/fulfillment
Headers: { "Authorization": "Bearer sec_live_..." }

Payload:
{
  "orderId": "ORD-2026-991",
  "productId": "prod-tshirt-crewneck",
  "sides": [
    {
      "sideId": "front",
      "vectorSvgUrl": "https://cdn.origin-studio.com/vectors/print_991_front.svg",
      "dpi": 300,
      "widthInches": 12,
      "heightInches": 16
    }
  ]
}`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-200">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-zinc-900 text-white">
            Universal Platform
          </span>
          <span className="text-xs text-zinc-500 font-medium">• Works on any store, framework, or CMS</span>
        </div>
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Multi-Platform Storefront &amp; API Integrations</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Deploy the Origin 3D Customizer anywhere: as a standalone React/Next.js store, on WooCommerce, Shopify, Webflow, or via Headless GraphQL/REST APIs.
        </p>
      </div>

      {/* Platform Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'universal', label: 'Standalone Web & Next.js', icon: Globe },
          { id: 'woocommerce', label: 'WooCommerce & WordPress', icon: ShoppingBag },
          { id: 'shopify', label: 'Shopify OS 2.0', icon: Layers },
          { id: 'api', label: 'Headless REST / Webhook API', icon: Terminal },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activePlatform === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePlatform(tab.id as typeof activePlatform)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'bg-white hover:bg-zinc-100 text-zinc-600 border border-zinc-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-zinc-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Platform Code Preview */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-2xs space-y-4">
        {activePlatform === 'universal' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Standalone Next.js / React D2C Component</h3>
                <p className="text-xs text-zinc-500">
                  Import the customizer directly into any React, Next.js, or Vue e-commerce frontend.
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(reactSnippet, 'universal')}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition flex items-center gap-1.5 cursor-pointer"
              >
                {copiedKey === 'universal' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'universal' ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="p-4 bg-zinc-950 text-zinc-200 rounded-xl text-[12px] font-mono overflow-x-auto leading-relaxed">
              {reactSnippet}
            </pre>
          </div>
        )}

        {activePlatform === 'woocommerce' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">WooCommerce &amp; WordPress Hook</h3>
                <p className="text-xs text-zinc-500">
                  Integrate with WordPress &amp; WooCommerce single product templates with one action hook.
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(wooCommerceSnippet, 'woo')}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition flex items-center gap-1.5 cursor-pointer"
              >
                {copiedKey === 'woo' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'woo' ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="p-4 bg-zinc-950 text-zinc-200 rounded-xl text-[12px] font-mono overflow-x-auto leading-relaxed">
              {wooCommerceSnippet}
            </pre>
          </div>
        )}

        {activePlatform === 'shopify' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Shopify Online Store 2.0 App Block</h3>
                <p className="text-xs text-zinc-500">
                  Embed onto Shopify themes using native Theme App Extensions without editing theme code.
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(shopifyLiquidSnippet, 'shopify')}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition flex items-center gap-1.5 cursor-pointer"
              >
                {copiedKey === 'shopify' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'shopify' ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="p-4 bg-zinc-950 text-zinc-200 rounded-xl text-[12px] font-mono overflow-x-auto leading-relaxed">
              {shopifyLiquidSnippet}
            </pre>
          </div>
        )}

        {activePlatform === 'api' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Headless Print Vector &amp; Order API</h3>
                <p className="text-xs text-zinc-500">
                  Receive instant 300 DPI vector SVGs, cut contours, and dimension tickets directly in your warehouse or print shop.
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(apiSnippet, 'api')}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition flex items-center gap-1.5 cursor-pointer"
              >
                {copiedKey === 'api' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'api' ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="p-4 bg-zinc-950 text-zinc-200 rounded-xl text-[12px] font-mono overflow-x-auto leading-relaxed">
              {apiSnippet}
            </pre>
          </div>
        )}
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-zinc-200">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2">
            <Globe className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-zinc-900">Universal Embedding</h4>
          <p className="text-[11px] text-zinc-500 mt-1">Works seamlessly on React, Vue, Next.js, Webflow, and custom HTML stores.</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-zinc-200">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center mb-2">
            <Cpu className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-zinc-900">300 DPI Vector Output</h4>
          <p className="text-[11px] text-zinc-500 mt-1">Exports CMYK/RGB print-ready vector SVGs calibrated to exact physical inches.</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-zinc-200">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-2">
            <Boxes className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-zinc-900">Direct Cart &amp; Checkout</h4>
          <p className="text-[11px] text-zinc-500 mt-1">Passes customized configurations and vector manifests directly to any checkout.</p>
        </div>
      </div>
    </div>
  );
};
