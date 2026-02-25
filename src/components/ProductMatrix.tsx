"use client";

import { PadelRacket } from "@/lib/types";
import { ProductCard } from "./ProductCard";

interface ProductMatrixProps {
  products: PadelRacket[];
}

export function ProductMatrix({ products }: ProductMatrixProps) {
  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Axis Labels */}
      <div className="relative">
        {/* X-Axis: Control - Power */}
        <div className="flex items-center justify-between mb-3 px-12">
          <span className="text-sm font-semibold uppercase tracking-widest text-pp-control">
            Control
          </span>
          <div className="flex-1 mx-4 flex items-center gap-[6px]">
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-2 rounded-full"
                style={{
                  backgroundColor: `color-mix(in srgb, var(--color-pp-control) ${100 - i * 4}%, var(--color-pp-power) ${i * 4}%)`,
                  opacity: 0.6,
                }}
              />
            ))}
          </div>
          <span className="text-sm font-semibold uppercase tracking-widest text-pp-power">
            Power
          </span>
        </div>

        {/* Main Matrix Area */}
        <div className="flex">
          {/* Y-Axis Label (rotated) */}
          <div className="flex flex-col items-center justify-between w-10 py-4">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-pp-blue writing-mode-vertical rotate-180"
              style={{ writingMode: "vertical-rl" }}
            >
              Tournament
            </span>
            <div className="flex-1 w-2 my-2 rounded-full bg-gradient-to-b from-pp-blue to-pp-gray-300 opacity-50" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-pp-gray-400 rotate-180"
              style={{ writingMode: "vertical-rl" }}
            >
              Recreational
            </span>
          </div>

          {/* Grid */}
          <div className="flex-1 relative bg-white border border-pp-gray-200 rounded min-h-[500px]">
            {/* Grid lines */}
            <div className="absolute inset-0 pointer-events-none">
              {[25, 50, 75].map((pct) => (
                <div
                  key={`h-${pct}`}
                  className="absolute left-0 right-0 border-t border-pp-gray-100"
                  style={{ top: `${pct}%` }}
                />
              ))}
              {[25, 50, 75].map((pct) => (
                <div
                  key={`v-${pct}`}
                  className="absolute top-0 bottom-0 border-l border-pp-gray-100"
                  style={{ left: `${pct}%` }}
                />
              ))}
            </div>

            {/* Level labels on the right */}
            <div className="absolute right-2 top-0 bottom-0 flex flex-col justify-between py-6 pointer-events-none">
              {["Tournament", "Advanced", "Intermediate", "Recreational"].map((label) => (
                <span key={label} className="text-[9px] text-pp-gray-300 uppercase tracking-wider">
                  {label}
                </span>
              ))}
            </div>

            {/* Products positioned absolutely */}
            {products.map((product) => (
              <div
                key={product.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${product.matrixX}%`,
                  top: `${product.matrixY}%`,
                }}
              >
                <ProductCard racket={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
