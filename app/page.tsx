
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import PromoBanner from "@/components/PromoBanner";
import Features from "@/components/Features";
import CategoryGrid from "@/components/CategoryGrid";
import Products from "@/components/Products";
import Testimonials from "@/components/Testimonials";
import InstagramCTA from "@/components/InstagramCTA";
import Footer from "@/components/Footer";
import { ProductList } from "@/components/ProductList";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

initMercadoPago(process.env.MERCADO_PAGO_PUBLIC_TOKEN!, {locale: 'pt-BR'})

export default function Home() {
  
  const customization = {
      theme:'dark',
      valueProp: 'practicality',
      customStyle: {
          valuePropColor: 'black',
          buttonHeight: '48px',
          borderRadius: '10px',
          verticalPadding: '10px',
          horizontalPadding: '10px',
      }
  };
  return (
    <main>
      <Navbar />
      <Hero />
      <Marquee />
      <PromoBanner />
      <Features />
      <CategoryGrid />
      <ProductList />
      <Testimonials />
      <InstagramCTA />
      <Footer />
    </main>
  );
}
