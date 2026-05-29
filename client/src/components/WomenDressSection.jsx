import { ProductCard } from "./TrendingProducts";

export function WomenDressLanding({ categories, productImages, onOpenCategory, onBackHome }) {
  return (
    <main className="page-view womens-dress-view" id="womens">
      <div className="section-heading page-heading womens-main-heading">
        <span>Women's dresses</span>
        <h2>Women's Dress Collection</h2>
        <button className="back-btn" type="button" onClick={onBackHome}>
          Back Home
        </button>
      </div>

      <section className="womens-categories" aria-label="Women's dress categories">
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
                  event.currentTarget.src = productImages[index % productImages.length];
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

export function WomenDressCategoryPage({
  config,
  activeCategory,
  activeSection,
  products,
  likedItems,
  onSelectSection,
  onBack,
  onLike,
  onAddToCart,
  onBuyNow,
  onOpenProduct,
}) {
  return (
    <main className="page-view kurti-page-view">
      <aside className="kurti-sidebar" aria-label={`${config.sidebarTitle} categories`}>
        <h3>{config.sidebarTitle}</h3>
        {config.sections.map((section) => (
          <button
            key={section.id}
            type="button"
            className={activeSection.id === section.id ? "is-active" : ""}
            onClick={() => onSelectSection(section.id)}
          >
            {section.label}
          </button>
        ))}
      </aside>

      <section className="kurti-products-panel">
        <div className="section-heading page-heading kurti-heading">
          <span>Women's dresses</span>
          <h2>{activeSection.label}</h2>
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
                view: "womens-category",
                categoryId: activeCategory.id,
                categorySection: activeSection.id,
              })}
              onBuyNow={onBuyNow}
              onOpenProduct={(selectedProduct) => onOpenProduct(selectedProduct, {
                view: "womens-category",
                categoryId: activeCategory.id,
                categorySection: activeSection.id,
              })}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export function KurtiCategoryPage({
  sections,
  activeSection,
  products,
  likedItems,
  onSelectSection,
  onBack,
  onLike,
  onAddToCart,
  onBuyNow,
  onOpenProduct,
}) {
  return (
    <main className="page-view kurti-page-view">
      <aside className="kurti-sidebar" aria-label="Kurti categories">
        <h3>Kurtis</h3>
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            className={activeSection.id === section.id ? "is-active" : ""}
            onClick={() => onSelectSection(section.id)}
          >
            {section.label}
          </button>
        ))}
      </aside>

      <section className="kurti-products-panel">
        <div className="section-heading page-heading kurti-heading">
          <span>Women's dresses</span>
          <h2>{activeSection.label}</h2>
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
              onAddToCart={(selectedProduct) => onAddToCart(selectedProduct, { view: "kurtis", categoryId: "kurti", kurtiSection: activeSection.id })}
              onBuyNow={onBuyNow}
              onOpenProduct={(selectedProduct) => onOpenProduct(selectedProduct, { view: "kurtis", categoryId: "kurti", kurtiSection: activeSection.id })}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
