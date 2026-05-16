import NavItem from "./NavItem";

const NAV_ITEMS = [
  { label: "Visão Geral", icon: "dashboard", active: true },
  { label: "Omnis", icon: "eye" },
  { label: "Agência", icon: "star" },
  { label: "Akasha", icon: "database" },
  { label: "Filosofia", icon: "diamond" },
  { label: "Finanças", icon: "coin" },
  { label: "Forja", icon: "dumbbell" },
  { label: "Vila", icon: "home" },
  { label: "Arena", icon: "trophy" },
  { label: "Observatório", icon: "compass" },
  { label: "Nimbus", icon: "zap" },
  { label: "Configurações", icon: "settings" },
];

export default function SideBar() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "16px 12px",
        gap: 2,
      }}
    >
      {NAV_ITEMS.map((item) => (
        <NavItem
          key={item.label}
          label={item.label}
          icon={item.icon}
          active={item.active}
          onClick={() => console.log(`Nav: ${item.label}`)}
        />
      ))}
    </div>
  );
}
