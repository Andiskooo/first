import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "EcoTek - Zgjidhje për Ngrohje, Klimatizim dhe Sisteme Solare",
  description: "EcoTek ofron zgjidhje inovative për ngrohje qendrore, klimatizim, ventilim dhe sisteme solare për shtëpi dhe biznese.",
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sq">
      <body className={`${poppins.className} antialiased`}>
        <Header />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
