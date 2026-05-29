import { ArrowLeft, ChevronDown, ShoppingBag, Star, Store, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "./TrendingProducts";

const getPriceValue = (price) => Number(String(price).replace(/[^\d]/g, "")) || 0;
const formatPrice = (amount) => `Rs ${amount.toLocaleString("en-IN")}`;
const jewelleryKeywords = [
  "earring",
  "jhumka",
  "hoop",
  "stud",
  "chandbali",
  "jewellery",
  "jewelleries",
  "necklace",
  "pendant",
  "locket",
  "bracelet",
  "nail polish",
  "hair clip",
  "hair bow",
];

const isJewelleryProduct = (product) => {
  const value = `${product?.category || ""} ${product?.name || ""}`.toLowerCase();
  return jewelleryKeywords.some((keyword) => value.includes(keyword));
};

const sizeOptions = [
  { label: "XS", delta: 0 },
  { label: "S", delta: -122 },
  { label: "M", delta: -56 },
  { label: "L", delta: 6 },
  { label: "XL", delta: 12 },
  { label: "XXL", delta: 11 },
  { label: "XXXL", delta: 12 },
  { label: "4XL", delta: 13 },
  { label: "5XL", delta: 14 },
];

const getProductReviewStats = (product) => {
  const seed = Number(product?.id) || 1;
  const rating = (3.8 + ((seed * 7) % 11) / 10).toFixed(1);
  const ratings = 1250 + ((seed * 137) % 78000);
  const reviews = Math.round(ratings * (0.24 + (seed % 17) / 100));
  const excellent = 48 + (seed % 35);
  const veryGood = 24 + ((seed * 3) % 24);
  const good = 10 + ((seed * 5) % 18);
  const average = 4 + ((seed * 7) % 10);

  return {
    rating,
    ratings,
    reviews,
    rows: [
      { label: "Excellent", value: excellent, count: Math.round(ratings * 0.52) },
      { label: "Very Good", value: veryGood, count: Math.round(ratings * 0.26) },
      { label: "Good", value: good, count: Math.round(ratings * 0.14) },
      { label: "Average", value: average, count: Math.round(ratings * 0.05) },
    ],
  };
};

function ProductDetailPage({
  product,
  likedItems,
  similarProducts,
  onBack,
  onLike,
  onAddToCart,
  onBuyNow,
  onOpenProduct,
}) {
  const [selectedSize, setSelectedSize] = useState("XS");
  const [activeImage, setActiveImage] = useState(product?.image);

  useEffect(() => {
    setSelectedSize("XS");
    setActiveImage(product?.image);
  }, [product]);

  const basePrice = getPriceValue(product?.price);
  const hasSizeOptions = !isJewelleryProduct(product);
  const selectedSizeData = sizeOptions.find((size) => size.label === selectedSize) || sizeOptions[0];
  const selectedPrice = hasSizeOptions ? Math.max(299, basePrice + selectedSizeData.delta) : basePrice;
  const originalPrice = Math.round(selectedPrice * 1.11);
  const selectedProduct = {
    ...product,
    price: formatPrice(selectedPrice),
    originalPrice: formatPrice(originalPrice),
    ...(hasSizeOptions ? { selectedSize } : {}),
  };
  const reviewStats = getProductReviewStats(product);

  const galleryImages = useMemo(() => {
    const images = [product?.image, product?.fallbackImage].filter(Boolean);
    return [...new Set(images.length > 1 ? images : [product?.image, product?.fallbackImage, product?.image].filter(Boolean))];
  }, [product]);

  if (!product) {
    return (
      <main className="page-view product-detail-empty">
        <button className="back-btn" type="button" onClick={onBack}>
          <ArrowLeft size={18} />
          Back
        </button>
        <p>Product details not available.</p>
      </main>
    );
  }

  return (
    <main className="product-detail-page page-view">
      <div className="product-detail-breadcrumb">
        Home / Women / {product.category} / {product.name}
      </div>

      <section className="product-detail-layout">
        <div className="product-detail-gallery">
          <div className="product-thumbs">
            {galleryImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                className={activeImage === image ? "is-active" : ""}
                type="button"
                onClick={() => setActiveImage(image)}
                aria-label={`View product image ${index + 1}`}
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>

          <div className="product-detail-image">
            <img
              src={activeImage || product.image}
              alt={product.name}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = product.fallbackImage || product.image;
              }}
            />
          </div>

          <div className="product-detail-actions">
            <button className="detail-cart-btn" type="button" onClick={() => onAddToCart(selectedProduct)}>
              <ShoppingBag size={18} />
              Add to Cart
            </button>
            <button className="detail-buy-btn" type="button" onClick={() => onBuyNow(selectedProduct)}>
              <Zap size={18} />
              Buy Now
            </button>
          </div>

          <div className="similar-product-strip">
            <h3>{similarProducts.length} Similar Products</h3>
            <div>
              {similarProducts.map((item) => (
                <button key={item.id} type="button" onClick={() => onOpenProduct(item)}>
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = item.fallbackImage || "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=900";
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="product-detail-info">
          <section className="detail-panel product-summary-panel">
            <button className="back-btn compact-back-btn" type="button" onClick={onBack}>
              <ArrowLeft size={16} />
              Back
            </button>
            <p>{product.name}</p>
            <div className="detail-price-row">
              <strong>{formatPrice(selectedPrice)}</strong>
              <span>{formatPrice(originalPrice)}</span>
              <b>10% off</b>
            </div>
            <div className="deal-timer">Deal 01h : 07m : 03s</div>
            <div className="rating-chip-row">
              <span className="rating-pill">{reviewStats.rating} <Star size={13} fill="currentColor" /></span>
              <span>{reviewStats.ratings.toLocaleString("en-IN")} Ratings, {reviewStats.reviews.toLocaleString("en-IN")} Reviews</span>
            </div>
          </section>

          {hasSizeOptions && (
            <section className="detail-panel">
              <h3>Select Size</h3>
              <div className="size-grid">
                {sizeOptions.map((size) => {
                  const sizePrice = Math.max(299, basePrice + size.delta);
                  return (
                    <button
                      key={size.label}
                      type="button"
                      className={selectedSize === size.label ? "is-selected" : ""}
                      onClick={() => setSelectedSize(size.label)}
                    >
                      <span>{size.label}</span>
                      <small>{formatPrice(sizePrice)}</small>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          <section className="detail-panel product-highlights">
            <div className="panel-title-row">
              <h3>Product Highlights</h3>
            </div>
            <dl>
              <div><dt>Color</dt><dd>Pink</dd></div>
              <div><dt>Fabric</dt><dd>Rayon</dd></div>
              <div><dt>Fit / Shape</dt><dd>{product.category}</dd></div>
              <div><dt>Length</dt><dd>Ankle Length</dd></div>
            </dl>
            <button className="detail-expand-btn" type="button">
              Additional Details <ChevronDown size={16} />
            </button>
          </section>

          <section className="detail-panel sold-by-panel">
            <h3>Sold By</h3>
            <div className="seller-row">
              <span><Store size={21} /></span>
              <div>
                <strong>MA SYLAGARMENTS</strong>
                <p><b>4.2 Star</b> 65,727 Ratings</p>
              </div>
            </div>
          </section>

          <section className="detail-panel ratings-panel">
            <h3>Product Ratings & Reviews</h3>
            <div className="ratings-layout">
              <div className="rating-total">
                <strong>{reviewStats.rating}<Star size={22} fill="currentColor" /></strong>
                <span>{reviewStats.ratings.toLocaleString("en-IN")} Ratings, {reviewStats.reviews.toLocaleString("en-IN")} Reviews</span>
              </div>
              <div className="rating-bars">
                {reviewStats.rows.map((row) => (
                  <div className="rating-bar-row" key={row.label}>
                    <span>{row.label}</span>
                    <div><i style={{ width: `${row.value}%` }} /></div>
                    <small>{row.count.toLocaleString("en-IN")}</small>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="detail-similar-grid">
        <h2>More Like This</h2>
        <div className="product-grid-page">
          {similarProducts.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              isLiked={likedItems.some((liked) => liked.id === item.id)}
              onLike={onLike}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
              onOpenProduct={onOpenProduct}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default ProductDetailPage;
