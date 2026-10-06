import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nuestra historia | Invitación de boda",
  description: "Una invitación para celebrar el comienzo de nuestra historia.",
  openGraph: {
    title: "Nuestra historia | Invitación de boda",
    description: "Nos encantará compartir este día contigo.",
    type: "website"
  }
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f7f6f2" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es">
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
    </head>
    <body>{children}</body>
  </html>;
}
