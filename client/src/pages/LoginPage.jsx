import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async ({ email, password }) => {
    await login({ email, password }, "/auth/login");
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
            title="Login as a Team Member"
            subtitle="Access your workspace, tasks, and project timelines."
            buttonText="Login"
            onSubmit={handleSubmit}
            chipText="Login"
          />
          <p className="auth-footer">
            Need an account? <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
