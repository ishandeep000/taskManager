import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const themeStorageKey = "team-task-manager-theme";
const allowedThemes = new Set(["light", "dark"]);

export default function Layout() {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem(themeStorageKey) || "light";
    return allowedThemes.has(savedTheme) ? savedTheme : "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-content">
          <div>
            <p className="eyebrow">Team Task Manager</p>
            <h1>Workspace</h1>
            <p className="sidebar-copy">Track projects, manage assignments, and keep delivery moving.</p>
          </div>

          <nav className="nav-list">
            <NavLink to="/" end className="nav-link">
              Dashboard
            </NavLink>
          </nav>
        </div>

        <div className="profile-card">
          <strong>{user?.name}</strong>
          <span>{user?.email}</span>
          <span className="badge">{user?.systemRole}</span>
          <button className="secondary-button" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-panel">
        <div className="main-toolbar">
          <button
            className={`theme-toggle ${theme === "dark" ? "is-dark" : "is-light"}`}
            onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
            type="button"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            <span className="theme-toggle-label theme-toggle-label-light">Light</span>
            <span className="theme-toggle-track">
              <span className="theme-toggle-thumb">
                <span className="theme-icon">{theme === "light" ? "☀" : "☾"}</span>
              </span>
            </span>
            <span className="theme-toggle-label theme-toggle-label-dark">Dark</span>
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
