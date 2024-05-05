import { PropsWithChildren, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type ProtectedRouteProps = PropsWithChildren
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  console.log(token)
  if (!token) {
    navigate("/login", { replace: true })
  }
  return (
    <>
    {children}
    </>
);
};

export default ProtectedRoute;
