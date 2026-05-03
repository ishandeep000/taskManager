import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async ({ name, email, password, systemRole }) => {
    await login({ name, email, password, systemRole }, "/auth/signup");
    navigate("/");
  };

  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <div className="auth-brand-mark">
          <span className="brand-dot brand-red" />
          <span className="brand-dot brand-green" />
          <span className="brand-dot brand-blue" />
          <span className="brand-dot brand-yellow" />
        </div>
        <p>Task Manager</p>
      </div>

      <div className="auth-showcase auth-showcase-card">
        <section className="auth-promo auth-promo-panel">
          <div className="auth-device-scene auth-image-scene">
            <img
              className="auth-reference-image"
              src="/auth-design-reference.png"
              alt="Task management design reference"
            />
          </div>
        </section>

        <div className="auth-form-panel">
          <AuthForm
            title="Create your workspace account"
            subtitle="Register as an admin or member and start managing tasks."
            buttonText="Sign up"
            onSubmit={handleSubmit}
            includeRole
            chipText="Sign up"
          />
          <p className="auth-footer">
            Already registered? <Link to="/login">Go to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
