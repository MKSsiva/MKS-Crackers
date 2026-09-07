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
  getHomepagePromo,
} from "../services/api";

const Home = () => {
  const [hero, setHero] = useState(null);
  const [heroLoading, setHeroLoading] = useState(true);
  const [heroError, setHeroError] = useState(false);

  const [features, setFeatures] = useState([]);
  const [featuresLoading, setFeaturesLoading] = useState(true);
  const [featuresError, setFeaturesError] = useState(false);

  const [promo, setPromo] = useState(null);
  const [promoLoading, setPromoLoading] = useState(true);
  const [promoError, setPromoError] = useState(false);

  useEffect(() => {
    const loadHomepage = async () => {
      try {
        setHeroLoading(true);
        setFeaturesLoading(true);
        setPromoLoading(true);

        setHeroError(false);
        setFeaturesError(false);
        setPromoError(false);

        const [
          heroData,
          featuresData,
          promoData,
        ] = await Promise.all([
          getHomepageHero(),
          getHomepageFeatures(),
          getHomepagePromo(),
        ]);

        // =============================================
        // HERO
        // =============================================

        if (heroData.success && heroData.hero) {
          setHero(heroData.hero);
        } else {
          setHero(null);
          setHeroError(true);
        }

        // =============================================
        // HOMEPAGE FEATURES
        // =============================================

        if (
          featuresData.success &&
          Array.isArray(featuresData.features)
        ) {
          setFeatures(featuresData.features);
        } else {
          setFeatures([]);
          setFeaturesError(true);
        }

        // =============================================
        // PROMO BANNER
        // =============================================

        if (
          promoData.success &&
          promoData.promo
        ) {
          setPromo(promoData.promo);
        } else {
          setPromo(null);
          setPromoError(true);
        }
      } catch (error) {
        console.error(
          "Failed to load homepage:",
          error
        );

        setHero(null);
        setFeatures([]);
        setPromo(null);

        setHeroError(true);
        setFeaturesError(true);
        setPromoError(true);
      } finally {
        setHeroLoading(false);
        setFeaturesLoading(false);
        setPromoLoading(false);
      }
    };

    loadHomepage();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* =========================================
            HERO
        ========================================= */}

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

        {/* =========================================
            CATEGORIES
        ========================================= */}

        <CategorySection />

        {/* =========================================
            PRODUCTS
        ========================================= */}

        <ProductSection />

        {/* =========================================
            PROMO BANNER
        ========================================= */}

        <PromoBanner
          promo={promo}
          loading={promoLoading}
          error={promoError}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Home;

