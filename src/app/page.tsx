"use client";

import Link from "next/link";
import { FinderWizard } from "@/components/FinderWizard";

export default function FinderPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white">
        <div className="bg-pp-blue text-white text-center py-1.5">
          <span className="text-[11px] tracking-wide">
            Jetzt <strong>15% Extra-Rabatt</strong> sichern. Code: <strong>SALE15</strong>
          </span>
        </div>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between border-b border-pp-gray-100">
          <Link href="/" className="block">
            <img src="/logos/PadelPoint_Logo_Dark.svg" alt="Padel-Point" className="h-7" />
          </Link>
          <Link href="/katalog" className="text-sm text-pp-gray-500 hover:text-pp-charcoal transition-colors">
            Zum Katalog →
          </Link>
        </div>
      </header>

      <main>
        <FinderWizard />
      </main>
    </div>
  );
}
