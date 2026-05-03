import { useState } from "react";

const defaultTask = {
  title: "",
  description: "",
  assignedTo: "",
  status: "todo",
  priority: "medium",
  dueDate: ""
};

export default function TaskForm({ members, onSubmit }) {
  const [formData, setFormData] = useState(defaultTask);
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
      setFormData(defaultTask);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="panel form-grid" onSubmit={submit}>
      <div className="panel-header">
        <h3>Create Task</h3>
        <p>Add a task, assign it, and give it a due date.</p>
      </div>

      <label>
        Title
        <input name="title" value={formData.title} onChange={handleChange} required />
      </label>

      <label>
        Description
        <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
      </label>

      <label>
        Assignee
        <select name="assignedTo" value={formData.assignedTo} onChange={handleChange} required>
          <option value="">Select member</option>
          {members.map((member) => (
            <option key={member.user._id} value={member.user._id}>
              {member.user.name} ({member.role})
            </option>
          ))}
        </select>
      </label>

      <label>
        Status
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </label>

      <label>
        Priority
        <select name="priority" value={formData.priority} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>

      <label>
        Due Date
        <input name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} required />
      </label>

      {error ? <p className="error-text">{error}</p> : null}

      <button className="primary-button" disabled={loading} type="submit">
        {loading ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}
