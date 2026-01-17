import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavbarSwitch from "../components/NavbarSwitch";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "GranDressing", template: "%s · GranDressing" },
  description:
    "Explorez votre dressing illimité : louez, mixez et renouvelez votre style sans surconsommer.",
  openGraph: {
    title: "GranDressing",
    description:
      "Explorez votre dressing illimité : louez, mixez et renouvelez votre style sans surconsommer.",
    type: "website",
    url: "https://ton-domaine.fr",
    siteName: "GranDressing",
    images: ["/opengraph-image.png"],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image.png"] },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <NavbarSwitch />
        {children}
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      </body>
    </html>
  );
}
