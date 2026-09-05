// ─────────────────────────────────────────────────────────────────────────────
// VoiceDoctorAvatar.tsx — 3D doctor for voice mode (R3F).
// Model: "Doctor - Sketchfab Weekly - 13 Mar'23" by BrushDip (Sketchfab),
// CC Attribution. Rigged with a built-in idle animation ("Take 001") which
// plays continuously; state-aware whole-body motion is layered on top
// (talking nods while speaking, attentive lean while listening, sway while
// thinking).
// ─────────────────────────────────────────────────────────────────────────────

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { Box3, Group, Vector3 } from "three";

export type AvatarState = "idle" | "listening" | "processing" | "speaking";

interface VoiceDoctorAvatarProps {
  state: AvatarState;
  /** Live mic level 0..1 while listening. */
  level?: number;
  className?: string;
}

const MODEL_URL = "/models/doctor_toon.glb";

function DoctorModel({ state, level = 0 }: { state: AvatarState; level?: number }) {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions, names } = useAnimations(animations, group);

  // Play the model's built-in animation on loop
  useEffect(() => {
    const action = actions[names[0]];
    if (action) {
      action.reset().fadeIn(0.3).play();
      return () => { action.fadeOut(0.3); };
    }
  }, [actions, names]);

  // Normalize: center the model and scale it to a height of 1 unit so the
  // camera framing is independent of the source file's units.
  const { scale, offset } = useMemo(() => {
    const box = new Box3().setFromObject(scene);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);
    const s = 1 / (size.y || 1);
    return { scale: s, offset: center.multiplyScalar(-s) };
  }, [scene]);

  // No layered motion — the model's own animation is enough. The `state` and
  // `level` props are kept for API compatibility (status text conveys state).
  void state;
  void level;

  return (
    <group ref={group} scale={scale} position={[offset.x, offset.y, offset.z]}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);

export function VoiceDoctorAvatar({ state, level = 0, className }: VoiceDoctorAvatarProps) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0.02, 1.85], fov: 34 }}
        style={{ background: "transparent" }}
      >
        <hemisphereLight args={["#ffffff", "#e7e5e4", 0.9]} />
        <directionalLight position={[1.5, 2, 3]} intensity={1.5} />
        <directionalLight position={[-2, 0.5, 2]} intensity={0.6} />
        <directionalLight position={[-1, 1.5, -2.5]} intensity={0.5} color="#99f6e4" />
        <Suspense fallback={null}>
          <DoctorModel state={state} level={level} />
        </Suspense>
      </Canvas>
    </div>
  );
}
