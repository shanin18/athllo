import type { Metadata } from "next";
import { Suspense } from "react";
import { Archivo, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import { RouteProgress } from "@/components/route-progress";
import "./globals.css";

const display = Archivo({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const body = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Athllo — Where athletes and brands connect",
    template: "%s · Athllo",
  },
  description:
    "Athllo is the marketplace where athletes showcase their reach and brands find, vet, and sponsor the right talent — with secure payments built in.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "Athllo — Where athletes and brands connect",
    description:
      "The marketplace where athletes showcase their reach and brands sponsor the right talent.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <Suspense fallback={null}>
          <RouteProgress />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
