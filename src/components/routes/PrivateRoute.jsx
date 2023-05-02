/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

export const PrivateRoute = ({ children }) => {
  const { currentUser } = UserAuth();
  if (!currentUser) {
    return <Navigate to="/login" replace={true} />;
  }
  return children;
};
