import { Link } from "react-router-dom";
import { FiArrowRight, FiPlus } from "react-icons/fi";

import product1 from "../../assets/images/products/product 1.jpg";
import product2 from "../../assets/images/products/product 2.jpg";
import product3 from "../../assets/images/products/product 3.jpg";
import product4 from "../../assets/images/products/product 4.jpg";

import "./home-sections.css";

const products = [
  {
    id: 1,
    name: "Terracotta Bird Feeder & Wind Chime",
    category: "Decor",
    price: "₹24,999",
    image: product1,
  },
  {
    id: 2,
    name: "Aura Table Lamp",
    category: "Lighting",
    price: "₹8,499",
    image: product2,
  },
  {
    id: 3,
    name: "Travertine Side Table",
    category: "Furniture",
    price: "₹16,999",
    image: product3,
  },
  {
    id: 4,
    name: "Artisan Ceramic Vase",
    category: "Decor",
    price: "₹5,499",
    image: product4,
  },
];

function FeaturedCollection() {
  const mainProduct = products[0];

  return (
    <section className="vel-edit-section">
      <div className="vel-home-container">

        <div className="vel-edit-heading">
          <div>
            <p className="vel-eyebrow">
              The Velmora Edit
            </p>

            <h2>
              Objects Worth
              <span>Living With</span>
            </h2>

            <p className="vel-edit-description">
              A considered selection of pieces chosen for material,
              proportion, character, and lasting beauty.
            </p>
          </div>

          <Link to="/shop" className="vel-discover-link">
            Discover All
            <FiArrowRight />
          </Link>
        </div>

        <div className="vel-products-layout">

          {/* Main Product */}
          <article className="vel-main-product">

            <Link
              to={`/product/${mainProduct.id}`}
              className="vel-main-product-image"
            >
              <img
                src={mainProduct.image}
                alt={mainProduct.name}
              />
            </Link>

            <div className="vel-main-product-info">
              <div>
                <span>{mainProduct.category}</span>

                <Link to={`/product/${mainProduct.id}`}>
                  {mainProduct.name}
                </Link>
              </div>

              <strong>{mainProduct.price}</strong>
            </div>

          </article>

          {/* Right list */}
          <div className="vel-product-list">
            {products.slice(1).map((product) => (
              <article
                key={product.id}
                className="vel-small-product"
              >
                <Link
                  to={`/product/${product.id}`}
                  className="vel-small-product-image"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                  />
                </Link>

                <div className="vel-small-product-copy">
                  <span>{product.category}</span>

                  <Link to={`/product/${product.id}`}>
                    {product.name}
                  </Link>

                  <strong>{product.price}</strong>
                </div>

                <button type="button">
                  <FiPlus />
                </button>
              </article>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

export default FeaturedCollection;