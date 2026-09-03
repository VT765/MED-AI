// ─────────────────────────────────────────────────────────────────────────────
// ViewerToolbar.tsx — Floating controls for 3D Viewport
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Minimize2,
  Sliders,
  Layers,
  Columns,
  RefreshCw,
  Lightbulb,
  Check,
  X,
  Eye,
  Activity,
} from "lucide-react";
import { useViewerStore } from "@/stores/useViewerStore";
import { getOrganById } from "@/data/anatomyData";

export function ViewerToolbar() {
  const activeOrganId = useViewerStore((s) => s.activeOrganId);
  const autoRotate = useViewerStore((s) => s.autoRotate);
  const toggleAutoRotate = useViewerStore((s) => s.toggleAutoRotate);
  const clippingEnabled = useViewerStore((s) => s.clippingEnabled);
  const toggleClipping = useViewerStore((s) => s.toggleClipping);
  const clippingPosition = useViewerStore((s) => s.clippingPosition);
  const setClippingPosition = useViewerStore((s) => s.setClippingPosition);
  const isolateMode = useViewerStore((s) => s.isolateMode);
  const toggleIsolateMode = useViewerStore((s) => s.toggleIsolateMode);
  const isLayersMenuOpen = useViewerStore((s) => s.isLayersMenuOpen);
  const setIsLayersMenuOpen = useViewerStore((s) => s.setIsLayersMenuOpen);
  const layerVisibility = useViewerStore((s) => s.layerVisibility);
  const toggleLayerVisibility = useViewerStore((s) => s.toggleLayerVisibility);
  const compareMode = useViewerStore((s) => s.compareMode);
  const toggleCompareMode = useViewerStore((s) => s.toggleCompareMode);
  const triggerZoomIn = useViewerStore((s) => s.triggerZoomIn);
  const triggerZoomOut = useViewerStore((s) => s.triggerZoomOut);
  const resetCamera = useViewerStore((s) => s.resetCamera);
  const [showTip, setShowTip] = useState(true);

  const organ = getOrganById(activeOrganId);

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10">
      {/* ── Top-Right Floating Tip Card ─────────────────────────────── */}
      {showTip && (
        <div className="absolute top-4 right-4 pointer-events-auto transition-all">
          <div className="rounded-2xl p-3.5 shadow-md max-w-[210px] relative border border-stone-200 bg-white/95 backdrop-blur-md">
            <button
              onClick={() => setShowTip(false)}
              className="absolute top-2 right-2 text-stone-400 hover:text-stone-700 p-0.5 rounded"
              title="Dismiss tip"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 mb-1.5">
              <Lightbulb className="w-3.5 h-3.5 fill-amber-100 text-amber-600" />
              <span>3D Navigation Tip</span>
            </div>
            <div className="space-y-1 text-[11px] text-content-secondary leading-snug">
              <p>• Left Click + Drag to rotate</p>
              <p>• Right Click + Drag to pan</p>
              <p>• Scroll wheel or Zoom to scale</p>
              <p>• Click hotspots to inspect</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Left Floating Vertical Tool Stack ───────────────────────── */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 pointer-events-auto">
        {/* Rotate Button */}
        <ToolButton
          icon={RotateCcw}
          label="Rotate"
          isActive={autoRotate}
          onClick={toggleAutoRotate}
        />

        {/* Zoom Controls (Zoom In & Zoom Out) */}
        <div className="flex gap-1">
          <button
            onClick={triggerZoomIn}
            className="flex-1 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 border border-stone-200 bg-white/95 backdrop-blur-md text-stone-700 hover:text-primary-700 hover:border-primary-300 hover:bg-stone-50/80 shadow-xs transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5 text-stone-500" />
            <span className="text-[9px] font-semibold">+Zoom</span>
          </button>
          <button
            onClick={triggerZoomOut}
            className="flex-1 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 border border-stone-200 bg-white/95 backdrop-blur-md text-stone-700 hover:text-primary-700 hover:border-primary-300 hover:bg-stone-50/80 shadow-xs transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5 text-stone-500" />
            <span className="text-[9px] font-semibold">-Zoom</span>
          </button>
        </div>

        {/* Isolate Mode */}
        <ToolButton
          icon={Minimize2}
          label="Isolate"
          isActive={isolateMode}
          onClick={toggleIsolateMode}
        />

        {/* Cross-section */}
        <ToolButton
          icon={Sliders}
          label="Cross-section"
          isActive={clippingEnabled}
          onClick={toggleClipping}
        />

        {/* Layers with Flyout Popover */}
        <div className="relative">
          <ToolButton
            icon={Layers}
            label="Layers"
            isActive={isLayersMenuOpen}
            onClick={() => setIsLayersMenuOpen(!isLayersMenuOpen)}
          />

          {/* Layers Popover Menu */}
          {isLayersMenuOpen && (
            <div className="absolute left-full ml-3 top-0 w-56 border border-stone-200 rounded-2xl p-3 shadow-xl z-30 animate-fade-in pointer-events-auto bg-white/95 backdrop-blur-md">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200 mb-2">
                <span className="text-xs font-bold text-content-primary">
                  Anatomical Layers
                </span>
                <button
                  onClick={() => setIsLayersMenuOpen(false)}
                  className="text-stone-400 hover:text-stone-700 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-1.5">
                <LayerToggleItem
                  label="Myocardium (Muscle)"
                  active={layerVisibility.myocardium}
                  onToggle={() => toggleLayerVisibility("myocardium")}
                  color="#0d9488"
                />
                <LayerToggleItem
                  label="Coronary Vessels"
                  active={layerVisibility.vessels}
                  onToggle={() => toggleLayerVisibility("vessels")}
                  color="#ea580c"
                />
                <LayerToggleItem
                  label="Conduction Pathways"
                  active={layerVisibility.conduction}
                  onToggle={() => toggleLayerVisibility("conduction")}
                  color="#eab308"
                />
                <LayerToggleItem
                  label="Pericardium Sac"
                  active={layerVisibility.pericardium}
                  onToggle={() => toggleLayerVisibility("pericardium")}
                  color="#3b82f6"
                />
              </div>
            </div>
          )}
        </div>

        {/* Compare */}
        <ToolButton
          icon={Columns}
          label="Compare"
          isActive={compareMode}
          onClick={toggleCompareMode}
        />

        {/* Reset */}
        <ToolButton
          icon={RefreshCw}
          label="Reset"
          onClick={resetCamera}
        />
      </div>

      {/* ── Floating Cross-Section Slider (Appears when active) ─────── */}
      {clippingEnabled && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-auto flex items-center gap-3 px-5 py-3 border border-stone-200 rounded-2xl shadow-xl bg-white/95 backdrop-blur-md">
          <Sliders className="w-4 h-4 text-primary-600" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-content-primary">
              Cross-Section Slicing Plane:
            </span>
            <span className="text-[10px] text-content-tertiary">Reveals internal chambers & valves</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={clippingPosition}
            onChange={(e) => setClippingPosition(parseFloat(e.target.value))}
            className="w-48 h-2 bg-stone-200 rounded-full appearance-none cursor-pointer accent-primary-600"
          />
          <span className="text-xs font-mono font-bold text-primary-600 min-w-[36px]">
            {Math.round(clippingPosition * 100)}%
          </span>
          <button
            onClick={toggleClipping}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
            title="Close cross-section"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── Bottom Specimen Label ───────────────────────────────────── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <p className="text-[10px] uppercase tracking-widest text-content-tertiary font-extrabold">
          HIGH-FIDELITY 3D SPECIMEN · CLICK HOTSPOTS TO EXAMINE
        </p>
        <p className="text-xs text-primary-700 font-bold italic font-serif mt-0.5">
          {organ.name} ({organ.latinName})
        </p>
      </div>

      {/* ── Bottom-Right Auto-Rotate Pill Switch ─────────────────────── */}
      <div className="absolute bottom-5 right-6 pointer-events-auto flex items-center gap-2">
        <button
          onClick={toggleAutoRotate}
          className={`
            flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-xs text-xs font-semibold transition-all
            ${
              autoRotate
                ? "bg-primary-600 text-white border-primary-600 shadow-soft font-bold"
                : "bg-white/95 backdrop-blur-md border-stone-200 text-stone-700 hover:text-primary-700 hover:border-primary-300"
            }
          `}
        >
          <RotateCcw className={`w-3.5 h-3.5 ${autoRotate ? "animate-spin" : ""}`} />
          <span>{autoRotate ? "Rotating" : "Auto rotate"}</span>
        </button>
      </div>
    </div>
  );
}

// ── Sub-Component for Tool Stack Buttons ──────────────────────────────────────

interface ToolButtonProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

function ToolButton({ icon: Icon, label, isActive, onClick }: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-20 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 border shadow-xs transition-all duration-150 group
        ${
          isActive
            ? "bg-primary-600 text-white border-primary-600 shadow-soft font-bold"
            : "bg-white/95 backdrop-blur-md border-stone-200 text-stone-700 hover:text-primary-700 hover:border-primary-300 hover:bg-stone-50/80 hover:shadow-xs"
        }
      `}
      title={label}
    >
      <Icon
        className={`w-4 h-4 transition-transform group-hover:scale-110 ${
          isActive ? "text-white" : "text-stone-500 group-hover:text-primary-600"
        }`}
      />
      <span className="text-[10px] font-semibold tracking-tight">{label}</span>
    </button>
  );
}

// ── Sub-Component for Layer Menu Items ────────────────────────────────────────

interface LayerToggleItemProps {
  label: string;
  active: boolean;
  onToggle: () => void;
  color: string;
}

function LayerToggleItem({ label, active, onToggle, color }: LayerToggleItemProps) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-1.5 rounded-xl text-xs hover:bg-stone-100 transition-colors"
    >
      <div className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className={`font-medium ${active ? "text-content-primary font-semibold" : "text-content-tertiary line-through"}`}>
          {label}
        </span>
      </div>
      <div
        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
          active
            ? "bg-primary-600 border-primary-600 text-white"
            : "border-stone-300 bg-stone-50 text-transparent"
        }`}
      >
        <Check className="w-3 h-3 font-bold" />
      </div>
    </button>
  );
}
