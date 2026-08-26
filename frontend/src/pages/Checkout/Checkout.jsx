import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiLock,
} from "react-icons/fi";

import { useCart } from "../../hooks/useCart";

function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const shipping = subtotal >= 20000 ? 0 : 499;

  const total = useMemo(() => {
    return subtotal + shipping;
  }, [subtotal, shipping]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const orderId = `VEL-${Date.now()
      .toString()
      .slice(-8)}`;

    const orderData = {
      id: orderId,
      customer: form,
      items,
      subtotal,
      shipping,
      total,
    };

    sessionStorage.setItem(
      "velmora-last-order",
      JSON.stringify(orderData)
    );

    clearCart();

    navigate("/order-success");
  };

  /* ========================================
     EMPTY CHECKOUT
  ======================================== */

  if (!items || items.length === 0) {
    return (
      <main className="min-h-[calc(100vh-82px)] bg-[#faf7ef]">
        <div className="mx-auto flex min-h-[calc(100vh-82px)] w-full max-w-[1180px] items-center justify-center px-5 py-16 text-center sm:px-8 lg:px-10">
          <div className="max-w-[520px]">
            <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#9b8772]">
              Secure Checkout
            </p>

            <h1 className="font-serif text-[44px] font-medium leading-none text-[#332b24] sm:text-[54px]">
              Your Bag is Empty
            </h1>

            <p className="mx-auto mt-5 max-w-[420px] text-[12px] leading-7 text-[#776b60]">
              Add something beautiful to your collection before
              continuing to checkout.
            </p>

            <Link
              to="/shop"
              className="mt-8 inline-flex min-h-[48px] items-center justify-center gap-3 bg-[#332b24] px-8 text-[9px] font-semibold uppercase tracking-[0.16em] text-white transition duration-300 hover:bg-[#514337]"
            >
              Continue Shopping
              <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-82px)] bg-[#faf7ef]">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">

        {/* =========================
            HEADER
        ========================== */}

        <header className="mb-12 border-b border-[#ddd3c6] pb-10 sm:mb-14 lg:mb-16 lg:pb-12">
          <Link
            to="/cart"
            className="mb-7 inline-flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.17em] text-[#887665] transition hover:text-[#332b24]"
          >
            <FiArrowLeft size={13} />
            Back to Cart
          </Link>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#9b8772]">
                Secure Checkout
              </p>

              <h1 className="font-serif text-[46px] font-medium leading-[0.95] tracking-[-0.02em] text-[#332b24] sm:text-[54px] lg:text-[60px]">
                Complete Your Order
              </h1>

              <p className="mt-5 max-w-[500px] text-[12px] leading-6 text-[#7d7166]">
                Enter your details below and review your order
                before completing your purchase.
              </p>
            </div>

            <div className="hidden items-center gap-2 pb-1 text-[9px] text-[#88796b] sm:flex">
              <FiLock size={12} />
              Secure checkout
            </div>
          </div>
        </header>

        {/* =========================
            CHECKOUT GRID
        ========================== */}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14 xl:gap-16"
        >
          {/* =========================
              LEFT SIDE
          ========================== */}

          <div className="min-w-0">

            {/* Contact */}
            <CheckoutSection
              number="01"
              title="Contact Information"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                />

                <Field
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
            </CheckoutSection>

            {/* Shipping */}
            <CheckoutSection
              number="02"
              title="Shipping Address"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                />

                <Field
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                />

                <div className="sm:col-span-2">
                  <Field
                    label="Address"
                    name="address"
                    placeholder="Street address"
                    value={form.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Field
                    label="Apartment, Suite, etc."
                    name="apartment"
                    placeholder="Optional"
                    value={form.apartment}
                    onChange={handleChange}
                    required={false}
                  />
                </div>

                <Field
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                />

                <Field
                  label="State"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                />

                <Field
                  label="Postal Code"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                />

                <div>
                  <label className="mb-2 block text-[8px] font-semibold uppercase tracking-[0.17em] text-[#8e7b69]">
                    Country
                  </label>

                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="h-[52px] w-full border border-[#d9cfc2] bg-[#fffdf9] px-4 text-[12px] text-[#40372f] outline-none transition focus:border-[#8a7356]"
                  >
                    <option value="India">
                      India
                    </option>

                    <option value="United States">
                      United States
                    </option>

                    <option value="United Kingdom">
                      United Kingdom
                    </option>

                    <option value="United Arab Emirates">
                      United Arab Emirates
                    </option>
                  </select>
                </div>
              </div>
            </CheckoutSection>

            {/* Payment */}
            <CheckoutSection
              number="03"
              title="Payment"
              last
            >
              <div className="border border-[#d9cfc2] bg-[#fffdf9] p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#ded4c7] text-[#6c5d50]">
                    <FiLock size={14} />
                  </div>

                  <div>
                    <p className="text-[11px] font-medium text-[#40372f]">
                      Secure Payment
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-[#84786c]">
                      Your payment details will be processed securely.
                    </p>
                  </div>
                </div>
              </div>
            </CheckoutSection>
          </div>

          {/* =========================
              ORDER SUMMARY
          ========================== */}

          <aside className="h-fit lg:sticky lg:top-[110px]">
            <div className="border border-[#ddd3c6] bg-[#f3eee6] p-6 sm:p-7">

              <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#998571]">
                Order Summary
              </p>

              {/* Products */}
              <div className="mt-7 space-y-5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[76px_minmax(0,1fr)] gap-4"
                  >
                    <div className="relative h-[92px] overflow-hidden rounded-[3px] bg-[#e5ddd2]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />

                      <span className="absolute right-1.5 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#332b24] px-1 text-[8px] text-white">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="flex min-w-0 flex-col justify-between py-1">
                      <div>
                        <p className="text-[7px] font-semibold uppercase tracking-[0.15em] text-[#998571]">
                          {item.categoryLabel ||
                            item.category ||
                            "Velmora"}
                        </p>

                        <p className="mt-1 font-serif text-[19px] font-medium leading-[1.05] text-[#332b24]">
                          {item.name}
                        </p>
                      </div>

                      <p className="mt-3 text-[10px] text-[#5c5147]">
                        ₹
                        {(item.price * item.quantity).toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="my-7 h-px bg-[#d5cabd]" />

              {/* Price rows */}
              <div className="space-y-4 text-[10px] text-[#675c52]">
                <div className="flex items-center justify-between gap-5">
                  <span>
                    Subtotal
                  </span>

                  <strong className="font-medium text-[#40372f]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </strong>
                </div>

                <div className="flex items-center justify-between gap-5">
                  <span>
                    Shipping
                  </span>

                  <span className="text-right text-[#40372f]">
                    {shipping === 0
                      ? "Complimentary"
                      : `₹${shipping.toLocaleString("en-IN")}`}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-5">
                  <span>
                    Taxes
                  </span>

                  <span className="text-right text-[#807468]">
                    Included at checkout
                  </span>
                </div>
              </div>

              <div className="my-7 h-px bg-[#d5cabd]" />

              {/* Total */}
              <div className="flex items-end justify-between gap-5">
                <span className="font-serif text-[28px] font-medium leading-none text-[#332b24]">
                  Total
                </span>

                <strong className="text-[14px] font-semibold text-[#332b24]">
                  ₹{total.toLocaleString("en-IN")}
                </strong>
              </div>

              {/* Place Order */}
              <button
                type="submit"
                className="group mt-8 flex min-h-[52px] w-full items-center justify-center gap-3 bg-[#332b24] px-5 text-[9px] font-semibold uppercase tracking-[0.17em] text-white transition duration-200 hover:bg-[#514337]"
              >
                Place Order

                <FiArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </button>

              <Link
                to="/cart"
                className="mt-5 flex items-center justify-center gap-2 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#77695c] transition hover:text-[#332b24]"
              >
                <FiArrowLeft size={11} />
                Return to Cart
              </Link>

              <div className="mt-7 border-t border-[#d5cabd] pt-6">
                <p className="flex items-center gap-2 text-[9px] text-[#7f7368]">
                  <FiLock size={11} />
                  Secure checkout
                </p>

                <p className="mt-3 text-[9px] leading-5 text-[#8a7e72]">
                  Carefully packed and delivered.
                </p>

                <p className="mt-1 text-[9px] leading-5 text-[#8a7e72]">
                  Easy returns within 14 days.
                </p>
              </div>

            </div>
          </aside>
        </form>

      </div>
    </main>
  );
}

/* ========================================
   CHECKOUT SECTION
======================================== */

function CheckoutSection({
  number,
  title,
  children,
  last = false,
}) {
  return (
    <section
      className={
        last
          ? ""
          : "mb-11 border-b border-[#ddd3c6] pb-11 sm:mb-12 sm:pb-12"
      }
    >
      <div className="mb-7">
        <p className="mb-2 text-[8px] font-semibold uppercase tracking-[0.2em] text-[#9d8974]">
          {number}
        </p>

        <h2 className="font-serif text-[30px] font-medium leading-none text-[#332b24] sm:text-[34px]">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

/* ========================================
   FIELD
======================================== */

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = true,
}) {
  return (
    <div>
      <label className="mb-2 block text-[8px] font-semibold uppercase tracking-[0.17em] text-[#8e7b69]">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="h-[52px] w-full border border-[#d9cfc2] bg-[#fffdf9] px-4 text-[12px] text-[#40372f] outline-none transition placeholder:text-[#b1a69a] focus:border-[#8a7356]"
      />
    </div>
  );
}

export default Checkout;