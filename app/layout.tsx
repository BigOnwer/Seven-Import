import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cartContext";
import { WishlistProvider } from "@/lib/wishlistContext";
import { ToastProvider } from "@/components/ui/Toast";
import CartDrawer from "@/components/ui/CartDrawer";
import FloatingButtons from "@/components/ui/FloatingButtons";
import CookieBanner from "@/components/ui/CookieBanner";

export const metadata: Metadata = {
  title: "Seven Import BR — Sneakers Premium",
  description: "Quem vive de verdade usa Seven. Tênis premium importados com envio para todo o Brasil.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;500;600;700;900&family=Barlow:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
          <WishlistProvider>
            <CartProvider>
              <ToastProvider>
                {children}
                <CartDrawer />
                <FloatingButtons />
                <CookieBanner />
              </ToastProvider>
            </CartProvider>
          </WishlistProvider>
      </body>
    </html>
  );
}
