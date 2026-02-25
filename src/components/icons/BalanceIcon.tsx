import { Balance } from "@/lib/types";

export function BalanceIcon({
  balance,
  size = 28,
  className = "",
}: {
  balance: Balance;
  size?: number;
  className?: string;
}) {
  const pivotX = balance === "head-heavy" ? 16 : balance === "grip-heavy" ? 8 : 12;
  const leftY = balance === "head-heavy" ? 10 : balance === "grip-heavy" ? 6 : 8;
  const rightY = balance === "head-heavy" ? 6 : balance === "grip-heavy" ? 10 : 8;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 20"
      fill="none"
      className={className}
    >
      {/* Pivot */}
      <polygon
        points={`${pivotX},18 ${pivotX - 3},20 ${pivotX + 3},20`}
        fill="currentColor"
      />
      {/* Beam */}
      <line
        x1="2"
        y1={leftY}
        x2="22"
        y2={rightY}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
      {/* Pivot post */}
      <line
        x1={pivotX}
        y1={(leftY + rightY) / 2}
        x2={pivotX}
        y2="18"
        stroke="currentColor"
        strokeWidth={1.5}
      />
      {/* Left pan */}
      <path
        d={`M0,${leftY} Q2,${leftY + 4} 4,${leftY}`}
        stroke="currentColor"
        strokeWidth={1.5}
        fill="currentColor"
        opacity={0.15}
      />
      {/* Right pan */}
      <path
        d={`M20,${rightY} Q22,${rightY + 4} 24,${rightY}`}
        stroke="currentColor"
        strokeWidth={1.5}
        fill="currentColor"
        opacity={0.15}
      />
    </svg>
  );
}
