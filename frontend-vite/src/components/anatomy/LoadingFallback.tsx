// ─────────────────────────────────────────────────────────────────────────────
// LoadingFallback.tsx — 3D loading indicator inside the R3F Canvas
// Shows a wireframe icosahedron with a pulsing animation + loading text.
// Used as <Suspense fallback={...}> inside CanvasContainer.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Mesh } from "three";

export function LoadingFallback() {
  const meshRef = useRef<Mesh>(null);

  // Gentle rotation animation
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <group>
      {/* Wireframe spinning geometry */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#06b6d4"
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* HTML overlay for loading text */}
      <Html center>
        <div className="flex flex-col items-center gap-3 select-none pointer-events-none">
          {/* Pulsing dot */}
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-cyan-400" />
            <div className="absolute inset-0 w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <p className="text-cyan-300 text-sm font-medium tracking-wider uppercase">
            Loading Model…
          </p>
        </div>
      </Html>
    </group>
  );
}
