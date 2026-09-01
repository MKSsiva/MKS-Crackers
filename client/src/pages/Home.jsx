import { useEffect, useState } from "react";

import Header from "../components/Header";
import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import ProductSection from "../components/ProductSection";
import PromoBanner from "../components/PromoBanner";
import Footer from "../components/Footer";

import { getHomepageFeatures } from "../services/api";

const Home = () => {
  const [features, setFeatures] = useState([]);
  const [featuresLoading, setFeaturesLoading] = useState(true);
  const [featuresError, setFeaturesError] = useState(false);

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        setFeaturesLoading(true);
        setFeaturesError(false);

        const data = await getHomepageFeatures();

        if (data.success) {
          setFeatures(data.features || []);
        } else {
          setFeatures([]);
          setFeaturesError(true);
        }
      } catch (error) {
        console.error(
          "Failed to load homepage features:",
          error
        );

        setFeatures([]);
        setFeaturesError(true);
      } finally {
        setFeaturesLoading(false);
      }
    };

    loadFeatures();
  }, []);

  return (
    <div className="min-h-screen bg-white">

      <Header />

      <main>

        {/* Hero + Dynamic Homepage Features */}
        <Hero
          features={features}
          loading={featuresLoading}
          error={featuresError}
        />

        {/* Categories */}
        <CategorySection />

        {/* Products */}
        <ProductSection />

        {/* Promotional Banner */}
        <PromoBanner />

      </main>

      <Footer />

    </div>
  );
};

export default Home;