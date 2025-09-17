import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const user = JSON.parse(localStorage.getItem("LoggedInUser"));
    if (!user) return <Navigate to="/login" />;
    if (adminOnly && user.role !== "admin") return <Navigate to="/" />;

  return children; // allowed
};

export default ProtectedRoute;
