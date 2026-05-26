import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import LightRays from "@/components/LightRays";
import { Navbar } from "@/components/Navbar";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Devent",
  description: "The hub for every dev event you mustn't miss!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        schibstedGrotesk.variable,
        martianMono.variable,
        "antialiased",
      )}
    >
      <body className="min-h-screen">
        <div className="absolute inset-0 z-[-1]">
          <LightRays
            raysOrigin="top-center"
            raysColor="#7ccf00"
            raysSpeed={0.5}
            lightSpread={0.9}
            rayLength={1.4}
            followMouse={true}
            mouseInfluence={0.08}
            noiseAmount={0.0}
            distortion={0.01}
          />
        </div>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
