import { useState } from "react";

export default function ProjectForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await onSubmit(formData);
      setFormData({ name: "", description: "" });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="panel form-grid" onSubmit={submit}>
      <div className="panel-header">
        <h3>Create Project</h3>
        <p>Every project starts with you as the project admin.</p>
      </div>

      <label>
        Project Name
        <input name="name" value={formData.name} onChange={handleChange} required />
      </label>

      <label>
        Description
        <textarea name="description" rows="3" value={formData.description} onChange={handleChange} />
      </label>

      {error ? <p className="error-text">{error}</p> : null}

      <button className="primary-button" disabled={loading} type="submit">
        {loading ? "Saving..." : "Create Project"}
      </button>
    </form>
  );
}
