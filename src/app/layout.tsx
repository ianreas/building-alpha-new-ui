import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "./components/Footer";
import { Navbar } from "./components/Navbar";
import "./globals.css";
import PillarsBackground from "./PillarsBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BuildingAlpha",
  description: "Financial analysis and options trading platform",
  icons: {
    icon: "/alpha.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // return (
  //   <html lang="en">
  //     <body className="relative min-h-screen">
  //       {/* Place Pillars behind everything, covering the entire page */}
  //       <PillarsBackground />

  //       <div className="relative z-10">
  //         <Navbar />
  //         <main className="container mx-auto py-6">
  //           {children}
  //         </main>
  //       </div>
  //     </body>
  //   </html>
  // )
  return (
    <html lang="en">
      <body className="relative min-h-screen flex flex-col">
        {/* The background behind everything */}
        <PillarsBackground />
        <Navbar />
        <main className="container mx-auto py-6 my-10 flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
