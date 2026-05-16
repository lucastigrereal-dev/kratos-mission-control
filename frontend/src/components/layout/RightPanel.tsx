import AuroraCard from "../overlay/AuroraCard";
import FocusDayCard from "../overlay/FocusDayCard";
import ProgressCard from "../overlay/ProgressCard";
import QuoteCard from "../overlay/QuoteCard";
import AgendaTodayCard from "../overlay/AgendaTodayCard";

export default function RightPanel({ onOpenAurora }: { onOpenAurora?: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "10px 12px",
        gap: 8,
        overflow: "hidden",
      }}
    >
      <AuroraCard onChatClick={onOpenAurora} />
      <FocusDayCard />
      <ProgressCard />
      <QuoteCard />
      <AgendaTodayCard />
    </div>
  );
}
