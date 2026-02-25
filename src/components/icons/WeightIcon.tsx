export function WeightIcon({
  size = 28,
  className = "",
}: {
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
      {/* Kettlebell / weight */}
      <circle
        cx="12"
        cy="6"
        r="3"
        stroke="currentColor"
        strokeWidth={1.5}
        fill="none"
      />
      <path
        d="M8 9 L6 14 Q6 20 12 20 Q18 20 18 14 L16 9"
        stroke="currentColor"
        strokeWidth={1.5}
        fill="currentColor"
        opacity={0.15}
      />
      <text
        x="12"
        y="16.5"
        textAnchor="middle"
        fontSize="6"
        fontWeight="bold"
        fill="currentColor"
      >
        g
      </text>
    </svg>
  );
}
