import type { Metadata } from "next";
import { Roboto, Fugaz_One, Fira_Sans } from "next/font/google";
import { ComparisonProvider } from "@/context/ComparisonContext";
import { CatalogProvider } from "@/context/CatalogContext";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

// Padel-Point Markentypografie (Quelle: Brandbox):
// Fugaz One VERSALIEN fuer Statements, Fira Sans fuer Lauftext
const fugazOne = Fugaz_One({
  variable: "--font-fugaz",
  subsets: ["latin"],
  weight: "400",
});

const firaSans = Fira_Sans({
  variable: "--font-fira",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Padel-Schläger Vergleich | Padel-Point",
  description: "Vergleiche bis zu 5 Padel-Schläger miteinander und finde den perfekten Schläger für dein Spiel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${roboto.variable} ${fugazOne.variable} ${firaSans.variable} font-sans antialiased`}>
        <CatalogProvider>
          <ComparisonProvider>
            {children}
          </ComparisonProvider>
        </CatalogProvider>
      </body>
    </html>
  );
}
