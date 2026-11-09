import "./globals.css";
import Nav from "@/components/Nav";

export const metadata = {
  title: "Undangku",
  description: "Undangan digital untuk pernikahan, ulang tahun, khitanan, aqiqah, dan syukuran. Kirim ke tamu lewat WhatsApp.",
};
export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Marcellus&family=Pinyon+Script&family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,300;1,400;1,500&family=Instrument+Serif:ital@0;1&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;1,6..96,400;1,6..96,500&family=Anton&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&display=swap" />
      </head>
      <body>
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
