import { useNavigate } from "react-router-dom";
import { useFakeAuth } from "../Context/AuthContext";
import { useEffect } from "react";

function ProtectRoutes({ children }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useFakeAuth();

  useEffect(
    function () {
      if (!isAuthenticated) {
        navigate("/");
      }
    },
    [isAuthenticated, navigate]
  );

  return isAuthenticated ? children : null;
}

export default ProtectRoutes;
