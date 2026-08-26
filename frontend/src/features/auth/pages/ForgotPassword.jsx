import { useState } from "react";
import { FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";

import forgotImage from "../../../assets/images/auth/forgot.jpeg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setIsSubmitting(true);

      // Backend API later connect hogi.
      console.log("Forgot password email:", email);
    } catch (error) {
      console.error(error);
      setError("Unable to process request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      image={forgotImage}
      title="Forgot password?"
      subtitle="Enter your registered email address to reset your password"
      imagePosition="left"
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="auth-form"
      >
        <AuthInput
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);

            if (error) {
              setError("");
            }
          }}
          icon={FiMail}
          error={error}
        />

        <AuthButton
          type="submit"
          loading={isSubmitting}
        >
          Send Reset Link
        </AuthButton>
      </form>

      <p className="auth-footer">
        Remember your password?{" "}
        <Link to="/login">
          Back to Login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPassword;