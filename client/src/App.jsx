import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";
import Layout from "./components/Layout.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, booting } = useAuth();

  if (booting) {
    return <div className="screen-center">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/signup" element={user ? <Navigate to="/" replace /> : <SignupPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="projects/:projectId" element={<ProjectPage />} />
      </Route>
    </Routes>
  );
}
