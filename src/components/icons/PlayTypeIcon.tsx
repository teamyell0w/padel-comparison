import { PlayType } from "@/lib/types";

export function PlayTypeIcon({
  type,
  size = 28,
  className = "",
}: {
  type: PlayType;
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
      {type === "power" && (
        <>
          {/* Lightning bolt */}
          <polygon
            points="13,2 6,14 11,14 10,22 18,10 13,10"
            fill="currentColor"
            opacity={0.2}
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </>
      )}
      {type === "control" && (
        <>
          {/* Target/crosshair */}
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth={1.5} fill="currentColor" opacity={0.08} />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth={1.5} fill="currentColor" opacity={0.12} />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </>
      )}
      {type === "allround" && (
        <>
          {/* Star / versatility */}
          <polygon
            points="12,3 14,9 20,10 15.5,14.5 17,21 12,17.5 7,21 8.5,14.5 4,10 10,9"
            fill="currentColor"
            opacity={0.15}
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}
