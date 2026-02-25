import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { ComparisonProvider } from "@/context/ComparisonContext";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
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
      <body className={`${roboto.variable} font-sans antialiased`}>
        <ComparisonProvider>
          {children}
        </ComparisonProvider>
      </body>
    </html>
  );
}
