import { useFashionData } from "../hooks/useFashionData";
import { useEffect, useMemo, useState } from "react";
import BrandNavbar from "./Navbar";
import AuthModal from "./AuthModal";
import HeroSection from "./HeroSection";
import CollectionCarousel from "./CollectionCarousel";
import TrendingProducts from "./TrendingProducts";
import EarringsSection from "./EarringsSection";
import LookbookSection from "./LookbookSection";
import OfferBanner from "./OfferBanner";
import Newsletter from "./Newsletter";
import Footer from "./Footer";
import ProductPage from "./ProductPage";
import "./Home.css";

const extraTrendingProducts = [
  {
    id: 306,
    name: "Ivory Cotton Kurti",
    category: "Cotton kurti",
    badge: "Fresh",
    price: "Rs 799",
    image: "https://images.pexels.com/photos/26973350/pexels-photo-26973350.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: 307,
    name: "Emerald Festive Suit",
    category: "Trending wear",
    badge: "Hot",
    price: "Rs 999",
    image: "https://images.pexels.com/photos/12752064/pexels-photo-12752064.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: 308,
    name: "Mustard Printed Top",
    category: "Stylish top",
    badge: "New",
    price: "Rs 899",
    image: "https://images.pexels.com/photos/13584944/pexels-photo-13584944.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: 309,
    name: "Blue Campus Kurti",
    category: "College wear",
    badge: "Limited",
    price: "Rs 1,299",
    image: "https://images.unsplash.com/photo-1632826727346-43a7ac6bcb1b?auto=format&fit=crop&q=80&w=900",
  },
];

