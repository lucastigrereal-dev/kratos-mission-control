interface IslandMeshProps {
  position: [number, number, number];
  baseColor: string;
  accentColor: string;
  scale: number;
}

export default function IslandMesh({ position, baseColor, accentColor, scale }: IslandMeshProps) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Island base — low poly hexagon approximation */}
      <mesh position={[0, -0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.9, 0.3, 6]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* Ground surface */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.65, 0.1, 6]} />
        <meshStandardMaterial color={baseColor} opacity={0.7} transparent />
      </mesh>

      {/* Central building block */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={baseColor} />
      </mesh>

      {/* Accent roof */}
      <mesh position={[0, 0.75, 0]}>
        <coneGeometry args={[0.35, 0.35, 4]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.1} />
      </mesh>

      {/* Tiny accent blocks around */}
      {[[0.35, 0.1, 0.35], [-0.35, 0.1, 0.35], [0.35, 0.1, -0.35], [-0.35, 0.1, -0.35]].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <boxGeometry args={[0.15, 0.2, 0.15]} />
          <meshStandardMaterial color={accentColor} opacity={0.5} transparent />
        </mesh>
      ))}
    </group>
  );
}
