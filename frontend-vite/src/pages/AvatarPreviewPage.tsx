// ─────────────────────────────────────────────────────────────────────────────
// AvatarPreviewPage.tsx — DEV-ONLY page to compare voice-mode avatar
// candidates side by side, each with its talking/idle movement playing.
// Visit /avatar-preview. Not linked from anywhere in the app.
// ─────────────────────────────────────────────────────────────────────────────

import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { Box3, Group, Mesh, Object3D, SkinnedMesh, Vector3, Euler } from "three";

type Mode = "talking" | "listening" | "idle";

// ── Shared: normalize any model to height 1, centered ───────────────────────
function useNormalized(url: string) {
  const { scene } = useGLTF(url);
  return useMemo(() => {
    const box = new Box3().setFromObject(scene);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);
    const s = 1 / (size.y || 1);
    return { scene, scale: s, offset: center.multiplyScalar(-s) };
  }, [scene]);
}

// ── Candidates A/D: unrigged models (body motion only) ──────────────────────
function BodyMotionModel({ url, mode }: { url: string; mode: Mode }) {
  const g = useRef<Group>(null);
  const { scene, scale, offset } = useNormalized(url);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!g.current) return;
    if (mode === "talking") {
      const talk = Math.sin(t * 8.5) * 0.5 + Math.sin(t * 13.3) * 0.5;
      g.current.rotation.x = 0.06 + talk * 0.045;
      g.current.rotation.y = Math.sin(t * 1.6) * 0.1;
      g.current.position.y = offset.y + Math.abs(Math.sin(t * 8.5)) * 0.012;
    } else if (mode === "listening") {
      g.current.rotation.x = 0.12;
      g.current.rotation.y = Math.sin(t * 0.5) * 0.06;
      g.current.position.y = offset.y;
    } else {
      g.current.rotation.x = Math.sin(t * 0.7) * 0.02;
      g.current.rotation.y = Math.sin(t * 0.45) * 0.08;
      g.current.position.y = offset.y + Math.sin(t * 1.5) * 0.008;
    }
  });
  return (
    <group ref={g} scale={scale} position={[offset.x, offset.y, offset.z]}>
      <primitive object={scene} />
    </group>
  );
}

// ── Candidates B/C: Ready Player Me avatars (real face + viseme morphs) ─────
function RpmAvatar({ url, mode }: { url: string; mode: Mode }) {
  const g = useRef<Group>(null);
  const { scene, scale, offset } = useNormalized(url);

  const parts = useMemo(() => {
    const faces: SkinnedMesh[] = [];
    scene.traverse((obj: Object3D) => {
      const mesh = obj as SkinnedMesh;
      if (mesh.isSkinnedMesh && mesh.morphTargetDictionary) faces.push(mesh);
    });
    const head = scene.getObjectByName("Head") ?? null;
    return {
      faces,
      head,
      headBase: head ? head.rotation.clone() : new Euler(),
    };
  }, [scene]);

  const setMorph = (name: string, value: number) => {
    for (const face of parts.faces) {
      const idx = face.morphTargetDictionary?.[name];
      if (idx !== undefined && face.morphTargetInfluences) {
        face.morphTargetInfluences[idx] = value;
      }
    }
  };

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const { head, headBase } = parts;

    // Blink
    const blinkPhase = (t % 3.3) / 3.3;
    const blink = blinkPhase > 0.96 ? 1 : 0;
    setMorph("eyesClosed", blink);
    setMorph("eyeBlinkLeft", blink);
    setMorph("eyeBlinkRight", blink);

    if (mode === "talking") {
      const talk = Math.max(0, Math.sin(t * 9) * 0.55 + Math.sin(t * 14.3) * 0.45);
      setMorph("mouthOpen", 0.1 + talk * 0.6);
      setMorph("viseme_aa", 0.1 + talk * 0.7);
      setMorph("jawOpen", 0.05 + talk * 0.35);
      setMorph("mouthSmile", 0.12);
      if (head) {
        head.rotation.x = headBase.x + Math.sin(t * 3.1) * 0.05;
        head.rotation.y = headBase.y + Math.sin(t * 1.3) * 0.06;
      }
    } else if (mode === "listening") {
      setMorph("mouthOpen", 0.02);
      setMorph("viseme_aa", 0);
      setMorph("jawOpen", 0);
      setMorph("mouthSmile", 0.35);
      if (head) {
        head.rotation.z = headBase.z + 0.1;
        head.rotation.x = headBase.x + 0.05;
        head.rotation.y = headBase.y + Math.sin(t * 0.5) * 0.04;
      }
    } else {
      setMorph("mouthOpen", 0);
      setMorph("viseme_aa", 0);
      setMorph("jawOpen", 0);
      setMorph("mouthSmile", 0.2);
      if (head) {
        head.rotation.x = headBase.x + Math.sin(t * 0.7) * 0.02;
        head.rotation.y = headBase.y + Math.sin(t * 0.45) * 0.06;
        head.rotation.z = headBase.z;
      }
    }
  });

  return (
    <group ref={g} scale={scale} position={[offset.x, offset.y, offset.z]}>
      <primitive object={scene} />
    </group>
  );
}

