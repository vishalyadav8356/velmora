import { FcGoogle } from "react-icons/fc";

const SocialLogin = () => {
  return (
    <>
      <div className="auth-divider">
        <span>or continue with</span>
      </div>

      <button
        type="button"
        className="auth-google"
      >
        <FcGoogle size={24} />

        <span>
          Continue with Google
        </span>
      </button>
    </>
  );
};

export default SocialLogin;