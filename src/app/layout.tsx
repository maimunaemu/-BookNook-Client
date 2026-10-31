import type { Metadata } from "next";
import { Toaster } from "sonner";
import SiteChrome from "@/components/site-chrome";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "BookNook — The Reading Atelier",
    template: "%s | BookNook",
  },
  description:
    "A neighborhood reading room for curious minds. Discover, share, and borrow books from the BookNook community.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <SiteChrome>{children}</SiteChrome>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
