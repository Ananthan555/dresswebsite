import { Heart, LogOut, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import logoImg from "../assets/logo.png";

function BrandNavbar({ brand, navItems, onNavigate, likedCount = 0, cartCount = 0, authUser, onAccount, onLogout, onSearch }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef(null);

  const closeMenu = () => setIsOpen(false);

  const navigate = (view, target) => {
    closeMenu();
    onNavigate?.(view, target);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const handled = onSearch?.(searchTerm);
    if (handled) {
      setSearchTerm("");
      setSearchOpen(false);
      closeMenu();
    }
  };

  useEffect(() => {
    if (!searchOpen) return undefined;

    const closeSearchOnOutsideClick = (event) => {
      if (searchRef.current?.contains(event.target)) return;
      setSearchOpen(false);
      setSearchTerm("");
    };

    document.addEventListener("pointerdown", closeSearchOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeSearchOnOutsideClick);
  }, [searchOpen]);

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
                const viewName = String(item.href || "").replace(/^#/, "") || "home";
                navigate(viewName, item.href);
              }}>{item.label}</a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <form ref={searchRef} className={`nav-search ${searchOpen ? "is-open" : ""}`} onSubmit={handleSearchSubmit}>
            {searchOpen && (
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search"
                aria-label="Search products"
                autoFocus
              />
            )}
            <button
              type={searchOpen ? "submit" : "button"}
              aria-label="Search"
              onClick={() => {
                if (!searchOpen) {
                  setSearchOpen(true);
                }
              }}
            >
              <Search size={19} />
            </button>
          </form>
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
            {authUser ? (
              <>
                <LogOut className="auth-action-icon" size={18} />
                <span className="auth-action-text">Logout</span>
              </>
            ) : (
              <UserRound size={19} />
            )}
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
            const viewName = String(item.href || "").replace(/^#/, "") || "home";
            navigate(viewName, item.href);
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
