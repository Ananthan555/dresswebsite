function Footer({ brand, navItems }) {
  return (
    <footer className="site-footer">
      <div>
        <h2>{brand.name}</h2>
        <p>{brand.tagline}</p>
      </div>
      <nav aria-label="Footer navigation">
        {navItems.map((item) => (
          <a key={item.id} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}

export default Footer;
