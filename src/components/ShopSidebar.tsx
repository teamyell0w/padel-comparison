"use client";

import { useState } from "react";

interface SidebarGroup {
  title: string;
  items: { label: string; active?: boolean }[];
}

const sidebarGroups: SidebarGroup[] = [
  {
    title: "Spielniveau",
    items: [
      { label: "Alle Schläger", active: true },
      { label: "Einsteigerschläger" },
      { label: "Fortgeschrittenenschläger" },
      { label: "Turnierschläger" },
    ],
  },
  {
    title: "Marke",
    items: [
      { label: "HEAD" },
      { label: "Bullpadel" },
      { label: "adidas" },
      { label: "Babolat" },
      { label: "Wilson" },
      { label: "NOX" },
      { label: "Dunlop" },
      { label: "Black Crown" },
      { label: "RS" },
    ],
  },
  {
    title: "Weitere",
    items: [
      { label: "Schlägerpakete" },
      { label: "Testschläger" },
    ],
  },
];

function SidebarSection({ group, defaultOpen = true }: { group: SidebarGroup; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="py-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-sm font-semibold text-pp-charcoal hover:text-pp-gray-600 transition-colors"
      >
        {group.title}
        <svg
          className={`w-3.5 h-3.5 text-pp-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <ul className="mt-2 space-y-0.5">
          {group.items.map((item) => (
            <li key={item.label}>
              <span
                className={`block py-1 text-sm cursor-default transition-colors ${
                  item.active
                    ? "text-pp-charcoal font-medium"
                    : "text-pp-gray-500 hover:text-pp-charcoal"
                }`}
              >
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ShopSidebar() {
  return (
    <aside className="w-48 shrink-0 hidden lg:block">
      {sidebarGroups.map((group, i) => (
        <div key={group.title}>
          {i > 0 && <div className="border-t border-pp-gray-100" />}
          <SidebarSection group={group} />
        </div>
      ))}
    </aside>
  );
}
