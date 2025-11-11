"use client";
import { AppProgressProvider } from "@bprogress/next";
// import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./theme-provider";
import { TailwindIndicator } from "../custom/tailwind-indicator";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AppProgressProvider
        color="var(--foreground)"
        delay={500}
        height="2px"
        options={{ showSpinner: false }}
      >
        {children}
      </AppProgressProvider>
      <Toaster position="top-center" closeButton />
      <TailwindIndicator />
      {/* <Analytics /> */}
    </ThemeProvider>
  );
}