// ── Preview card ────────────────────────────────────────────────────────────
function PreviewCard({
  title,
  subtitle,
  mode,
  children,
  cameraY,
  cameraZ,
}: {
  title: string;
  subtitle: string;
  mode: Mode;
  children: React.ReactNode;
  cameraY: number;
  cameraZ: number;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden">
      <div className="h-[380px] bg-gradient-to-b from-stone-50 to-teal-50/40">
        <Canvas dpr={[1, 2]} gl={{ alpha: true, antialias: true }} camera={{ position: [0, cameraY, cameraZ], fov: 34 }}>
          <hemisphereLight args={["#ffffff", "#99f6e4", 0.8]} />
          <directionalLight position={[1.5, 2, 3]} intensity={1.4} />
          <directionalLight position={[-2, 0.5, 2]} intensity={0.5} />
          <directionalLight position={[-1, 1.5, -2.5]} intensity={0.7} color="#5eead4" />
          <Suspense fallback={null}>{children}</Suspense>
          <OrbitControls enablePan={false} enableZoom={true} target={[0, cameraY, 0]} />
        </Canvas>
      </div>
      <div className="p-4 border-t border-stone-100">
        <h3 className="text-sm font-bold text-stone-800">{title}</h3>
        <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>
        <p className="text-[11px] text-teal-600 mt-1 font-medium">Showing: {mode}</p>
      </div>
    </div>
  );
}

export function AvatarPreviewPage() {
  const [mode, setMode] = useState<Mode>("talking");

  return (
    <div className="min-h-screen bg-stone-50 p-6 sm:p-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold text-stone-900">Voice Avatar Candidates</h1>
        <p className="mt-1 text-sm text-stone-500">
          Drag to rotate, scroll to zoom. Switch the state to see each one move.
        </p>

        <div className="mt-4 flex gap-2">
          {(["talking", "listening", "idle"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                mode === m ? "bg-teal-600 text-white" : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-100"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <PreviewCard
            title="A — Low-poly Doctor"
            subtitle="Doctor outfit + stethoscope. No face rig — moves with body language only."
            mode={mode}
            cameraY={0.02}
            cameraZ={1.85}
          >
            <BodyMotionModel url="/models/doctor_lowpoly.glb" mode={mode} />
          </PreviewCard>

          <PreviewCard
            title="D — Photorealistic Doctor (deep3dstudio)"
            subtitle="Real photo-scan, CC-BY. Hyper-realistic but rigid — body motion only, lips don't move."
            mode={mode}
            cameraY={0.02}
            cameraZ={1.85}
          >
            <BodyMotionModel url="/models/doctor_realistic.glb" mode={mode} />
          </PreviewCard>

          <PreviewCard
            title="B — Realistic Male Avatar"
            subtitle="Ready Player Me. Real face, moving lips + teeth, blinks. Casual outfit (not a coat)."
            mode={mode}
            cameraY={0.32}
            cameraZ={0.75}
          >
            <RpmAvatar url="/models/avatar_male.glb" mode={mode} />
          </PreviewCard>

          <PreviewCard
            title="C — Realistic Female Avatar"
            subtitle="Ready Player Me. Real face with 67 expressions, moving lips, blinks. Casual outfit."
            mode={mode}
            cameraY={0.32}
            cameraZ={0.75}
          >
            <RpmAvatar url="/models/avatar_female.glb" mode={mode} />
          </PreviewCard>
        </div>

        <p className="mt-6 text-xs text-stone-400">
          Tell Claude which one to wire into voice mode (A / B / C) — or drop a downloaded
          Sketchfab doctor GLB into public/models/doctor_realistic.glb to add it here.
        </p>
      </div>
    </div>
  );
}
