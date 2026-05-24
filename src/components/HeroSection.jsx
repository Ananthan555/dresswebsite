import { ArrowRight, Sparkles } from "lucide-react";
import Carousel from "bootstrap/js/dist/carousel";
import { useEffect } from "react";

function HeroSection({ slides }) {
  useEffect(() => {
    const carouselElement = document.getElementById("heroFashionCarousel");

    if (!carouselElement) {
      return undefined;
    }

    const carousel = Carousel.getOrCreateInstance(carouselElement, {
      interval: 2400,
      pause: false,
      ride: "carousel",
      touch: true,
      wrap: true,
    });

    carousel.cycle();

    return () => {
      carousel.dispose();
    };
  }, []);

  const getMediaUrl = (url) => {
    if (!url || url.startsWith("http")) {
      return url;
    }

    return `${import.meta.env.BASE_URL}${url}`;
  };

  return (
    <section className="hero-section" id="home">
      <div className="hero-carousel-wrap">
        <div
          id="heroFashionCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
          data-bs-touch="true"
          data-bs-pause="false"
          data-bs-wrap="true"
          data-bs-interval="2400"
        >
          <div className="carousel-indicators">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                data-bs-target="#heroFashionCarousel"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-current={index === 0 ? "true" : undefined}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="carousel-inner">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`carousel-item hero-motion-item ${index === 0 ? "active" : ""}`}
              >
                {slide.video ? (
                  <video
                    className="d-block w-100 hero-video"
                    poster={slide.image}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label={slide.title}
                  >
                    <source src={getMediaUrl(slide.video)} type="video/mp4" />
                    <img src={slide.image} alt={slide.title} />
                  </video>
                ) : (
                  <img src={slide.image} className="d-block w-100" alt={slide.title} />
                )}
                <div className="hero-film-layer" />
                <div className="hero-brand-frame">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="hero-space-copy">
                  <span className="space-kicker">
                    <Sparkles size={16} />
                    New ethnic collection
                  </span>
                  <h1>Welcome to Women's Style</h1>
                  <p>
                    Discover college-ready kurtis, graceful churidar sets, sarees,
                    and festive Indian wear crafted with boutique elegance.
                  </p>
                  <a className="space-explore-btn" href="#collections">
                    Explore Now <ArrowRight size={18} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#heroFashionCarousel"
            data-bs-slide="prev"
            aria-label="Previous hero slide"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#heroFashionCarousel"
            data-bs-slide="next"
            aria-label="Next hero slide"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
