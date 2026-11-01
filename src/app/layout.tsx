import type { Metadata } from "next";
import AppToaster from "@/components/app-toaster";
import SiteChrome from "@/components/site-chrome";
import ThemeProvider from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "BookNook | Home",
    template: "BookNook | %s",
  },
  description:
    "A neighborhood reading room for curious minds. Discover, share, and borrow books from the BookNook community.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <SiteChrome>{children}</SiteChrome>
          <AppToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
