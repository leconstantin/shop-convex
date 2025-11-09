import SiteHeader from "@/components/layout/site-header";
import { Toaster } from "sonner";

export default function AppLayout(props: LayoutProps<"/">) {
  return (
    <div className="relative z-10 flex min-h-svh flex-col bg-background">
      <SiteHeader />
      <main className="container-wrapper py-10 flex min-h-screen flex-1 flex-col bg-muted/10 lg:px-3">
        {props.children}
      </main>
      {/* <SiteFooter /> */}
      <Toaster />
    </div>
  );
}
