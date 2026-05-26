import { ArrowRight } from "lucide-react";

function OfferBanner({ offer }) {
  return (
    <section className="offer-banner" id="new">
      <div>
        <span>{offer.kicker}</span>
        <h2>{offer.title}</h2>
        <p>{offer.description}</p>
      </div>
      <a href="#collections">
        {offer.cta} <ArrowRight size={18} />
      </a>
    </section>
  );
}

export default OfferBanner;
