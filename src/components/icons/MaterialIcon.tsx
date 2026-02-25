import { MaterialHardness } from "@/lib/types";

export function SurfaceMaterialIcon({
  hardness,
  size = 28,
  className = "",
}: {
  hardness: MaterialHardness;
  size?: number;
  className?: string;
}) {
  const layers = hardness === "hard" ? 3 : hardness === "medium" ? 2 : 1;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Surface grid pattern */}
      {Array.from({ length: layers }).map((_, i) => (
        <rect
          key={i}
          x={3 + i * 2}
          y={3 + i * 2}
          width={18 - i * 4}
          height={18 - i * 4}
          rx={1}
          stroke="currentColor"
          strokeWidth={1.5}
          fill="currentColor"
          opacity={0.05 + i * 0.1}
        />
      ))}
      {/* Diamond pattern for hardness */}
      {hardness === "hard" && (
        <>
          <line x1="8" y1="8" x2="16" y2="16" stroke="currentColor" strokeWidth={1} opacity={0.4} />
          <line x1="16" y1="8" x2="8" y2="16" stroke="currentColor" strokeWidth={1} opacity={0.4} />
        </>
      )}
      {hardness === "medium" && (
        <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth={1} opacity={0.4} />
      )}
      {hardness === "soft" && (
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={1} opacity={0.4} fill="none" />
      )}
    </svg>
  );
}

export function CoreMaterialIcon({
  hardness,
  size = 28,
  className = "",
}: {
  hardness: MaterialHardness;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Hexagonal core pattern */}
      <polygon
        points="12,3 20,8 20,16 12,21 4,16 4,8"
        stroke="currentColor"
        strokeWidth={1.5}
        fill="currentColor"
        opacity={0.1}
      />
      {hardness === "hard" && (
        <polygon
          points="12,7 16,10 16,14 12,17 8,14 8,10"
          stroke="currentColor"
          strokeWidth={1.2}
          fill="currentColor"
          opacity={0.15}
        />
      )}
      {hardness === "medium" && (
        <circle
          cx="12"
          cy="12"
          r="4"
          stroke="currentColor"
          strokeWidth={1.2}
          fill="currentColor"
          opacity={0.1}
        />
      )}
      {hardness === "soft" && (
        <circle
          cx="12"
          cy="12"
          r="3"
          stroke="currentColor"
          strokeWidth={1}
          fill="currentColor"
          opacity={0.08}
          strokeDasharray="2 2"
        />
      )}
    </svg>
  );
}
