import { Toaster } from "@/components/ui/sonner";
import WorkFlowProvider from "@/provider/reactflow-provider";
import { ThemeProvider } from "@/provider/theme-provider";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";

const poppins = Poppins({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WorkFlow Builder",
  description: "Drag and Drop Workflow Builder for your projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <WorkFlowProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-center" richColors />
          </ThemeProvider>
        </WorkFlowProvider>
      </body>
    </html>
  );
}
