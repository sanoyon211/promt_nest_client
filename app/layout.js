import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PromtNest",
  description: "Your modern platform",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <header className="w-full border-b border-foreground/10 bg-background/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="font-bold text-2xl tracking-tight">PromtNest</div>
            <nav className="hidden md:flex space-x-8">
              <span className="text-sm font-medium opacity-80 hover:opacity-100 cursor-pointer transition-opacity">Home</span>
              <span className="text-sm font-medium opacity-80 hover:opacity-100 cursor-pointer transition-opacity">Explore</span>
              <span className="text-sm font-medium opacity-80 hover:opacity-100 cursor-pointer transition-opacity">About</span>
            </nav>
            <button className="md:hidden opacity-80 hover:opacity-100">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
          {children}
        </main>

        <footer className="w-full border-t border-foreground/10 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between opacity-80">
            <p className="text-sm">
              © {new Date().getFullYear()} PromtNest. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span className="text-sm hover:opacity-100 cursor-pointer transition-opacity">Privacy Policy</span>
              <span className="text-sm hover:opacity-100 cursor-pointer transition-opacity">Terms of Service</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
