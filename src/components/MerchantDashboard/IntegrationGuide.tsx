'use client';

import React, { useState } from 'react';
import { Code2, Copy, Check, ExternalLink, ShieldCheck, Layers, Terminal } from 'lucide-react';

export const IntegrationGuide: React.FC = () => {
  const [copiedAppBlock, setCopiedAppBlock] = useState(false);
  const [copiedSdk, setCopiedSdk] = useState(false);

  const shopifyLiquidSnippet = `<!-- Shopify Theme App Extension: Inkybay Customizer Button -->
<div class="inkybay-customizer-wrapper" data-product-id="{{ product.id }}">
  <button 
    type="button" 
    id="inkybay-customize-btn"
    class="button button--secondary w-full"
    onclick="window.InkybayCustomizer.openModal({
      productId: '{{ product.id }}',
      variantId: '{{ product.selected_or_first_available_variant.id }}',
      shopDomain: '{{ shop.permanent_domain }}'
    })">
    🎨 Customize This Product
  </button>
</div>`;

  const jsSdkSnippet = `<div id="product-customizer-container"></div>
<script src="https://cdn.inkybay-customizer.com/sdk/v1/customizer.js" async></script>
<script>
  window.addEventListener('load', () => {
    ProductCustomizer.init({
      element: "#product-customizer-container",
      storeId: "store_prod_88291",
      productId: "prod-tshirt-crewneck",
      onAddToCart: function(cartItem) {
        console.log("Custom design ready for checkout:", cartItem);
      }
    });
  });
</script>`;

  const copyToClipboard = (text: string, isSdk = false) => {
    navigator.clipboard.writeText(text);
    if (isSdk) {
      setCopiedSdk(true);
      setTimeout(() => setCopiedSdk(false), 2000);
    } else {
      setCopiedAppBlock(true);
      setTimeout(() => setCopiedAppBlock(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-200">
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Storefront &amp; SDK Integration</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Seamlessly embed the visual customizer into your Shopify theme or embed via the JavaScript SDK on WooCommerce &amp; custom stores.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shopify Theme App Extension Card */}
        <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-zinc-900">Shopify Theme App Extension</h3>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Active in Theme
            </span>
          </div>

          <p className="text-xs text-zinc-600">
            Automatically injects the <strong>&ldquo;Customize This Product&rdquo;</strong> button onto your Shopify Dawn or modern Online Store 2.0 theme without modifying theme code.
          </p>

          <div className="relative">
            <button
              onClick={() => copyToClipboard(shopifyLiquidSnippet)}
              className="absolute top-2 right-2 p-1.5 rounded-md bg-zinc-800 text-zinc-300 hover:text-white text-xs flex items-center gap-1 transition"
            >
              {copiedAppBlock ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedAppBlock ? 'Copied' : 'Copy'}</span>
            </button>
            <pre className="p-3 bg-zinc-950 text-zinc-200 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
              {shopifyLiquidSnippet}
            </pre>
          </div>
        </div>

        {/* Headless & Multi-Platform JavaScript SDK */}
        <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-zinc-900">Universal JavaScript SDK</h3>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 font-semibold border border-sky-200">
              Cross-Platform
            </span>
          </div>

          <p className="text-xs text-zinc-600">
            Embed on WooCommerce, Next.js, Webflow, or custom e-commerce stores via the cross-platform SDK adapter.
          </p>

          <div className="relative">
            <button
              onClick={() => copyToClipboard(jsSdkSnippet, true)}
              className="absolute top-2 right-2 p-1.5 rounded-md bg-zinc-800 text-zinc-300 hover:text-white text-xs flex items-center gap-1 transition"
            >
              {copiedSdk ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSdk ? 'Copied' : 'Copy'}</span>
            </button>
            <pre className="p-3 bg-zinc-950 text-zinc-200 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
              {jsSdkSnippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
