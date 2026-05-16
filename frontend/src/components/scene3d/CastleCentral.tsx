export default function CastleCentral() {
  return (
    <group position={[0, 0, 0]} scale={[0.8, 0.8, 0.8]}>
      {/* Base platform */}
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[3.5, 0.2, 3.5]} />
        <meshStandardMaterial color="#475569" />
      </mesh>

      {/* Center tower */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.6, 0.8, 2.2, 8]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>

      {/* Roof cone */}
      <mesh position={[0, 2.6, 0]}>
        <coneGeometry args={[0.9, 0.9, 8]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>

      {/* Gold spire */}
      <mesh position={[0, 3.2, 0]}>
        <coneGeometry args={[0.15, 0.5, 6]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.3} />
      </mesh>

      {/* Corner towers */}
      {[[-1.2, 0, -1.2], [1.2, 0, -1.2], [-1.2, 0, 1.2], [1.2, 0, 1.2]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.3, 0.35, 1.0, 6]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          <mesh position={[0, 1.2, 0]}>
            <coneGeometry args={[0.45, 0.45, 6]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
        </group>
      ))}

      {/* Walls connecting towers */}
      <mesh position={[0, 0.15, 1.2]}>
        <boxGeometry args={[2.4, 0.4, 0.15]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
      <mesh position={[0, 0.15, -1.2]}>
        <boxGeometry args={[2.4, 0.4, 0.15]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
      <mesh position={[1.2, 0.15, 0]}>
        <boxGeometry args={[0.15, 0.4, 2.4]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
      <mesh position={[-1.2, 0.15, 0]}>
        <boxGeometry args={[0.15, 0.4, 2.4]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>

      {/* Gate entrance */}
      <mesh position={[0, 0.35, 1.8]}>
        <boxGeometry args={[0.8, 0.8, 0.1]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}
