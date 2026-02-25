import { HeadShape } from "@/lib/types";

const paths: Record<HeadShape, string> = {
  diamond:
    "M12 2 L20 10 L20 22 Q20 26 16 26 L8 26 Q4 26 4 22 L4 10 Z",
  teardrop:
    "M12 2 Q20 8 20 16 L20 22 Q20 26 16 26 L8 26 Q4 26 4 22 L4 16 Q4 8 12 2 Z",
  round:
    "M12 4 Q22 4 22 14 L22 22 Q22 26 18 26 L6 26 Q2 26 2 22 L2 14 Q2 4 12 4 Z",
  hybrid:
    "M12 3 Q19 6 20 14 L20 22 Q20 26 16 26 L8 26 Q4 26 4 22 L4 14 Q5 6 12 3 Z",
  geometric:
    "M6 4 L18 4 L20 12 L20 22 Q20 26 16 26 L8 26 Q4 26 4 22 L4 12 Z",
};

export function HeadShapeIcon({
  shape,
  size = 28,
  className = "",
}: {
  shape: HeadShape;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 28"
      fill="none"
      className={className}
    >
      <path
        d={paths[shape]}
        fill="currentColor"
        opacity={0.15}
        stroke="currentColor"
        strokeWidth={1.5}
      />
      {/* Grip line */}
      <line
        x1="10"
        y1="26"
        x2="10"
        y2="28"
        stroke="currentColor"
        strokeWidth={1}
      />
      <line
        x1="14"
        y1="26"
        x2="14"
        y2="28"
        stroke="currentColor"
        strokeWidth={1}
      />
    </svg>
  );
}
