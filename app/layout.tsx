import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
});

export const metadata: Metadata = {
  title: "GenChrist Study App - Ultimate Catholic Workstation",
  description: "A responsive, animated Catholic Bible, theological study tracker, and graphical narrative archive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'light') {
                  document.documentElement.classList.add('light')
                  document.documentElement.classList.remove('dark')
                } else {
                  document.documentElement.classList.add('dark')
                  document.documentElement.classList.remove('light')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-liturgy-stone-light text-liturgy-stone-dark dark:bg-liturgy-charcoal dark:text-liturgy-stone-light transition-colors duration-300 font-sans antialiased">
        <Navbar />
        <main className="flex-grow flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

