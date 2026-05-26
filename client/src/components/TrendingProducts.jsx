import { Heart, ShoppingBag } from "lucide-react";

export function ProductCard({ product, isLiked, isCartView = false, isLikesView = false, onLike, onAddToCart, onRemoveFromCart, onRemoveFromLike }) {
  return (
    <article className="product-card">
      <div className="product-media">
        <img src={product.image} alt={product.name} />
        <span>{product.badge}</span>
        <button
          className={isLiked ? "is-liked" : ""}
          type="button"
          aria-label={`Save ${product.name}`}
          onClick={() => onLike(product)}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="product-body">
        <p>{product.category}</p>
        <h3>{product.name}</h3>
        <div>
          <strong>{product.price}</strong>
          {!isCartView && (
            <button type="button" aria-label={`Add ${product.name} to cart`} onClick={() => onAddToCart(product)}>
              <ShoppingBag size={17} />
            </button>
          )}
        </div>
        <button
          className="add-cart-btn"
          type="button"
          onClick={() => {
            if (isCartView) {
              onRemoveFromCart(product);
            } else if (isLikesView) {
              onRemoveFromLike(product);
            } else {
              onAddToCart(product);
            }
          }}
        >
          {isCartView ? "Remove" : isLikesView ? "Remove" : "Add To Cart"}
        </button>
      </div>
    </article>
  );
}

function TrendingProducts({ products, likedItems, onLike, onAddToCart, onSeeAll }) {
  return (
    <section className="section-block product-section" id="trending">
      <div className="section-heading">
        <span>Trending now</span>
        <h2>Best-selling silhouettes with boutique energy.</h2>
      </div>

      <div className="product-scroll" aria-label="Trending products">
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

      <div className="section-action">
        <button type="button" onClick={onSeeAll}>See All</button>
      </div>
    </section>
  );
}

export default TrendingProducts;
