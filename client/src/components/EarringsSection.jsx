import { ProductCard } from "./TrendingProducts";

function EarringsSection({ products, likedItems, onLike, onAddToCart, onShowMore }) {
  return (
    <section className="section-block product-section" id="earrings">
      <div className="section-heading">
        <span>Earring edit</span>
        <h2>Statement earrings styled for every festive look.</h2>
      </div>

      <div className="product-scroll" aria-label="Earring products">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isLiked={likedItems.some((item) => item.id === product.id)}
            onLike={onLike}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      <div className="section-action-row">
        <button className="secondary-link" type="button" onClick={onShowMore}>
          Show More
        </button>
      </div>
    </section>
  );
}

export default EarringsSection;
