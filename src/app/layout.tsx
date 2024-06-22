import Hydration from "@/components/global/hydration";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "@/provider/react-query-provider";
import WorkFlowProvider from "@/provider/reactflow-provider";
import { ThemeProvider } from "@/provider/theme-provider";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
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
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body className={poppins.className}>
          <WorkFlowProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <ReactQueryProvider>
                <Hydration />
                {children}
                <Toaster position="top-center" richColors />
              </ReactQueryProvider>
            </ThemeProvider>
          </WorkFlowProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
