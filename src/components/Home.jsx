import { useState, useEffect } from "react";
import "./Home.css";
import { Search, ShoppingBag, User, Heart, ArrowRight, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import logoImg from "../assets/logo.png";

const heroCards = [
    {
        title: "Sunset Amber",
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop",
        rotate: "-16deg",
        translateX: -100,
        zIndex: 11,
        color: "#ff8c00",
        price: "$189.00",
        desc: "Exquisite tailored sunset gown crafted from lightweight premium fabric."
    },
    {
        title: "Serene Blue",
        image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=800&auto=format&fit=crop",
        rotate: "-8deg",
        translateX: -50,
        zIndex: 12,
        color: "#00bfff",
        price: "$210.00",
        desc: "Double-faced stretch linen cerulean dress curving beautifully."
    },
    {
        title: "Rose Couture",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
        rotate: "0deg",
        translateX: 0,
        zIndex: 15,
        color: "#ff1493",
        price: "$195.00",
        desc: "Designed for urban explorers, featuring fluid high-fashion pink contours."
    },
    {
        title: "Emerald Silk",
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop",
        rotate: "8deg",
        translateX: 50,
        zIndex: 12,
        color: "#00fa9a",
        price: "$240.00",
        desc: "Sophisticated silk gown with clean stitches and modern elegant drape."
    },
    {
        title: "Midnight Velvet",
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop",
        rotate: "16deg",
        translateX: 100,
        zIndex: 11,
        color: "#8a2be2",
        price: "$299.00",
        desc: "French crepe organic black dress, accented with golden signature details."
    }
];

const featuredCollections = [
    { src: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop", label: "Luxury Dresses" },
    { src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop", label: "Summer Collection" },
    { src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop", label: "Modern Fashion" },
    { src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop", label: "Winter Couture" },
    { src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop", label: "Silk & Velvet" }
];

const trendingProducts = [
    {
        video: "https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-dress-posing-40019-large.mp4",
        poster: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop",
        name: "Luxury Silver Gown",
        price: "Rs 280",
        tag: "Exclusive"
    },
    {
        video: "https://assets.mixkit.co/videos/preview/mixkit-model-wearing-a-red-dress-and-posing-40026-large.mp4",
        poster: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
        name: "Valentino Red Dress",
        price: "Rs 320",
        tag: "Trending"
    },
    {
        video: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-posing-for-fashion-40012-large.mp4",
        poster: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop",
        name: "Glitter Cyber Gown",
        price: "RS 250",
        tag: "New Season"
    },
    {
        video: "https://assets.mixkit.co/videos/preview/mixkit-girl-posing-in-shiny-dress-under-blue-light-40018-large.mp4",
        poster: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop",
        name: "Liquid Metal Dress",
        price: "RS 190",
        tag: "Limited"
    },
    {
        video: "https://assets.mixkit.co/videos/preview/mixkit-woman-posing-in-yellow-sports-bra-and-pants-40015-large.mp4",
        poster: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop",
        name: "Sunburst Silk Suit",
        price: "Rs 210",
        tag: "Summer 26"
    }
];

function Home() {
    const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
    const [featuredIndex, setFeaturedIndex] = useState(0);
    const [productsIndex, setProductsIndex] = useState(0);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (width > 900 && mobileMenuOpen) {
            setMobileMenuOpen(false);
        }
    }, [width, mobileMenuOpen]);

    const getVisibleCards = () => {
        if (width > 1024) return 3;
        if (width > 700) return 2;
        return 1;
    };

    const visibleCards = getVisibleCards();

    useEffect(() => {
        const maxFeatured = Math.max(0, featuredCollections.length - visibleCards);
        if (featuredIndex > maxFeatured) {
            setFeaturedIndex(maxFeatured);
        }
        const maxProducts = Math.max(0, trendingProducts.length - visibleCards);
        if (productsIndex > maxProducts) {
            setProductsIndex(maxProducts);
        }
    }, [visibleCards]);

    const nextFeatured = () => {
        setFeaturedIndex(prev => Math.min(prev + 1, featuredCollections.length - visibleCards));
    };

    const prevFeatured = () => {
        setFeaturedIndex(prev => Math.max(prev - 1, 0));
    };

    const nextProducts = () => {
        setProductsIndex(prev => Math.min(prev + 1, trendingProducts.length - visibleCards));
    };

    const prevProducts = () => {
        setProductsIndex(prev => Math.max(prev - 1, 0));
    };

    const getCardStyle = (card, index) => {
        const isHovered = hoveredCard === index;
        const compact = width <= 900;
        const shrink = width <= 900 ? 0.42 : width <= 1024 ? 0.65 : 1;
        const baseX = card.translateX * shrink;
        let x = baseX;
        let r = parseFloat(card.rotate) * (compact ? 0.7 : 1);
        let z = card.zIndex;
        let s = 1;

        if (hoveredCard !== null) {
            if (isHovered) {
                x = baseX * 0.35;
                r = 0;
                z = 30;
                s = compact ? 1.15 : 1.25;
            } else if (index < hoveredCard) {
                x = baseX - (compact ? 28 : 70);
                r = r - 12;
                z = card.zIndex - 2;
                s = 0.88;
            } else {
                x = baseX + (compact ? 28 : 70);
                r = r + 12;
                z = card.zIndex - 2;
                s = 0.88;
            }
        }

        return {
            transform: `translateX(${x}px) rotate(${r}deg) scale(${s})`,
            zIndex: z,
            transition: "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), z-index 0.5s",
        };
    };

    return (
        <div className="home">

            {/* Background blobs — fixed, never clipping content */}
            <div className="blob blob1" />
            <div className="blob blob2" />
            <div className="blob blob3" />

            {/* ── NAVBAR ─────────────────────────────── */}
            <nav className="navbar glass">
                <div className="logo-container">
                    <img src={logoImg} alt="Women's Style" className="logo-img" />
                    <span className="logo-text">Women's Style</span>
                </div>
                <ul className="nav-links">
                    <li>Home</li>
                    <li>Collections</li>
                    <li>Trending</li>
                    <li>New</li>
                    <li>Contact</li>
                </ul>
                <div className="nav-icons">
                    <Search size={20} />
                    <Heart size={20} />
                    <User size={20} />
                    <ShoppingBag size={20} />
                    <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle Menu">
                        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Dropdown Drawer */}
            {mobileMenuOpen && (
                <div className="mobile-menu glass animate-slide-down">
                    <ul className="mobile-nav-links">
                        <li onClick={() => setMobileMenuOpen(false)}>Home</li>
                        <li onClick={() => setMobileMenuOpen(false)}>Collections</li>
                        <li onClick={() => setMobileMenuOpen(false)}>Trending</li>
                        <li onClick={() => setMobileMenuOpen(false)}>New</li>
                        <li onClick={() => setMobileMenuOpen(false)}>Contact</li>
                    </ul>
                </div>
            )}

            {/* ── HERO SECTION ───────────────────────── */}
            <section className="hero">
                <div className="hero-left glass">
                    <span className="tag">2026 Fashion Collection</span>
                    <h1>Stunning<br />Fashion For<br />Modern Women</h1>
                    <p>Discover luxury dresses with premium aesthetic animations and modern UI.</p>
                    <button className="shop-btn">
                        Shop Now <ArrowRight size={18} />
                    </button>
                </div>
                <div className="hero-right">
                    <div className="hero-right-deck">
                        {heroCards.map((card, idx) => (
                            <div
                                key={card.title}
                                className={`hero-fashion-card ${hoveredCard === idx ? "hovered" : ""}`}
                                style={getCardStyle(card, idx)}
                                onMouseEnter={() => setHoveredCard(idx)}
                                onMouseLeave={() => setHoveredCard(null)}
                                onClick={() => setSelectedCard(card)}
                            >
                                <div className="hero-card-inner glass">
                                    <img src={card.image} alt={card.title} className="hero-card-img" />
                                    <div className="hero-card-glow" style={{ background: `radial-gradient(circle, ${card.color}44 0%, transparent 70%)` }} />
                                    <div className="hero-card-badge">{card.price}</div>
                                    <div className="hero-card-info">
                                        <h4>{card.title}</h4>
                                        <p>Luxury Couture</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FEATURED COLLECTIONS CAROUSEL ──────── */}
            <section className="featured-section">
                <div className="section-header-wrap">
                    <h2 className="section-heading">Featured Collections</h2>
                    <div className="carousel-controls">
                        <button
                            className={`control-arrow ${featuredIndex === 0 ? "disabled" : ""}`}
                            onClick={prevFeatured}
                            aria-label="Previous Slide"
                        >
                            <ChevronLeft size={22} />
                        </button>
                        <button
                            className={`control-arrow ${featuredIndex >= featuredCollections.length - visibleCards ? "disabled" : ""}`}
                            onClick={nextFeatured}
                            aria-label="Next Slide"
                        >
                            <ChevronRight size={22} />
                        </button>
                    </div>
                </div>

                <div className="carousel-outer">
                    <div
                        className="carousel-track"
                        style={{
                            transform: `translateX(-${featuredIndex * (100 / visibleCards)}%)`,
                            "--visible-cards": visibleCards
                        }}
                    >
                        {featuredCollections.map(({ src, label }, idx) => (
                            <div
                                className={`carousel-slide ${idx >= featuredIndex && idx < featuredIndex + visibleCards ? "active-slide" : "hidden-slide"}`}
                                key={label}
                            >
                                <div className="feature-card">
                                    <img src={src} alt={label} />
                                    <div className="feature-overlay">
                                        <h3>{label}</h3>
                                        <span className="feature-arrow">→</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="carousel-indicators">
                    {Array.from({ length: featuredCollections.length - visibleCards + 1 }).map((_, dotIdx) => (
                        <span
                            key={dotIdx}
                            className={`carousel-dot ${featuredIndex === dotIdx ? "active" : ""}`}
                            onClick={() => setFeaturedIndex(dotIdx)}
                        />
                    ))}
                </div>
            </section>

            {/* ── TRENDING PRODUCTS ANIMATED VIDEO CAROUSEL ── */}
            <section className="products-section">
                <div className="section-header-wrap">
                    <h2 className="section-heading">Trending Products</h2>
                    <div className="carousel-controls">
                        <button
                            className={`control-arrow ${productsIndex === 0 ? "disabled" : ""}`}
                            onClick={prevProducts}
                            aria-label="Previous Slide"
                        >
                            <ChevronLeft size={22} />
                        </button>
                        <button
                            className={`control-arrow ${productsIndex >= trendingProducts.length - visibleCards ? "disabled" : ""}`}
                            onClick={nextProducts}
                            aria-label="Next Slide"
                        >
                            <ChevronRight size={22} />
                        </button>
                    </div>
                </div>

                <div className="carousel-outer">
                    <div
                        className="carousel-track"
                        style={{
                            transform: `translateX(-${productsIndex * (100 / visibleCards)}%)`,
                            "--visible-cards": visibleCards
                        }}
                    >
                        {trendingProducts.map((product, idx) => (
                            <div
                                className={`carousel-slide ${idx >= productsIndex && idx < productsIndex + visibleCards ? "active-slide" : "hidden-slide"}`}
                                key={product.name}
                            >
                                <div className="product-card">
                                    <div className="product-img-wrap">
                                        <video
                                            src={product.video}
                                            poster={product.poster}
                                            muted
                                            loop
                                            playsInline
                                            autoPlay
                                            className="product-video"
                                        />
                                        <div className="product-badge">{product.tag}</div>
                                    </div>
                                    <div className="product-content">
                                        <h3>{product.name}</h3>
                                        <p className="price">{product.price}</p>
                                        <button className="buy-btn" onClick={() => alert(`Stunning Gown! Added ${product.name} to shopping bag.`)}>
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="carousel-indicators">
                    {Array.from({ length: trendingProducts.length - visibleCards + 1 }).map((_, dotIdx) => (
                        <span
                            key={dotIdx}
                            className={`carousel-dot ${productsIndex === dotIdx ? "active" : ""}`}
                            onClick={() => setProductsIndex(dotIdx)}
                        />
                    ))}
                </div>
            </section>

            {/* ── OFFER BANNER ───────────────────────── */}
            <section className="offer-banner">
                <div className="offer-content glass">
                    <div className="offer-tag">Limited Time</div>
                    <h1 className="offer-num">50% OFF</h1>
                    <p>Explore the newest luxury fashion styles with premium aesthetics.</p>
                    <button className="offer-btn">Explore Collection</button>
                </div>
            </section>

            {/* ── NEWSLETTER ─────────────────────────── */}
            <section className="newsletter glass">
                <div className="newsletter-inner">
                    <div className="nl-icon">✉</div>
                    <h2>Join Our Fashion Newsletter</h2>
                    <p>Get updates about premium collections and exclusive offers.</p>
                    <div className="newsletter-box">
                        <input type="email" placeholder="Enter your email address" />
                        <button className="nl-btn">Subscribe</button>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ─────────────────────────────── */}
            <footer className="footer">
                <div className="footer-logo-container">
                    <img src={logoImg} alt="Women's Style" className="logo-img-footer" />
                    <span className="footer-logo-text">Women's Style</span>
                </div>
                <p className="footer-sub">Premium animated fashion experience.</p>
                <div className="footer-links">
                    <a href="#">Home</a>
                    <a href="#">Collections</a>
                    <a href="#">Trending</a>
                    <a href="#">Contact</a>
                </div>
                <div className="footer-bottom">© 2026 Women's Style. All rights reserved.</div>
            </footer>

            {/* ── BOUTIQUE DETAIL MODAL DRAWER ──────── */}
            {selectedCard && (
                <div className="modal-overlay" onClick={() => setSelectedCard(null)}>
                    <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedCard(null)}>×</button>
                        <div className="modal-body">
                            <div className="modal-img-wrap">
                                <img src={selectedCard.image} alt={selectedCard.title} />
                            </div>
                            <div className="modal-info">
                                <span className="modal-tag">Exclusive Edition</span>
                                <h2>{selectedCard.title}</h2>
                                <p className="modal-price">{selectedCard.price}</p>
                                <p className="modal-desc">{selectedCard.desc}</p>
                                <div className="modal-size-selector">
                                    <span>Size</span>
                                    <div className="sizes-row">
                                        {["XS", "S", "M", "L", "XL"].map(sz => (
                                            <button key={sz} className="size-btn">{sz}</button>
                                        ))}
                                    </div>
                                </div>
                                <button className="modal-buy-btn" onClick={() => alert(`Stunning Choice! Added ${selectedCard.title} to shopping bag.`)}>
                                    Add to Bag
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Home;