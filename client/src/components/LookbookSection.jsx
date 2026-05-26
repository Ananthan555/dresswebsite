function LookbookSection({ looks }) {
  return (
    <section className="lookbook-section" id="lookbook">
      <div className="section-heading">
        <span>Lookbook</span>
        <h2>Editorial frames for festive nights and city days.</h2>
      </div>

      <div className="lookbook-grid">
        {looks.map((look, index) => (
          <article className={index === 0 ? "look-card tall" : "look-card"} key={look.id}>
            <img src={look.image} alt={look.title} />
            <div>
              <span>{look.mood}</span>
              <h3>{look.title}</h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default LookbookSection;
