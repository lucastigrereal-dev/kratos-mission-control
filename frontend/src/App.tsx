import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import TarefasPage from "./pages/TarefasPage";
import ProjetosPage from "./pages/ProjetosPage";
import MissionLensPage from "./pages/MissionLensPage";
import ContextoPage from "./pages/ContextoPage";
import SistemaPage from "./pages/SistemaPage";
import CheckpointsPage from "./pages/CheckpointsPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/mission-lens" replace />} />
        <Route path="/mission-lens" element={<MissionLensPage />} />
        <Route path="/tarefas" element={<TarefasPage />} />
        <Route path="/projetos" element={<ProjetosPage />} />
        <Route path="/contexto" element={<ContextoPage />} />
        <Route path="/sistema" element={<SistemaPage />} />
        <Route path="/checkpoints" element={<CheckpointsPage />} />
      </Routes>
    </Layout>
  );
}
