import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import VisaoGeralPage from "./pages/VisaoGeralPage";
import TarefasPage from "./pages/TarefasPage";
import ProjetosPage from "./pages/ProjetosPage";
import MissionLensPage from "./pages/MissionLensPage";
import ContextoPage from "./pages/ContextoPage";
import SistemaPage from "./pages/SistemaPage";
import CheckpointsPage from "./pages/CheckpointsPage";
import OmnisPage from "./pages/OmnisPage";
import ApprovalsPage from "./pages/ApprovalsPage";
import AuroraPage from "./pages/AuroraPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/visao-geral" replace />} />
        <Route path="/visao-geral" element={<VisaoGeralPage />} />
        <Route path="/mission-lens" element={<MissionLensPage />} />
        <Route path="/tarefas" element={<TarefasPage />} />
        <Route path="/projetos" element={<ProjetosPage />} />
        <Route path="/contexto" element={<ContextoPage />} />
        <Route path="/sistema" element={<SistemaPage />} />
        <Route path="/checkpoints" element={<CheckpointsPage />} />
        <Route path="/omnis" element={<OmnisPage />} />
        <Route path="/approvals" element={<ApprovalsPage />} />
        <Route path="/aurora" element={<AuroraPage />} />
      </Routes>
    </Layout>
  );
}