const earringProducts = [
  {
    id: 501,
    name: "Gold Jhumka Earrings",
    category: "Jhumka",
    badge: "Best seller",
    price: "Rs 499",
    image: "https://images.pexels.com/photos/7016794/pexels-photo-7016794.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: 502,
    name: "Pearl Hoop Earrings",
    category: "Hoops",
    badge: "New",
    price: "Rs 399",
    image: "https://images.pexels.com/photos/2422291/pexels-photo-2422291.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: 503,
    name: "Stone Drop Earrings",
    category: "Drop & dangle",
    badge: "Trending",
    price: "Rs 599",
    image: "https://images.pexels.com/photos/4584443/pexels-photo-4584443.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: 504,
    name: "Diamond Stud Earrings",
    category: "Studs",
    badge: "Hot",
    price: "Rs 349",
    image: "https://images.pexels.com/photos/30442521/pexels-photo-30442521.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: 505,
    name: "Chandbali Earrings",
    category: "Chandbali",
    badge: "Limited",
    price: "Rs 529",
    image: "https://images.pexels.com/photos/14811629/pexels-photo-14811629.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: 506,
    name: "Oxidised Dangle Earrings",
    category: "Drop & dangle",
    badge: "Fresh",
    price: "Rs 279",
    image: "https://images.pexels.com/photos/16439628/pexels-photo-16439628.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: 507,
    name: "Kundan Jhumka",
    category: "Jhumka",
    badge: "Premium",
    price: "Rs 599",
    image: "https://images.pexels.com/photos/18678165/pexels-photo-18678165.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: 508,
    name: "Gold Hoop Earrings",
    category: "Hoops",
    badge: "Classic",
    price: "Rs 449",
    image: "https://images.pexels.com/photos/2422291/pexels-photo-2422291.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
];

function Home() {
  const { data, loading, error } = useFashionData();
  const [view, setView] = useState("home");
  const [likedItems, setLikedItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login");
  const [pendingAction, setPendingAction] = useState(null);
  const [lastCartTarget, setLastCartTarget] = useState({ view: "home", target: "#trending" });

  useEffect(() => {
    const savedUser = window.localStorage.getItem("dress_website_user");
    if (savedUser) {
      setAuthUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (authUser) {
      window.localStorage.setItem("dress_website_user", JSON.stringify(authUser));
    } else {
      window.localStorage.removeItem("dress_website_user");
    }
  }, [authUser]);

  const allTrendingProducts = useMemo(() => {
    if (!data?.products) {
      return [];
    }

    return [...data.products, ...extraTrendingProducts];
  }, [data]);

  const navigate = (nextView, target) => {
    if (nextView === "cart" && !authUser) {
      setPendingAction(null);
      setAuthModalMode("login");
      setAuthModalOpen(true);
      return;
    }

    setView(nextView);
    if (target) {
      window.setTimeout(() => {
        document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleLike = (product) => {
    setLikedItems((items) => (
      items.some((item) => item.id === product.id)
        ? items.filter((item) => item.id !== product.id)
        : [...items, product]
    ));
  };

  const addToCart = (product, returnTarget = { view: "home", target: "#trending" }) => {
    setLastCartTarget(returnTarget);
    setCartItems((items) => {
      const existingItem = items.find((item) => item.id === product.id);

      if (existingItem) {
        return items.map((item) => (
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1, returnTarget }
            : item
        ));
      }

      return [...items, { ...product, quantity: 1, returnTarget }];
    });
  };

  const removeFromCart = (product) => {
    setCartItems((items) => items.filter((item) => item.id !== product.id));
  };

  const updateCartQuantity = (product, nextQuantity) => {
    if (nextQuantity < 1) {
      removeFromCart(product);
      return;
    }

    setCartItems((items) => items.map((item) => (
      item.id === product.id ? { ...item, quantity: nextQuantity } : item
    )));
  };

  const continueShopping = () => {
    navigate(lastCartTarget.view, lastCartTarget.target);
  };

  const handleAuthSuccess = (user) => {
    setAuthUser(user);
    setAuthModalOpen(false);

    if (!pendingAction) {
      return;
    }

    if (pendingAction.type === "addToCart") {
      addToCart(pendingAction.product, pendingAction.returnTarget);
      setView("cart");
    }

    if (pendingAction.type === "like") {
      toggleLike(pendingAction.product);
    }

    setPendingAction(null);
  };

  const handleAddToCart = (product, returnTarget = { view: "home", target: "#trending" }) => {
    if (!authUser) {
      setPendingAction({ type: "addToCart", product, returnTarget });
      setAuthModalMode("login");
      setAuthModalOpen(true);
      return;
    }

    addToCart(product, returnTarget);
  };

  const handleLike = (product) => {
    if (!authUser) {
      setPendingAction({ type: "like", product });
      setAuthModalMode("login");
      setAuthModalOpen(true);
      return;
    }

    toggleLike(product);
  };

  const handleAccountClick = () => {
    setAuthModalMode("login");
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    setAuthUser(null);
    setPendingAction(null);
    setView("home");
  };

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
      <BrandNavbar
        brand={data.brand}
        navItems={data.navItems}
        onNavigate={navigate}
        likedCount={likedItems.length}
        cartCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
        authUser={authUser}
        onAccount={handleAccountClick}
        onLogout={handleLogout}
      />
      {view === "home" && (
        <>
          <HeroSection slides={data.heroSlides} stats={data.stats} />
          <CollectionCarousel collections={data.collections} />
          <TrendingProducts
            products={data.products}
            likedItems={likedItems}
            onLike={handleLike}
            onAddToCart={(product) => handleAddToCart(product, { view: "home", target: "#trending" })}
            onSeeAll={() => navigate("trending")}
          />
          <EarringsSection
            products={earringProducts.slice(0, 5)}
            likedItems={likedItems}
            onLike={handleLike}
            onAddToCart={(product) => handleAddToCart(product, { view: "home", target: "#earrings" })}
            onShowMore={() => navigate("earrings")}
          />
          <LookbookSection looks={data.lookbook} />
          <OfferBanner offer={data.offer} />
          <Newsletter />
        </>
      )}
      {view === "trending" && (
        <ProductPage
          eyebrow="All trending"
          title="All trending styles"
          products={allTrendingProducts}
          likedItems={likedItems}
          onLike={handleLike}
          onAddToCart={(product) => handleAddToCart(product, { view: "trending" })}
          onBack={() => navigate("home")}
        />
      )}
      {view === "earrings" && (
        <ProductPage
          eyebrow="More earrings"
          title="Earrings for every women's look"
          products={earringProducts}
          likedItems={likedItems}
          onLike={handleLike}
          onAddToCart={(product) => handleAddToCart(product, { view: "earrings" })}
          onBack={() => navigate("home")}
        />
      )}
      {view === "likes" && (
        <ProductPage
          eyebrow="My likes"
          title="Your liked styles"
          products={likedItems}
          likedItems={likedItems}
          onLike={handleLike}
          onAddToCart={(product) => handleAddToCart(product, { view: "likes" })}
          onRemoveFromLike={(product) => toggleLike(product)}
          isLikesView
          onBack={() => navigate("home")}
        />
      )}
      {view === "cart" && (
        <ProductPage
          eyebrow="My cart"
          title="Your cart items"
          products={cartItems}
          likedItems={likedItems}
          onLike={handleLike}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={removeFromCart}
          onUpdateCartQuantity={updateCartQuantity}
          isCartView
          onBack={continueShopping}
        />
      )}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />
      <Footer brand={data.brand} navItems={data.navItems} />
    </div>
  );
}

export default Home;
