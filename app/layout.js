import { Suspense } from "react";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "../components/navigation/Navbar";
import { Footer } from "../components/navigation/Footer";
import { SmoothScroll } from "../components/shared/SmoothScroll";
import { MorphTransition } from "../components/shared/MorphTransition";

export const dynamic = "force-dynamic";

const neueMachina = localFont({
  src: [
    {
      path: "../public/fonts/NeueMachina-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/NeueMachina-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-neue-machina",
  display: "swap",
});

const manrope = localFont({
  src: "../public/fonts/Manrope-VariableFont_wght.woff2",
  variable: "--font-manrope",
  display: "swap",
});

export const metadata = {
  title: "Daywise — Know the day. Without checking.",
  description: "Train your calendar brain to calculate the day of the week for any date instantly using the Doomsday Rule method.",
};

const themeInitializerScript = `
  (function() {
    try {
      const root = document.documentElement;
      root.classList.remove('light');
      root.classList.add('dark');
    } catch (e) {
      console.error(e);
    }
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${neueMachina.variable} ${manrope.variable} antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializerScript }} />
      </head>
      <body className={`${manrope.className} min-h-screen flex flex-col bg-background text-foreground font-sans`}>
        <SmoothScroll />
        <MorphTransition />
        <Suspense fallback={<div className="h-16 border-b border-border bg-background" />}>
          <Navbar />
        </Suspense>
        <main className="flex-grow pb-16 md:pb-0">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
