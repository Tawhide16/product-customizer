'use client';

import React, { useState } from 'react';
import { CATALOG_PRODUCTS, INITIAL_PRICING_SETTINGS } from '@/data/catalog';
import { Product, PricingSettings } from '@/types/customizer';
import { ShopifyPolarisHeader, AppView } from '@/components/ShopifyPolarisHeader';
import { Studio } from '@/components/StorefrontCustomizer/Studio';
import { ProductManager } from '@/components/MerchantDashboard/ProductManager';
import { PricingRulesManager } from '@/components/MerchantDashboard/PricingRulesManager';
import { OrdersManager } from '@/components/MerchantDashboard/OrdersManager';
import { IntegrationGuide } from '@/components/MerchantDashboard/IntegrationGuide';
import { StorefrontSimulator } from '@/components/StorefrontSimulator';
import { DocsModal } from '@/components/DocsModal';

export default function Home() {
  const [products, setProducts] = useState<Product[]>(CATALOG_PRODUCTS);
  const [pricingSettings, setPricingSettings] = useState<PricingSettings>(INITIAL_PRICING_SETTINGS);
  const [currentView, setCurrentView] = useState<AppView>('customizer');
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
    document.title = "Origin ‑ Product Customizer Studio";
    const linkId = 'inkybay-customizer-fonts';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Caveat:wght@600&family=Dancing+Script:wght@700&family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;600;700;900&family=Oswald:wght@500;700&family=Pacifico&family=Playfair+Display:ital,wght@0,600;1,600&family=Roboto:wght@400;500;700&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleUpdatePricing = (updatedPricing: PricingSettings) => {
    setPricingSettings(updatedPricing);
  };

  if (!mounted) {
    return (
      <div suppressHydrationWarning className="flex h-screen w-screen items-center justify-center bg-[#f1f2f4]">
        <div suppressHydrationWarning className="flex items-center gap-2 text-xs font-semibold text-zinc-600">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          Loading Origin Customizer...
        </div>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className="flex flex-col h-screen w-screen overflow-hidden bg-gradient-to-br from-[#f8f9fb] via-[#edf1f7] to-[#e4e9f2]">
      {/* Shopify Polaris App Header Bar */}
      <ShopifyPolarisHeader
        currentView={currentView}
        onSelectView={setCurrentView}
        onOpenHelp={() => setIsDocsOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 overflow-hidden relative">
        {currentView === 'customizer' && (
          <Studio
            products={products}
            initialPricingSettings={pricingSettings}
          />
        )}

        {currentView === 'storefront' && (
          <div className="h-full overflow-y-auto p-4 sm:p-8">
            <StorefrontSimulator
              product={products[0]}
              onLaunchCustomizer={() => setCurrentView('customizer')}
            />
          </div>
        )}

        {currentView === 'catalog' && (
          <div className="h-full overflow-y-auto p-4 sm:p-8 max-w-7xl mx-auto">
            <ProductManager
              products={products}
              onUpdateProduct={handleUpdateProduct}
            />
          </div>
        )}

        {currentView === 'pricing' && (
          <div className="h-full overflow-y-auto p-4 sm:p-8 max-w-7xl mx-auto">
            <PricingRulesManager
              pricingSettings={pricingSettings}
              onUpdatePricing={handleUpdatePricing}
            />
          </div>
        )}

        {currentView === 'orders' && (
          <div className="h-full overflow-y-auto p-4 sm:p-8 max-w-7xl mx-auto">
            <OrdersManager />
          </div>
        )}

        {currentView === 'integration' && (
          <div className="h-full overflow-y-auto p-4 sm:p-8 max-w-7xl mx-auto">
            <IntegrationGuide />
          </div>
        )}
      </main>

      {/* Architecture & Blueprint Guide Modal */}
      <DocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />
    </div>
  );
}
