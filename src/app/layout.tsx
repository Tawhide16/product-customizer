import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://product-customizer.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Origin | Universal Product Customization Studio",
  description:
    "Design and personalize custom apparel, hoodies, iPhone cases, bags, and products in real time with instant print-ready vector generation.",
  applicationName: "Origin Studio",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Origin Studio",
    title: "Origin | Universal Product Customization Studio",
    description:
      "Design and personalize custom apparel, hoodies, iPhone cases, bags, and products in real time with instant print-ready vector generation.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Origin Logo",
        type: "image/jpeg",
      },
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Origin Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Origin | Universal Product Customization Studio",
    description:
      "Design and personalize custom apparel, hoodies, iPhone cases, bags, and products in real time with instant print-ready vector generation.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // 1. Filter out console errors triggered by extension attributes like bis_skin_checked
                const origError = console.error;
                console.error = function(...args) {
                  if (args.some(arg => typeof arg === 'string' && (arg.includes('bis_skin_checked') || (arg.includes('hydration-mismatch') && arg.includes('bis_'))))) {
                    return;
                  }
                  origError.apply(console, args);
                };

                // 2. Automatically strip bis_skin_checked before React hydration inspects the DOM
                const stripBis = () => {
                  try {
                    const elements = document.querySelectorAll('[bis_skin_checked]');
                    for (let i = 0; i < elements.length; i++) {
                      elements[i].removeAttribute('bis_skin_checked');
                    }
                  } catch (e) {}
                };

                stripBis();
                if (window.MutationObserver) {
                  const observer = new MutationObserver(mutations => {
                    for (const m of mutations) {
                      if (m.type === 'attributes' && m.attributeName === 'bis_skin_checked') {
                        m.target.removeAttribute('bis_skin_checked');
                      }
                    }
                  });
                  observer.observe(document.documentElement, {
                    attributes: true,
                    subtree: true,
                    attributeFilter: ['bis_skin_checked']
                  });
                  window.addEventListener('DOMContentLoaded', () => {
                    stripBis();
                    setTimeout(() => observer.disconnect(), 3000);
                  });
                }
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
