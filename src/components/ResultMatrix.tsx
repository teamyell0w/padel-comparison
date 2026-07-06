"use client";

import type { Recommendation } from "@/lib/finder";

interface ResultMatrixProps {
  recommendations: Recommendation[];
  profile: { x: number; y: number };
}

/**
 * Schiebt zu nah beieinander liegende Punkte auseinander,
 * damit Bild und Label immer lesbar bleiben.
 */
function spreadPositions(
  points: { x: number; y: number }[],
  fixed: { x: number; y: number }
): { x: number; y: number }[] {
  const result = points.map((p) => ({ ...p }));
  const MIN_X = 16;
  const MIN_Y = 24;
  const FIXED_MIN_X = 15;
  const FIXED_MIN_Y = 17;

  for (let iter = 0; iter < 30; iter++) {
    let moved = false;

    // Vom Profil-Marker wegdruecken (der Marker selbst bleibt stehen)
    for (const p of result) {
      const dx = p.x - fixed.x;
      const dy = p.y - fixed.y;
      if (Math.abs(dx) < FIXED_MIN_X && Math.abs(dy) < FIXED_MIN_Y) {
        if (Math.abs(dx) / FIXED_MIN_X > Math.abs(dy) / FIXED_MIN_Y) {
          p.x = fixed.x + FIXED_MIN_X * (dx >= 0 ? 1 : -1);
        } else {
          p.y = fixed.y + FIXED_MIN_Y * (dy >= 0 ? 1 : -1);
        }
        moved = true;
      }
    }

    for (let i = 0; i < result.length; i++) {
      for (let j = i + 1; j < result.length; j++) {
        const dx = result[j].x - result[i].x;
        const dy = result[j].y - result[i].y;
        if (Math.abs(dx) < MIN_X && Math.abs(dy) < MIN_Y) {
          const pushX = (MIN_X - Math.abs(dx)) / 2 * (dx >= 0 ? 1 : -1);
          const pushY = (MIN_Y - Math.abs(dy)) / 2 * (dy >= 0 ? 1 : -1);
          // Entlang der groesseren relativen Luecke schieben.
          // Bei Gleichstand (exakt gestapelte Punkte) horizontal ausweichen,
          // sonst oszilliert das mit dem Profil-Repel und trennt nie.
          if (Math.abs(dx) / MIN_X >= Math.abs(dy) / MIN_Y) {
            result[i].x -= pushX;
            result[j].x += pushX;
          } else {
            result[i].y -= pushY;
            result[j].y += pushY;
          }
          moved = true;
        }
      }
    }
    // Clamp INNERHALB der Schleife: sonst schiebt der Rand am Ende
    // zwei bereits getrennte Punkte wieder auf dieselbe Stelle.
    for (const p of result) {
      p.x = Math.max(8, Math.min(92, p.x));
      p.y = Math.max(10, Math.min(90, p.y));
    }

    if (!moved) break;
  }

  return result;
}

export function ResultMatrix({ recommendations, profile }: ResultMatrixProps) {
  const positions = spreadPositions(
    recommendations.map((r) => ({ x: r.racket.matrixX, y: r.racket.matrixY })),
    profile
  );

  return (
    <div className="w-full">
      {/* X-Achse */}
      <div className="flex items-center justify-between mb-3 pl-8 md:pl-10">
        <span className="text-xs md:text-sm font-semibold uppercase tracking-widest text-pp-control">
          Control
        </span>
        <div className="flex-1 mx-3 h-1.5 rounded-full opacity-50"
          style={{ background: "linear-gradient(to right, var(--color-pp-control), var(--color-pp-allround), var(--color-pp-power))" }}
        />
        <span className="text-xs md:text-sm font-semibold uppercase tracking-widest text-pp-power">
          Power
        </span>
      </div>

      <div className="flex">
        {/* Y-Achse */}
        <div className="flex flex-col items-center justify-between w-8 md:w-10 py-2">
          <span className="text-[9px] md:text-[10px] font-semibold uppercase tracking-widest text-pp-blue" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
            Turnier
          </span>
          <div className="flex-1 w-1.5 my-2 rounded-full bg-gradient-to-b from-pp-blue to-pp-gray-200 opacity-40" />
          <span className="text-[9px] md:text-[10px] font-semibold uppercase tracking-widest text-pp-gray-400" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
            Einsteiger
          </span>
        </div>

        {/* Feld */}
        <div className="flex-1 relative bg-pp-gray-50/50 border border-pp-gray-200 rounded aspect-square md:aspect-[4/3]">
          {/* Rasterlinien */}
          <div className="absolute inset-0 pointer-events-none">
            {[25, 50, 75].map((pct) => (
              <div key={`h-${pct}`} className="absolute left-0 right-0 border-t border-pp-gray-100" style={{ top: `${pct}%` }} />
            ))}
            {[25, 50, 75].map((pct) => (
              <div key={`v-${pct}`} className="absolute top-0 bottom-0 border-l border-pp-gray-100" style={{ left: `${pct}%` }} />
            ))}
          </div>

          {/* Profil-Marker: setzt sich zuletzt */}
          <div
            className="absolute z-10 pointer-events-none animate-ring-in"
            style={{ left: `${profile.x}%`, top: `${profile.y}%`, animationDelay: "1.1s" }}
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-dashed border-pp-blue/60 bg-pp-blue/5 flex items-center justify-center">
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-pp-blue text-center leading-tight">
                Dein<br />Profil
              </span>
            </div>
          </div>

          {/* Empfehlungen */}
          {recommendations.map((rec, i) => (
            <a
              key={rec.racket.id}
              href={`#empfehlung-${i + 1}`}
              className="absolute z-20 group flex flex-col items-center w-24 md:w-28 animate-dot-pop"
              style={{ left: `${positions[i].x}%`, top: `${positions[i].y}%`, animationDelay: `${0.25 + i * 0.15}s` }}
            >
              <div className="relative">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white border-2 border-pp-gray-200 group-hover:border-pp-blue shadow-sm overflow-hidden flex items-center justify-center transition-colors">
                  <img
                    src={rec.racket.imageUrl}
                    alt={rec.racket.title}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <span className="absolute -top-1 -left-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-pp-blue text-white text-[10px] md:text-xs font-bold flex items-center justify-center shadow">
                  {i + 1}
                </span>
              </div>
              <span className="hidden md:block mt-1.5 text-xs font-medium text-pp-charcoal text-center leading-tight bg-white/85 rounded px-1 max-w-full truncate">
                {rec.racket.title}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
