import { ReactNode, useEffect } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { id: docId } = useParams<{ id: string }>();
  console.log(docId);

  return children;
};

export default ProtectedRoute;
