import { ArrowRight } from "lucide-react";

function CollectionCarousel({ collections }) {
  return (
    <section className="section-block" id="collections">
      <div className="section-heading">
        <span>Curated edits</span>
        <h2>Collections made to scroll, save, and style.</h2>
      </div>

      <div
        id="collectionCarousel"
        className="carousel slide collection-carousel"
        data-bs-ride="carousel"
        data-bs-interval="6200"
      >
        <div className="carousel-inner">
          {collections.map((collection, index) => (
            <div
              key={collection.id}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <article className="collection-slide">
                <img src={collection.image} alt={collection.title} />
                <div className="collection-info">
                  <span>{collection.count} styles</span>
                  <h3>{collection.title}</h3>
                  <p>{collection.description}</p>
                  <a href="#trending">
                    Explore <ArrowRight size={17} />
                  </a>
                </div>
              </article>
            </div>
          ))}
        </div>

        <button
          className="carousel-control-prev collection-control"
          type="button"
          data-bs-target="#collectionCarousel"
          data-bs-slide="prev"
          aria-label="Previous collection"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true" />
        </button>
        <button
          className="carousel-control-next collection-control"
          type="button"
          data-bs-target="#collectionCarousel"
          data-bs-slide="next"
          aria-label="Next collection"
        >
          <span className="carousel-control-next-icon" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

export default CollectionCarousel;
