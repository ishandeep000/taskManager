import { useState } from "react";

export default function AddMemberForm({ currentMembers, users, onSubmit }) {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const memberIds = new Set(currentMembers.map((member) => member.user._id));
  const availableUsers = users.filter((user) => !memberIds.has(user._id));

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await onSubmit({ userId, role });
      setUserId("");
      setRole("member");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="panel form-grid" onSubmit={submit}>
      <div className="panel-header">
        <h3>Add Team Member</h3>
        <p>Add a registered user to this project using their MongoDB user ID.</p>
      </div>

      <label>
        Registered User
        <select value={userId} onChange={(event) => setUserId(event.target.value)} required>
          <option value="">Select user</option>
          {availableUsers.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </label>

      <label>
        Project Role
        <select value={role} onChange={(event) => setRole(event.target.value)}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
      </label>

      {error ? <p className="error-text">{error}</p> : null}
      {availableUsers.length === 0 ? <p className="muted-text">No more registered users are available to add.</p> : null}

      <button className="primary-button" disabled={loading || availableUsers.length === 0} type="submit">
        {loading ? "Adding..." : "Add Member"}
      </button>
    </form>
  );
}
