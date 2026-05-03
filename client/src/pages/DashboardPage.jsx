import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { apiRequest } from "../services/api.js";
import ProjectForm from "../components/ProjectForm.jsx";

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [dashboardData, projectData] = await Promise.all([
        apiRequest("/dashboard", { token }),
        apiRequest("/projects", { token })
      ]);
      setDashboard(dashboardData);
      setProjects(projectData);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createProject = async (payload) => {
    await apiRequest("/projects", {
      method: "POST",
      token,
      body: payload
    });
    await loadData();
  };

  if (loading) {
    return <div className="screen-center">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="screen-center error-text">{error}</div>;
  }

  return (
    <div className="page-stack">
      <section className="hero-card app-hero">
        <div className="hero-copy">
          <div className="hello-row">
            <div className="avatar-badge">{user?.name?.charAt(0) || "U"}</div>
            <div>
              <p className="eyebrow">Hello</p>
              <h2>{user?.name}</h2>
            </div>
          </div>
          <p className="muted-text">Let&apos;s check out your current tasks, projects, and team progress.</p>
          <div className="focus-card">
            <div className="focus-progress">
              <span>Task completion</span>
              <strong>
                {dashboard.summary.totalTasks
                  ? Math.round((dashboard.summary.tasksByStatus.done / dashboard.summary.totalTasks) * 100)
                  : 0}
                %
              </strong>
            </div>
            <div className="progress-bar">
              <span
                style={{
                  width: `${dashboard.summary.totalTasks
                    ? Math.round((dashboard.summary.tasksByStatus.done / dashboard.summary.totalTasks) * 100)
                    : 0}%`
                }}
              />
            </div>
            <p>You have {dashboard.summary.totalTasks - dashboard.summary.tasksByStatus.done} more tasks to do.</p>
          </div>
        </div>

        <div className="hero-metrics">
          <div className="metric-card lilac">
            <span>Total projects</span>
            <strong>{dashboard.summary.totalProjects}</strong>
          </div>
          <div className="metric-card lilac">
            <span>Total tasks</span>
            <strong>{dashboard.summary.totalTasks}</strong>
          </div>
          <div className="metric-card danger">
            <span>Overdue</span>
            <strong>{dashboard.summary.overdueTasks}</strong>
          </div>
        </div>
      </section>

      <section className="grid-two">
        <ProjectForm onSubmit={createProject} />

        <div className="panel">
          <div className="panel-header">
            <h3>Task Categories</h3>
            <p>Quick breakdown of your workload today.</p>
          </div>
          <div className="status-grid status-grid-compact">
            {Object.entries(dashboard.summary.tasksByStatus).map(([status, count]) => (
              <div className="status-box" key={status}>
                <span>{status.replace("-", " ")}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>Project cards</h3>
          <p>Open a project to manage members, due dates, and tasks.</p>
        </div>

        <div className="card-grid">
          {projects.map((project) => (
            <Link className="project-card" key={project._id} to={`/projects/${project._id}`}>
              <div>
                <h4>{project.name}</h4>
                <p>{project.description || "No description yet."}</p>
              </div>
              <div className="project-meta">
                <span>{project.members.length} members</span>
                <span>{project.taskCount} tasks</span>
                <span>{project.progress}% done</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>Today&apos;s Tasks</h3>
          <p>Everything currently assigned to you.</p>
        </div>
        <div className="table-list">
          {dashboard.assignedTasks.map((task) => (
            <div className="table-row task-pill-row" key={task._id}>
              <div>
                <strong>{task.title}</strong>
                <p>{task.project?.name}</p>
              </div>
              <span className="badge">{task.status}</span>
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          ))}
          {dashboard.assignedTasks.length === 0 ? <p className="muted-text">No tasks assigned yet.</p> : null}
        </div>
      </section>
    </div>
  );
}
