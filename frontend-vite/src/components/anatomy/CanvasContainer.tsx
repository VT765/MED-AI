// ─────────────────────────────────────────────────────────────────────────────
// CanvasContainer.tsx — Studio-quality R3F Canvas matching reference image
// Warm cream studio backdrop, key/rim lighting, soft contact shadows.
// ─────────────────────────────────────────────────────────────────────────────

import { Suspense, useRef, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  PerspectiveCamera,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useViewerStore } from "@/stores/useViewerStore";
import { ModelViewer } from "./ModelViewer";
import { LoadingFallback } from "./LoadingFallback";

export function CanvasContainer() {
  const autoRotate = useViewerStore((s) => s.autoRotate);
  const resetTrigger = useViewerStore((s) => s.resetTrigger);
  const zoomTrigger = useViewerStore((s) => s.zoomTrigger);
  const setActiveHotspot = useViewerStore((s) => s.setActiveHotspot);
  const isLoading = useViewerStore((s) => s.isLoading);

  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Animate camera back to default on reset
  useEffect(() => {
    if (resetTrigger > 0 && controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.target.set(0, 0.02, 0);
      controlsRef.current.object.position.set(0, 1.05, 8.2);
      controlsRef.current.update();
    }
  }, [resetTrigger]);

  // Zoom triggers from toolbar buttons
  useEffect(() => {
    if (zoomTrigger !== 0 && controlsRef.current) {
      const camera = controlsRef.current.object;
      const factor = zoomTrigger > 0 ? 0.85 : 1.15;
      camera.position.multiplyScalar(factor);
      controlsRef.current.update();
    }
  }, [zoomTrigger]);

  const handlePointerMissed = useCallback(() => {
    setActiveHotspot(null);
  }, [setActiveHotspot]);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]">
      <Canvas
        gl={{
          antialias: true,
          localClippingEnabled: true,
          toneMapping: 3, // ACESFilmic — richest organic rendering
          toneMappingExposure: 1.25,
        }}
        shadows="soft"
        dpr={[1, 2]}
        onPointerMissed={handlePointerMissed}
        className="!absolute inset-0"
      >
        {/* Camera Setup — calibrated to anatomy-main */}
        <PerspectiveCamera
          makeDefault
          position={[0, 1.05, 8.2]}
          fov={34}
          near={0.1}
          far={60}
        />

        {/* ── Studio Specimen Lighting Matching anatomy-main ── */}
        <ambientLight intensity={0.42} color="#ffffff" />
        <hemisphereLight intensity={0.72} color="#fff8ee" groundColor="#33252d" />

        {/* Key, Fill, and Rim Lights */}
        <directionalLight position={[4.8, 6.5, 6.8]} intensity={3.5} color="#fff3e7" />
        <directionalLight position={[-4.5, 1.2, 5.2]} intensity={1.12} color="#e6ecff" />
        <directionalLight position={[-4, 3.5, -5.5]} intensity={1.6} color="#ffb7a5" />

        {/* Warm Accent & Organ Glow Point Lights */}
        <pointLight position={[-3, -1.4, 3.5]} intensity={0.72} distance={11} decay={2} color="#ff8d70" />
        <pointLight position={[2.8, 0.4, 2.8]} intensity={0.5} distance={8} decay={2} color="#ee7c6a" />

        {/* Studio environment reflections */}
        <Environment preset="city" environmentIntensity={0.35} />

        {/* Soft contact shadow on pedestal */}
        <ContactShadows
          position={[0, -2.32, 0]}
          opacity={0.62}
          scale={5.8}
          blur={2.0}
          far={3.8}
          color="#33252d"
        />

        {/* ── Orbit Controls ────────────────────────────────────────── */}
        <OrbitControls
          ref={controlsRef}
          autoRotate={autoRotate}
          autoRotateSpeed={0.8}
          enablePan={false}
          enableZoom={true}
          enableDamping={true}
          dampingFactor={0.055}
          minDistance={4.5}
          maxDistance={14}
          maxPolarAngle={Math.PI / 2 + 0.1}
          minPolarAngle={0.1}
          target={[0, 0.02, 0]}
        />

        {/* ── Model Viewer with Suspense ────────────────────────────── */}
        <Suspense fallback={<LoadingFallback />}>
          <ModelViewer />
        </Suspense>
      </Canvas>

      {/* Subtle Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-md z-10 pointer-events-none transition-opacity duration-300">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full border-2 border-primary-200 border-t-primary-600 animate-spin" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-r-primary-400 animate-spin" style={{ animationDelay: "-0.4s" }} />
            </div>
            <span className="text-xs font-semibold text-content-secondary tracking-widest uppercase">
              Rendering Specimen…
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
