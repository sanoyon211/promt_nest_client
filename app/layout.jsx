import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MaintenanceGuard from "@/components/MaintenanceGuard";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

// app/layout.jsx
export const metadata = {
  title: {
    default: "PromptNest - Premium AI Prompt Marketplace",
    template: "%s | PromptNest",
  },
  description: "Discover, share, and manage highly-optimized AI workflows for ChatGPT, Claude, Midjourney, and more.",
  keywords: ["AI Prompts", "Prompt Engineering", "ChatGPT Prompts", "Claude Prompts", "AI Marketplace"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-background text-text-primary selection:bg-primary/20 selection:text-primary min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <MaintenanceGuard>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </MaintenanceGuard>
          </AuthProvider>
        </ThemeProvider>
        
        {/* Premium Toast Configuration */}
        <ToastContainer 
          position="bottom-right" 
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark" // Provides a sleek, universal SaaS look
          toastClassName="!bg-[#1E1B2E] !text-[#F1F0F8] !rounded-2xl !border !border-white/10 !shadow-2xl font-sans"
        />
      </body>
    </html>
  );
}
