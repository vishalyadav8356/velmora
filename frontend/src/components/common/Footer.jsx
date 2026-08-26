import { Link } from "react-router-dom";

const footerLinks = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Shipping & Returns", to: "/shipping" },
  { label: "Terms of Service", to: "/terms" },
  { label: "Contact Us", to: "/contact" },
  { label: "Store Locator", to: "/stores" },
];

function Footer() {
  return (
    <footer className="vel-footer">
      <div className="vel-footer-inner">

        {/* Left */}
        <div className="vel-footer-brand">
          <Link to="/" className="vel-footer-logo">
            VELMORA
          </Link>

          <p>
            © 2026 Velmora. All rights reserved.
            <br />
            Curated interiors for refined living.
          </p>
        </div>

        {/* Right */}
        <nav className="vel-footer-nav">
          {footerLinks.map((link) => (
            <Link key={link.label} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>

      </div>
    </footer>
  );
}

export default Footer;