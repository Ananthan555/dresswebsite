import { Heart, ShoppingBag } from "lucide-react";

function TrendingProducts({ products }) {
  return (
    <section className="section-block product-section" id="trending">
      <div className="section-heading">
        <span>Trending now</span>
        <h2>Best-selling silhouettes with boutique energy.</h2>
      </div>

      <div className="product-scroll" aria-label="Trending products">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            <div className="product-media">
              <img src={product.image} alt={product.name} />
              <span>{product.badge}</span>
              <button type="button" aria-label={`Save ${product.name}`}>
                <Heart size={18} />
              </button>
            </div>
            <div className="product-body">
              <p>{product.category}</p>
              <h3>{product.name}</h3>
              <div>
                <strong>{product.price}</strong>
                <button type="button" aria-label={`Add ${product.name} to cart`}>
                  <ShoppingBag size={17} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default TrendingProducts;
