"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  backLink?: { href?: string; onClick?: () => void; label: string };
}

const topNavItems = [
  { label: "Padelschläger", active: true },
  { label: "Padelbekleidung", active: false },
  { label: "Padelschuhe", active: false },
  { label: "Padeltaschen", active: false },
  { label: "Padelbälle", active: false },
  { label: "Zubehör", active: false },
  { label: "Marken", active: false },
  { label: "Sale", active: false, sale: true },
];

export function Header({ backLink }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="bg-white">
      {/* Announcement bar */}
      <div className="bg-pp-blue text-white text-center py-1.5">
        <span className="text-[11px] tracking-wide">
          Jetzt <strong>15% Extra-Rabatt</strong> sichern. Code: <strong>SALE15</strong>
        </span>
      </div>

      {/* Logo row */}
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 py-3 flex items-center justify-between border-b border-pp-gray-100">
        <Link href="/" className="block">
          <img src="/logos/PadelPoint_Logo_Dark.svg" alt="Padel-Point" className="h-7" />
        </Link>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <div className="w-full border border-pp-gray-200 rounded-sm px-3 py-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-pp-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-sm text-pp-gray-400">Suche nach Produkten...</span>
          </div>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-5">
          {backLink && (
            backLink.onClick ? (
              <button
                onClick={backLink.onClick}
                className="text-sm text-pp-gray-500 hover:text-pp-charcoal transition-colors flex items-center gap-1"
              >
                ← {backLink.label}
              </button>
            ) : (
              <Link
                href={backLink.href || "/"}
                className="text-sm text-pp-gray-500 hover:text-pp-charcoal transition-colors flex items-center gap-1"
              >
                ← {backLink.label}
              </Link>
            )
          )}
          {pathname !== "/" && !backLink && (
            <Link
              href="/"
              className="text-sm text-pp-gray-500 hover:text-pp-charcoal transition-colors"
            >
              ← Katalog
            </Link>
          )}
          {/* Account */}
          <svg className="w-5 h-5 text-pp-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {/* Cart */}
          <div className="relative">
            <svg className="w-5 h-5 text-pp-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-pp-charcoal text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              0
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="border-b border-pp-gray-200">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8">
          <ul className="flex items-center gap-0 overflow-x-auto">
            {topNavItems.map((item) => (
              <li key={item.label}>
                <span
                  className={`block px-4 py-3 text-sm whitespace-nowrap cursor-default transition-colors ${
                    item.active
                      ? "text-pp-charcoal font-semibold border-b-2 border-pp-charcoal"
                      : item.sale
                        ? "text-red-500 font-medium"
                        : "text-pp-gray-600 hover:text-pp-charcoal"
                  }`}
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
