import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2, Truck, Search } from "lucide-react";
import { ProductCard } from "./TrendingProducts";
import { useMemo, useState } from "react";

const getPriceValue = (price) => {
  const amount = String(price).replace(/[^\d]/g, "");
  return Number(amount) || 0;
};

const formatPrice = (amount) => `Rs ${amount.toLocaleString("en-IN")}`;

function CartView({ title, eyebrow, products, onRemoveFromCart, onUpdateCartQuantity, onBack, onCheckout, isCheckingOut }) {
  const subtotal = products.reduce((total, product) => (
    total + getPriceValue(product.price) * product.quantity
  ), 0);
  const deliveryFee = 0;
  const discount = 0;
  const grandTotal = subtotal + deliveryFee - discount;
  const itemCount = products.reduce((total, product) => total + product.quantity, 0);

  return (
    <main className="page-view cart-page-view">
      <div className="cart-heading">
        <span>{eyebrow}</span>
        <h2>{title}</h2>
        <p>{itemCount} {itemCount === 1 ? "item" : "items"} ready for checkout</p>
      </div>

      {products.length > 0 ? (
        <div className="cart-layout">
          <div className="cart-items-list">
            {products.map((product) => {
              const unitPrice = getPriceValue(product.price);
              const quantity = product.quantity || 1;
              const itemSubtotal = unitPrice * quantity;

              return (
                <article className="cart-item-card" key={product.cartKey || `${product.id}-${product.selectedSize || "default"}`}>
                  <img src={product.image} alt={product.name} />
                  <div className="cart-item-info">
                    <h3>{product.name}</h3>
                    <p>Unit Price: {formatPrice(unitPrice)}</p>
                    {product.selectedSize && <p>Size: {product.selectedSize}</p>}
                    <div className="cart-quantity-row">
                      <button
                        type="button"
                        aria-label={`Decrease ${product.name} quantity`}
                        onClick={() => onUpdateCartQuantity(product, quantity - 1)}
                      >
                        <Minus size={18} />
                      </button>
                      <strong>{quantity}</strong>
                      <button
                        type="button"
                        aria-label={`Increase ${product.name} quantity`}
                        onClick={() => onUpdateCartQuantity(product, quantity + 1)}
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <b>Subtotal: {formatPrice(itemSubtotal)}</b>
                  </div>
                  <button
                    className="cart-remove-btn"
                    type="button"
                    aria-label={`Remove ${product.name}`}
                    onClick={() => onRemoveFromCart(product)}
                  >
                    <Trash2 size={21} />
                  </button>
                </article>
              );
            })}
          </div>

          <aside className="order-summary-card">
            <h3>Order Summary</h3>
            <div className="summary-line">
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <div className="summary-line">
              <span>Delivery</span>
              <strong>FREE</strong>
            </div>
            <div className="summary-line">
              <span>Discount</span>
              <strong>- {formatPrice(discount)}</strong>
            </div>
            <div className="summary-total">
              <span>Grand Total</span>
              <strong>{formatPrice(grandTotal)}</strong>
            </div>
            <p className="free-delivery-note">
              <Truck size={17} />
              Free delivery on all orders!
            </p>
            <button className="checkout-btn" type="button" onClick={onCheckout} disabled={isCheckingOut}>
              {isCheckingOut ? "Opening Payment..." : "Proceed to Checkout"}
              <ShoppingBag size={18} />
            </button>
            <button className="continue-shopping-btn" type="button" onClick={onBack}>
              <ArrowLeft size={17} />
              Continue Shopping
            </button>
          </aside>
        </div>
      ) : (
        <div className="empty-state">
          <p>Your cart is empty. Add something to checkout.</p>
          <button className="back-btn" type="button" onClick={onBack}>
            <ArrowLeft size={18} />
            Continue Shopping
          </button>
        </div>
      )}
    </main>
  );
}

function ProductPage({ title, eyebrow, products, likedItems, onLike, onAddToCart, onBuyNow, onRemoveFromCart, onUpdateCartQuantity, onRemoveFromLike, onCheckout, isCheckingOut = false, isCartView = false, isLikesView = false, onBack, onOpenProduct }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    const t = String(searchTerm).trim().toLowerCase();
    return products.filter((p) => (
      String(p.name || "").toLowerCase().includes(t) || String(p.category || "").toLowerCase().includes(t)
    ));
  }, [products, searchTerm]);

  if (isCartView) {
    return (
      <CartView
        title={title}
        eyebrow={eyebrow}
        products={products}
        onRemoveFromCart={onRemoveFromCart}
        onUpdateCartQuantity={onUpdateCartQuantity}
        onBack={onBack}
        onCheckout={onCheckout}
        isCheckingOut={isCheckingOut}
      />
    );
  }

  return (
    <main className="page-view">
      <div className="section-heading page-heading">
        <span>{eyebrow}</span>
        <h2>{title}</h2>
        <div className="page-controls">
          <label className="page-search">
            <Search size={16} />
            <input
              type="search"
              placeholder="Search within this section"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search within section"
            />
          </label>
        </div>
        <button className="back-btn" type="button" onClick={onBack}>
          <ArrowLeft size={18} />
          Back Home
        </button>
      </div>


      {filteredProducts.length > 0 ? (
        <div className="product-grid-page">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isLiked={likedItems.some((item) => item.id === product.id)}
              onLike={onLike}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
              onRemoveFromCart={onRemoveFromCart}
              onRemoveFromLike={onRemoveFromLike}
              isCartView={isCartView}
              isLikesView={isLikesView}
              onOpenProduct={onOpenProduct}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>{isCartView ? "Your cart is empty. Add something to checkout." : isLikesView ? "Your liked items will appear here." : "No items here yet."}</p>
        </div>
      )}
    </main>
  );
}

export default ProductPage;
