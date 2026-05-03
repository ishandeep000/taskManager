import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddMemberForm from "../components/AddMemberForm.jsx";
import TaskForm from "../components/TaskForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../services/api.js";

export default function ProjectPage() {
  const { projectId } = useParams();
  const { token, user } = useAuth();
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadProject = async () => {
    setLoading(true);
    setError("");
    try {
      const [projectData, usersData] = await Promise.all([
        apiRequest(`/projects/${projectId}`, { token }),
        apiRequest("/users", { token })
      ]);
      setProject(projectData);
      setUsers(usersData);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const myMembership = project?.members.find((member) => member.user._id === user.id);
  const isProjectAdmin = myMembership?.role === "admin";

  const createTask = async (payload) => {
    await apiRequest("/tasks", {
      method: "POST",
      token,
      body: {
        ...payload,
        projectId
      }
    });
    await loadProject();
  };

  const addMember = async (payload) => {
    await apiRequest(`/projects/${projectId}/members`, {
      method: "POST",
      token,
      body: payload
    });
    await loadProject();
  };

  const updateTaskStatus = async (taskId, status) => {
    await apiRequest(`/tasks/${taskId}`, {
      method: "PUT",
      token,
      body: { status }
    });
    await loadProject();
  };

  if (loading) {
    return <div className="screen-center">Loading project...</div>;
  }

  if (error) {
    return <div className="screen-center error-text">{error}</div>;
  }

  return (
    <div className="page-stack">
      <section className="hero-card app-hero">
        <div className="hero-copy">
          <p className="eyebrow">Project</p>
          <h2>{project.name}</h2>
          <p className="muted-text">{project.description || "No description available."}</p>
        </div>
        <div className="hero-metrics">
          <div className="metric-card lilac">
            <span>Members</span>
            <strong>{project.members.length}</strong>
          </div>
          <div className="metric-card lilac">
            <span>Tasks</span>
            <strong>{project.tasks.length}</strong>
          </div>
        </div>
      </section>

      {isProjectAdmin ? (
        <section className="grid-two">
          <TaskForm members={project.members} onSubmit={createTask} />
          <AddMemberForm currentMembers={project.members} users={users} onSubmit={addMember} />
        </section>
      ) : null}

      <section className="panel">
        <div className="panel-header">
          <h3>Team Members</h3>
          <p>Roles within this project.</p>
        </div>
        <div className="table-list">
          {project.members.map((member) => (
            <div className="table-row task-pill-row" key={member.user._id}>
              <div>
                <strong>{member.user.name}</strong>
                <p>{member.user.email}</p>
              </div>
              <span className="badge">{member.role}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>Tasks</h3>
          <p>Update statuses as the team moves work forward.</p>
        </div>
        <div className="table-list">
          {project.tasks.map((task) => (
            <div className="task-row task-pill-row" key={task._id}>
              <div>
                <strong>{task.title}</strong>
                <p>{task.description || "No description"}</p>
                <small>
                  Assigned to {task.assignedTo?.name} • Due{" "}
                  {new Date(task.dueDate).toLocaleDateString()}
                </small>
              </div>
              <div className="task-actions">
                <span className={`badge priority-${task.priority}`}>{task.priority}</span>
                <select value={task.status} onChange={(event) => updateTaskStatus(task._id, event.target.value)}>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
          ))}
          {project.tasks.length === 0 ? <p className="muted-text">No tasks created yet.</p> : null}
        </div>
      </section>
    </div>
  );
}
