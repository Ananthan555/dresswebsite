import { ProductCard } from "./TrendingProducts";

export function JewelleryLanding({ categories, fallbackImages = [], onOpenCategory, onBackHome }) {
  return (
    <main className="page-view womens-dress-view" id="jewellery">
      <div className="section-heading page-heading womens-main-heading">
        <span>Jewellery</span>
        <h2>Jewellery Collection</h2>
        <button className="back-btn" type="button" onClick={onBackHome}>
          Back Home
        </button>
      </div>

      <section className="womens-categories" aria-label="Jewellery categories">
        {categories.map((cat, index) => (
          <button
            key={cat.id}
            type="button"
            className="category-card"
            onClick={() => onOpenCategory(cat.id)}
          >
            <div className="category-media">
              <img
                src={cat.image}
                alt={cat.label}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  if (fallbackImages.length > 0) {
                    event.currentTarget.src = fallbackImages[index % fallbackImages.length];
                  }
                }}
              />
            </div>
            <div className="category-body">
              <strong>{cat.label}</strong>
            </div>
          </button>
        ))}
      </section>
    </main>
  );
}

export function JewelleryCategoryPage({
  activeCategory,
  products,
  likedItems,
  onBack,
  onLike,
  onAddToCart,
  onBuyNow,
  onOpenProduct,
}) {
  return (
    <main className="page-view jewellery-category-view">
      <div className="section-heading page-heading kurti-heading">
        <span>Jewellery</span>
        <h2>{activeCategory.label}</h2>
        <button className="back-btn" type="button" onClick={onBack}>
          Back
        </button>
      </div>

      <div className="product-grid-page kurti-product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isLiked={likedItems.some((item) => item.id === product.id)}
            onLike={onLike}
            onAddToCart={(selectedProduct) => onAddToCart(selectedProduct, {
              view: "jewellery-category",
              jewelleryCategory: activeCategory.id,
            })}
            onBuyNow={onBuyNow}
            onOpenProduct={(selectedProduct) => onOpenProduct(selectedProduct, {
              view: "jewellery-category",
              jewelleryCategory: activeCategory.id,
            })}
          />
        ))}
      </div>
    </main>
  );
}
