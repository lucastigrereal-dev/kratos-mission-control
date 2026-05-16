import MusicPlayer from "../overlay/MusicPlayer";
import NimbusCard from "../overlay/NimbusCard";
import SquadSelector from "../overlay/SquadSelector";

export default function BottomBar({ onOpenNimbus }: { onOpenNimbus?: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "100%",
        padding: "0 16px",
        gap: 8,
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      <MusicPlayer />
      <NimbusCard onOpen={onOpenNimbus} />
      <SquadSelector />
    </div>
  );
}
