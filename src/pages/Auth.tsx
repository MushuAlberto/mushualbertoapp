import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect everyone to home since auth is no longer required
    navigate("/");
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-violet-500 font-bold">Cargando...</div>
    </div>
  );
};

export default Auth;
