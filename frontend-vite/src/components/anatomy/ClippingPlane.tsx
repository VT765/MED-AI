// ─────────────────────────────────────────────────────────────────────────────
// ClippingPlane.tsx — Cross-section clipping plane logic
// Creates a THREE.Plane that clips the 3D model to reveal internal structure.
// Controlled by the clippingPosition slider in Zustand state.
//
// HOW IT WORKS:
// 1. A THREE.Plane is created with a Y-axis normal (slices horizontally)
// 2. The plane.constant is mapped from the 0..1 slider to the model's Y bounds
// 3. On each frame, all meshes in the scene have their material.clippingPlanes
//    updated to include this plane
// 4. A translucent disc visualizes the cutting plane position
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useViewerStore } from "@/stores/useViewerStore";

interface ClippingPlaneProps {
  /** Y-axis bounds of the model [min, max] */
  modelBounds: [number, number];
}

export function ClippingPlane({ modelBounds }: ClippingPlaneProps) {
  const clippingEnabled = useViewerStore((s) => s.clippingEnabled);
  const clippingPosition = useViewerStore((s) => s.clippingPosition);
  const { scene } = useThree();
  const planeRef = useRef<THREE.Mesh>(null);

  // Create the clipping plane (Y-axis normal = horizontal slice)
  const clipPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 0), []);

  // Map the 0..1 slider value to the model's actual Y bounds
  const mappedY = useMemo(() => {
    const [minY, maxY] = modelBounds;
    const range = maxY - minY;
    // Invert: position=0 means no clipping (plane above model),
    // position=1 means fully clipped (plane below model)
    return maxY - clippingPosition * range;
  }, [clippingPosition, modelBounds]);

  // Update the plane constant each frame for smooth animation
  useFrame(() => {
    if (clippingEnabled) {
      // Lerp for smooth transition
      clipPlane.constant += (mappedY - clipPlane.constant) * 0.1;
    }
  });

  // Apply or remove clipping planes from all meshes in the scene
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];

        materials.forEach((mat) => {
          if (clippingEnabled) {
            mat.clippingPlanes = [clipPlane];
            mat.clipShadows = true;
            mat.needsUpdate = true;
          } else {
            mat.clippingPlanes = [];
            mat.needsUpdate = true;
          }
        });
      }
    });

    // Cleanup: remove clipping planes when component unmounts
    return () => {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];
          materials.forEach((mat) => {
            mat.clippingPlanes = [];
            mat.needsUpdate = true;
          });
        }
      });
    };
  }, [clippingEnabled, clipPlane, scene]);

  if (!clippingEnabled) return null;

  return (
    <>
      {/* Visual indicator: translucent disc showing the cutting plane */}
      <mesh
        ref={planeRef}
        position={[0, mappedY, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0, 2, 64]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Edge ring for better visibility */}
      <mesh
        position={[0, mappedY, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[1.95, 2, 64]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}
