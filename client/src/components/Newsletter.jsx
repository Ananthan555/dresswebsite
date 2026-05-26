import { Send } from "lucide-react";

function Newsletter() {
  return (
    <section className="newsletter" id="contact">
      <div>
        <span>Private access</span>
        <h2>Get early drops before the collection sells out.</h2>
      </div>
      <form>
        <input type="email" placeholder="Enter email address" aria-label="Email address" />
        <button type="submit" aria-label="Subscribe">
          <Send size={18} />
        </button>
      </form>
    </section>
  );
}

export default Newsletter;
