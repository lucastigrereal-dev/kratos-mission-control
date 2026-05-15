import { useKratosContext } from "../components/Layout";
import KratosWorldMap from "../components/KratosWorldMap";

export default function VisaoGeralPage() {
  const { currentMission } = useKratosContext();
  return <KratosWorldMap currentMission={currentMission} />;
}
