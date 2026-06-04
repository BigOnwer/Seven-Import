
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import PromoBanner from "@/components/PromoBanner";
import Features from "@/components/Features";
import CategoryGrid from "@/components/CategoryGrid";
import Testimonials from "@/components/Testimonials";
import InstagramCTA from "@/components/InstagramCTA";
import Footer from "@/components/Footer";
import Products from "@/components/Products";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Marquee />
      <PromoBanner />
      <Features />
      <CategoryGrid />
      <Products />
      <Testimonials />
      <InstagramCTA />
      <Footer />
    </main>
  );
}
