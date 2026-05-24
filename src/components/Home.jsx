import { useFashionData } from "../hooks/useFashionData";
import BrandNavbar from "./Navbar";
import HeroSection from "./HeroSection";
import CollectionCarousel from "./CollectionCarousel";
import TrendingProducts from "./TrendingProducts";
import LookbookSection from "./LookbookSection";
import OfferBanner from "./OfferBanner";
import Newsletter from "./Newsletter";
import Footer from "./Footer";
import "./Home.css";

function Home() {
  const { data, loading, error } = useFashionData();

  if (loading) {
    return (
      <main className="site-shell loading-view">
        <div className="loader-ring" />
        <p>Curating the collection...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="site-shell loading-view">
        <p>Fashion API load aagala. Please refresh once.</p>
      </main>
    );
  }

  return (
    <div className="site-shell">
      <BrandNavbar brand={data.brand} navItems={data.navItems} />
      <HeroSection slides={data.heroSlides} stats={data.stats} />
      <CollectionCarousel collections={data.collections} />
      <TrendingProducts products={data.products} />
      <LookbookSection looks={data.lookbook} />
      <OfferBanner offer={data.offer} />
      <Newsletter />
      <Footer brand={data.brand} navItems={data.navItems} />
    </div>
  );
}

export default Home;
