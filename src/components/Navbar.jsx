import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useState } from "react";
import logoImg from "../assets/logo.png";

function BrandNavbar({ brand, navItems }) {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="nav-wrap">
      <nav className="brand-navbar" aria-label="Main navigation">
        <a className="brand-mark" href="#home" onClick={closeMenu}>
          <img src={logoImg} alt={brand.name} />
          <span>{brand.name}</span>
        </a>

        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.id}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <button type="button" aria-label="Search">
            <Search size={19} />
          </button>
          <button type="button" aria-label="Wishlist">
            <Heart size={19} />
          </button>
          <button type="button" aria-label="Account">
            <UserRound size={19} />
          </button>
          <button type="button" aria-label="Cart">
            <ShoppingBag size={19} />
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
          <a key={item.id} href={item.href} onClick={closeMenu}>
            {item.label}
          </a>
        ))}
      </div>
    </header>
  );
}

export default BrandNavbar;
