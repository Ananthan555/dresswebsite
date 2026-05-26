import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useState } from "react";
import logoImg from "../assets/logo.png";

function BrandNavbar({ brand, navItems, onNavigate, likedCount = 0, cartCount = 0, authUser, onAccount, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  const navigate = (view, target) => {
    closeMenu();
    onNavigate?.(view, target);
  };

  return (
    <header className="nav-wrap">
      <nav className="brand-navbar" aria-label="Main navigation">
        <a className="brand-mark" href="#home" onClick={(event) => {
          event.preventDefault();
          navigate("home", "#home");
        }}>
          <img src={logoImg} alt={brand.name} />
          <span>{brand.name}</span>
        </a>

        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.id}>
              <a href={item.href} onClick={(event) => {
                event.preventDefault();
                navigate("home", item.href);
              }}>{item.label}</a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <button type="button" aria-label="Search">
            <Search size={19} />
          </button>
          <button className="nav-count-button" type="button" aria-label="Wishlist" onClick={() => navigate("likes")}>
            <Heart size={19} />
            {likedCount > 0 && <span>{likedCount}</span>}
          </button>
          <button
            type="button"
            className={authUser ? "auth-action-button" : undefined}
            aria-label={authUser ? "Logout" : "Account"}
            onClick={authUser ? onLogout : onAccount}
          >
            {authUser ? "Logout" : <UserRound size={19} />}
          </button>
          <button className="nav-count-button" type="button" aria-label="Cart" onClick={() => navigate("cart")}>
            <ShoppingBag size={19} />
            {cartCount > 0 && <span>{cartCount}</span>}
          </button>
          <button
            className="menu-toggle"
            type="button"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <div className={`mobile-panel ${isOpen ? "is-open" : ""}`}>
        <button className="drawer-close" type="button" aria-label="Close menu" onClick={closeMenu}>
          <X size={24} />
        </button>
        {navItems.map((item) => (
          <a key={item.id} href={item.href} onClick={(event) => {
            event.preventDefault();
            navigate("home", item.href);
          }}>
            {item.label}
          </a>
        ))}
        <button type="button" onClick={() => navigate("likes")}>My Likes</button>
        <button type="button" onClick={() => navigate("cart")}>My Cart</button>
        {authUser ? (
          <button type="button" onClick={onLogout}>Logout</button>
        ) : (
          <button type="button" onClick={onAccount}>Account</button>
        )}
      </div>
    </header>
  );
}

export default BrandNavbar;
