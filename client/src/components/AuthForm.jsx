import { useState } from "react";

export default function AuthForm({
  title,
  subtitle,
  buttonText,
  onSubmit,
  includeRole = false,
  chipText = "Task Manager"
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    systemRole: "member"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-card" onSubmit={submit}>
      <div className="auth-card-head">
        <div className="auth-chip">{chipText}</div>
        <h1>{title}</h1>
        <p className="muted-text">{subtitle}</p>
      </div>

      {includeRole && (
        <div className="role-picker">
          <div className="role-picker-head">
            <span>System Role</span>
            <small>Choose how you want to use the workspace.</small>
          </div>
          <div className="role-options">
            <button
              className={`role-option ${formData.systemRole === "member" ? "is-active" : ""}`}
              onClick={() => setFormData((current) => ({ ...current, systemRole: "member" }))}
              type="button"
            >
              <span className="role-option-icon">✓</span>
              <span className="role-option-copy">
                <strong>Member</strong>
                <small>Update your assigned tasks and track progress.</small>
              </span>
            </button>
            <button
              className={`role-option ${formData.systemRole === "admin" ? "is-active" : ""}`}
              onClick={() => setFormData((current) => ({ ...current, systemRole: "admin" }))}
              type="button"
            >
              <span className="role-option-icon">◆</span>
              <span className="role-option-copy">
                <strong>Admin</strong>
                <small>Create projects, assign members, and manage tasks.</small>
              </span>
            </button>
          </div>
        </div>
      )}

      {includeRole && (
        <label>
          Name
          <input name="name" value={formData.name} onChange={handleChange} required />
        </label>
      )}

      <label>
        Email
        <input name="email" type="email" placeholder="name@company.com" value={formData.email} onChange={handleChange} required />
      </label>

      <label>
        Password
        <input
          name="password"
          type="password"
          minLength="6"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </label>

      {error ? <p className="error-text">{error}</p> : null}

      <button className="primary-button" disabled={loading} type="submit">
        {loading ? "Please wait..." : buttonText}
      </button>
    </form>
  );
}
