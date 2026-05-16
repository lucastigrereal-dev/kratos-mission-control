import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export default function IsometricCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);

    const aspect = size.width / size.height;
    const frustumSize = 14;
    const left = -frustumSize * aspect * 0.5;
    const right = frustumSize * aspect * 0.5;
    const top = frustumSize * 0.5;
    const bottom = -frustumSize * 0.5;

    (camera as any).left = left;
    (camera as any).right = right;
    (camera as any).top = top;
    (camera as any).bottom = bottom;
    (camera as any).near = -50;
    (camera as any).far = 50;
    (camera as any).zoom = 1;
    (camera as any).updateProjectionMatrix();

    camera.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}
