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
    let cancelled = false;

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

        if (cancelled) return;

        // =============================================
        // HERO CONTENT
        // =============================================

        if (heroData?.success && heroData.hero) {
          setHero(heroData.hero);
        } else {
          setHero(null);
          setHeroError(true);
        }

        // =============================================
        // HOMEPAGE FEATURES
        // =============================================

        if (
          featuresData?.success &&
          Array.isArray(featuresData.features)
        ) {
          setFeatures(featuresData.features);
        } else {
          setFeatures([]);
          setFeaturesError(true);
        }

        // =============================================
        // PROMOTIONAL BANNER
        // =============================================

        if (promoData?.success && promoData.promo) {
          setPromo(promoData.promo);
        } else {
          setPromo(null);
          setPromoError(true);
        }

      } catch (error) {
        console.error("Failed to load homepage:", error);

        if (!cancelled) {
          setHero(null);
          setFeatures([]);
          setPromo(null);

          setHeroError(true);
          setFeaturesError(true);
          setPromoError(true);
        }

      } finally {
        if (!cancelled) {
          setHeroLoading(false);
          setFeaturesLoading(false);
          setPromoLoading(false);
        }
      }
    };

    loadHomepage();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#080d20]">

      {/* HEADER */}

      <Header />

      <main className="mks-landing">

        {/* =========================================
            STEP 2: PREMIUM 3D HERO
        ========================================= */}

        <Hero
          hero={hero}
          features={features}
          loading={heroLoading || featuresLoading}
          error={heroError || featuresError}
        />

        {/* =========================================
            STEP 3: 3D CATEGORY SHOWCASE
        ========================================= */}

        <CategorySection />

        {/* =========================================
            STEP 4: 3D PRODUCT SHOWCASE
        ========================================= */}

        <ProductSection />

        {/* =========================================
            STEP 5: PREMIUM PROMOTIONAL BANNER
        ========================================= */}

        <PromoBanner
          promo={promo}
          loading={promoLoading}
          error={promoError}
        />

      </main>

      {/* STEP 6: PREMIUM FOOTER */}

      <Footer />

    </div>
  );
};

export default Home;
