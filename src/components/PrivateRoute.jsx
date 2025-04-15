// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useUser();

  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />;
  
  return children;
};

export default PrivateRoute;
