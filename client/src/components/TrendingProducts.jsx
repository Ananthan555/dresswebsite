import { Heart, ShoppingBag } from "lucide-react";

export function ProductCard({ product, isLiked, isCartView = false, isLikesView = false, onLike, onAddToCart, onBuyNow, onRemoveFromCart, onRemoveFromLike, onOpenProduct }) {
  const handleCardClick = () => {
    if (!isCartView && onOpenProduct) {
      onOpenProduct(product);
    }
  };

  return (
    <article
      className={`product-card ${onOpenProduct && !isCartView ? "is-clickable" : ""}`}
      onClick={handleCardClick}
    >
      <div className="product-media">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = product.fallbackImage || "https://images.pexels.com/photos/26973350/pexels-photo-26973350.jpeg?auto=compress&cs=tinysrgb&w=900";
          }}
        />
        <span>{product.badge}</span>
        <button
          className={isLiked ? "is-liked" : ""}
          type="button"
          aria-label={`Save ${product.name}`}
          onClick={(event) => {
            event.stopPropagation();
            onLike(product);
          }}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="product-body">
        <p>{product.category}</p>
        <h3>{product.name}</h3>
        <div className="product-price-row">
          <strong>{product.price}</strong>
          {!isCartView && (
            <button
              type="button"
              aria-label={`Add ${product.name} to cart`}
              onClick={(event) => {
                event.stopPropagation();
                onAddToCart(product);
              }}
            >
              <ShoppingBag size={17} />
            </button>
          )}
        </div>
        <div className="product-actions">
          <button
          className="add-cart-btn"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
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
          {!isCartView && !isLikesView && (
            <button
              className="buy-now-btn"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                return onBuyNow ? onBuyNow(product) : onAddToCart(product);
              }}
            >
              Buy Now
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function TrendingProducts({ products, likedItems, onLike, onAddToCart, onSeeAll, onOpenProduct }) {
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
            onOpenProduct={onOpenProduct}
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
