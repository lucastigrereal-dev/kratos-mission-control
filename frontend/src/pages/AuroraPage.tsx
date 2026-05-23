import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuroraFullScreenPanel from "../components/AuroraFullScreenPanel";

export default function AuroraPage() {
  const navigate = useNavigate();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        navigate("/visao-geral");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      background: "var(--kr-world-bg, #0a0d1a)",
      display: "flex",
      flexDirection: "column",
    }}>
      <AuroraFullScreenPanel onClose={() => navigate("/visao-geral")} />
    </div>
  );
}
