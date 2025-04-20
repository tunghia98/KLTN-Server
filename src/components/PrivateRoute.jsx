import { useUser } from "../contexts/UserContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Đang kiểm tra phiên đăng nhập...</div>;  // hoặc loading spinner
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default PrivateRoute;
