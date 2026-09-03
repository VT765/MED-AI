// ─────────────────────────────────────────────────────────────────────────────
// ModelViewer.tsx — Photorealistic 3D Organ Model Renderer
// Powered by Three.js GLTFLoader with MeshoptDecoder and calibrated materials
// matching anatomy-main's high-fidelity medical specimen pipeline.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useEffect, useMemo, Suspense } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { useViewerStore } from "@/stores/useViewerStore";
import { getOrganById } from "@/data/anatomyData";
import { Hotspot } from "./Hotspot";
import { ClippingPlane } from "./ClippingPlane";

const FIT_SIZE = 3.8;

// ─────────────────────────────────────────────────────────────────────────────
// GLTF Organ Specimen
// ─────────────────────────────────────────────────────────────────────────────

interface OrganSpecimenProps {
  modelPath: string;
  organId: string;
  onBoundsComputed: (bounds: [number, number]) => void;
}

function OrganSpecimen({ modelPath, organId, onBoundsComputed }: OrganSpecimenProps) {
  const gltf = useLoader(GLTFLoader, modelPath, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });

  const isolateMode = useViewerStore((s) => s.isolateMode);
  const showLayers = useViewerStore((s) => s.showLayers);
  const heartbeatAnimation = useViewerStore((s) => s.heartbeatAnimation);
  const setIsLoading = useViewerStore((s) => s.setIsLoading);
  const pivotRef = useRef<THREE.Group>(null);

  // Normalize model scale and center at origin
  const normalizedScene = useMemo(() => {
    const sceneClone = gltf.scene.clone(true);
    const box = new THREE.Box3().setFromObject(sceneClone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = FIT_SIZE / Math.max(size.x, size.y, size.z, 0.001);

    sceneClone.scale.setScalar(scale);
    sceneClone.position.copy(center.multiplyScalar(-scale));

    // Compute Y-bounds after normalization
    const normalizedBox = new THREE.Box3().setFromObject(sceneClone);
    onBoundsComputed([normalizedBox.min.y, normalizedBox.max.y]);

    return sceneClone;
  }, [gltf.scene, onBoundsComputed]);

  // Apply high-fidelity materials matching anatomy-main
  useEffect(() => {
    normalizedScene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.frustumCulled = false;
      child.castShadow = false;
      child.receiveShadow = false;

      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((mat) => {
        mat.transparent = isolateMode || !showLayers;
        mat.opacity = isolateMode ? 0.45 : (!showLayers ? 0.35 : 1.0);
        mat.depthWrite = true;
        mat.depthTest = true;
        mat.side = THREE.FrontSide;

        if (mat instanceof THREE.MeshStandardMaterial) {
          mat.wireframe = isolateMode;
          mat.roughness = THREE.MathUtils.clamp(mat.roughness ?? 0.5, 0.42, 0.62);
          mat.metalness = 0;
          mat.envMapIntensity = 0.32;
          mat.emissive.set(0x000000);
          mat.emissiveIntensity = 0;

          if ("clearcoat" in mat) {
            const physical = mat as unknown as {
              clearcoat: number;
              clearcoatRoughness: number;
              transmission: number;
              thickness: number;
            };
            physical.clearcoat = Math.min(Math.max(physical.clearcoat ?? 0.1, 0.08), 0.12);
            physical.clearcoatRoughness = 0.62;
            physical.transmission = 0;
            physical.thickness = 0;
          }

          if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
          if (mat.normalMap) mat.normalScale.multiplyScalar(0.62);

          const maps = [
            mat.map,
            mat.normalMap,
            mat.roughnessMap,
            mat.metalnessMap,
            mat.aoMap,
            mat.emissiveMap,
          ];

          maps.forEach((m) => {
            if (!m) return;
            m.anisotropy = 8;
            m.generateMipmaps = true;
            m.minFilter = THREE.LinearMipmapLinearFilter;
            m.magFilter = THREE.LinearFilter;
            m.needsUpdate = true;
          });
        }
        mat.needsUpdate = true;
      });
    });

    setIsLoading(false);
  }, [normalizedScene, isolateMode, showLayers, setIsLoading]);

  // Cardiac pulsation animation
  useFrame(({ clock }) => {
    if (!pivotRef.current) return;
    if (organId === "heart" && heartbeatAnimation) {
      const t = clock.getElapsedTime() * 4.8;
      const pulse = 1 + Math.sin(t) * 0.035 + Math.sin(t * 2) * 0.015;
      pivotRef.current.scale.set(pulse, pulse, pulse);
    } else {
      pivotRef.current.scale.set(1, 1, 1);
    }
  });

  const organ = getOrganById(organId);

  return (
    <group ref={pivotRef} rotation={[0.05, -0.28, 0]}>
      <primitive object={normalizedScene} />

      {/* Interactive 3D Hotspots in pivot coordinates */}
      {organ?.hotspots.map((hotspot) => (
        <Hotspot key={hotspot.id} hotspot={hotspot} />
      ))}
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Studio Plinth Pedestal
// ─────────────────────────────────────────────────────────────────────────────
function StudioPedestal() {
  return (
    <mesh position={[0, -2.5, 0]}>
      <cylinderGeometry args={[2.3, 2.48, 0.34, 56]} />
      <meshStandardMaterial color="#ead7c1" roughness={0.78} metalness={0} />
    </mesh>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Error Boundary Fallback
// ─────────────────────────────────────────────────────────────────────────────
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  resetKey: string;
}
interface ErrorBoundaryState {
  hasError: boolean;
}

class ModelErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }
  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main ModelViewer
// ─────────────────────────────────────────────────────────────────────────────
export function ModelViewer() {
  const activeOrganId = useViewerStore((s) => s.activeOrganId);
  const groupRef = useRef<THREE.Group>(null);
  const [modelBounds, setModelBounds] = React.useState<[number, number]>([-1.9, 1.9]);
  const [animProgress, setAnimProgress] = React.useState(0);

  const organ = useMemo(() => getOrganById(activeOrganId), [activeOrganId]);

  useEffect(() => {
    setAnimProgress(0);
  }, [activeOrganId]);

  useFrame((_, delta) => {
    if (animProgress < 1) {
      const next = Math.min(animProgress + delta * 2.5, 1);
      setAnimProgress(next);
      if (groupRef.current) {
        const eased = 1 - Math.pow(1 - next, 3);
        groupRef.current.scale.setScalar(eased);
      }
    }
  });

  if (!organ) return null;

  return (
    <group ref={groupRef} position={[0, 0.05, 0]}>
      {/* ── Studio Pedestal ── */}
      <StudioPedestal />

      {/* ── Photorealistic 3D Model ── */}
      <ModelErrorBoundary
        resetKey={activeOrganId}
        fallback={
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#94a3b8" wireframe />
          </mesh>
        }
      >
        <Suspense fallback={null}>
          <OrganSpecimen
            key={organ.id}
            modelPath={organ.modelPath}
            organId={organ.id}
            onBoundsComputed={setModelBounds}
          />
        </Suspense>
      </ModelErrorBoundary>

      {/* ── Cross-Section Clipping Plane ── */}
      <ClippingPlane modelBounds={modelBounds} />
    </group>
  );
}
