import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Working } from "@/components/Working-flow";
import { Footer } from "@/components/Footer";



export default function Home() {
  return (
    <div className="min-h-screen bg-background">
    <Header />
    <main>
      <Hero />
      <Features />
      <Working />
    </main>
    <Footer />
  </div>
  );
}
