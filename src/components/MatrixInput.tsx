"use client";

import { useCallback, useRef } from "react";

interface MatrixInputProps {
  x: number; // 0-100, Control -> Power
  y: number; // 0-100, Turnier -> Einsteiger
  onChange: (x: number, y: number) => void;
}

/**
 * Die Matrix als Eingabeinstrument: Der User zieht seinen Punkt
 * zwischen Kontrolle/Power (x) und Turnier/Einsteiger (y).
 */
export function MatrixInput({ x, y, onChange }: MatrixInputProps) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromEvent = useCallback(
    (e: React.PointerEvent) => {
      const rect = fieldRef.current?.getBoundingClientRect();
      if (!rect) return;
      const nx = Math.max(3, Math.min(97, ((e.clientX - rect.left) / rect.width) * 100));
      const ny = Math.max(3, Math.min(97, ((e.clientY - rect.top) / rect.height) * 100));
      onChange(nx, ny);
    },
    [onChange]
  );

  return (
    <div className="select-none">
      {/* X-Achse oben */}
      <div className="flex items-center justify-between mb-2 pl-7">
        <span className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-pp-control">Kontrolle</span>
        <div className="flex-1 mx-3 h-1 rounded-full opacity-50"
          style={{ background: "linear-gradient(to right, var(--color-pp-control), var(--color-pp-allround), var(--color-pp-power))" }}
        />
        <span className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-pp-power">Power</span>
      </div>

      <div className="flex">
        {/* Y-Achse */}
        <div className="flex flex-col items-center justify-between w-7 py-1">
          <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-pp-blue" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
            Turnier
          </span>
          <div className="flex-1 w-1 my-2 rounded-full bg-gradient-to-b from-pp-blue to-pp-gray-200 opacity-40" />
          <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-pp-gray-400" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
            Einsteiger
          </span>
        </div>

        {/* Drag-Feld */}
        <div
          ref={fieldRef}
          className="relative flex-1 aspect-square bg-pp-gray-50/60 border border-pp-gray-200 rounded cursor-crosshair touch-none"
          onPointerDown={(e) => {
            dragging.current = true;
            (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
            updateFromEvent(e);
          }}
          onPointerMove={(e) => {
            if (dragging.current) updateFromEvent(e);
          }}
          onPointerUp={() => (dragging.current = false)}
          onPointerCancel={() => (dragging.current = false)}
        >
          {/* Raster */}
          <div className="absolute inset-0 pointer-events-none">
            {[33.3, 66.7].map((pct) => (
              <div key={`h-${pct}`} className="absolute left-0 right-0 border-t border-dashed border-pp-gray-200" style={{ top: `${pct}%` }} />
            ))}
            {[33.3, 66.7].map((pct) => (
              <div key={`v-${pct}`} className="absolute top-0 bottom-0 border-l border-dashed border-pp-gray-200" style={{ left: `${pct}%` }} />
            ))}
          </div>

          {/* Hinweis solange nicht bewegt */}
          <p className="absolute inset-x-0 top-3 text-center text-[11px] text-pp-gray-400 pointer-events-none">
            Zieh den Punkt dorthin, wo du dein Spiel siehst
          </p>

          {/* Der User-Punkt */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <span className="absolute -inset-5 rounded-full border-2 border-dashed border-pp-blue/50 animate-pulse" />
            <span className="block w-6 h-6 rounded-full bg-pp-blue border-[3px] border-white shadow-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
