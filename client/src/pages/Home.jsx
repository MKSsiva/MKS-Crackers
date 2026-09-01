import Header from "../components/Header";
import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import ProductSection from "../components/ProductSection";
import PromoBanner from "../components/PromoBanner";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">

      <Header />

      <main>
        <Hero />

        <CategorySection />

        <ProductSection />

        <PromoBanner />
      </main>

      <Footer />

    </div>
  );
};

export default Home;