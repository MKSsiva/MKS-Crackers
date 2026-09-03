import { useEffect, useState } from "react";

import Header from "../components/Header";
import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import ProductSection from "../components/ProductSection";
import PromoBanner from "../components/PromoBanner";
import Footer from "../components/Footer";

import {
  getHomepageFeatures,
  getHomepageHero,
} from "../services/api";

const Home = () => {
  // =====================================================
  // HERO
  // =====================================================

  const [hero, setHero] = useState(null);
  const [heroLoading, setHeroLoading] = useState(true);
  const [heroError, setHeroError] = useState(false);

  // =====================================================
  // HOMEPAGE FEATURES
  // =====================================================

  const [features, setFeatures] = useState([]);
  const [featuresLoading, setFeaturesLoading] =
    useState(true);
  const [featuresError, setFeaturesError] =
    useState(false);

  // =====================================================
  // LOAD HOMEPAGE DATA
  // =====================================================

  useEffect(() => {
    const loadHomepage = async () => {
      try {
        setHeroLoading(true);
        setFeaturesLoading(true);

        setHeroError(false);
        setFeaturesError(false);

        const [heroData, featuresData] =
          await Promise.all([
            getHomepageHero(),
            getHomepageFeatures(),
          ]);

        // -----------------------------
        // Hero
        // -----------------------------

        if (heroData.success && heroData.hero) {
          setHero(heroData.hero);
        } else {
          setHero(null);
          setHeroError(true);
        }

        // -----------------------------
        // Features
        // -----------------------------

        if (
          featuresData.success &&
          Array.isArray(featuresData.features)
        ) {
          setFeatures(featuresData.features);
        } else {
          setFeatures([]);
          setFeaturesError(true);
        }
      } catch (error) {
        console.error(
          "Failed to load homepage:",
          error
        );

        setHero(null);
        setFeatures([]);

        setHeroError(true);
        setFeaturesError(true);
      } finally {
        setHeroLoading(false);
        setFeaturesLoading(false);
      }
    };

    loadHomepage();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* =================================================
            HERO
        ================================================= */}

        <Hero
          hero={hero}
          features={features}
          loading={
            heroLoading || featuresLoading
          }
          error={
            heroError || featuresError
          }
        />

        {/* =================================================
            CATEGORIES
        ================================================= */}

        <CategorySection />

        {/* =================================================
            PRODUCTS
        ================================================= */}

        <ProductSection />

        {/* =================================================
            PROMOTIONAL BANNER
        ================================================= */}

        <PromoBanner />
      </main>

      <Footer />
    </div>
  );
};

export default Home;