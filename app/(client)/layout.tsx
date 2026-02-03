import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Askme from "@/components/Askme";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: {
    template: "%s | PrimeMobile - Premium Mobile Store",
    default: "PrimeMobile - Your Ultimate Destination for Smartphones & Tech",
  },
  description:
    "Explore PrimeMobile for the latest smartphones, premium tech accessories, and high-quality electronics. Enjoy secure shopping, fast delivery, and unbeatable deals on your favorite brands.",
  keywords: [
    "PrimeMobile",
    "smartphones",
    "mobile phones store",
    "tech accessories",
    "online electronics shop",
    "buy smartphones online",
    "electronics deals",
    "Prime Mobile Store",
  ],
  authors: [{ name: "PrimeMobile Team" }],
  creator: "PrimeMobile",
  publisher: "PrimeMobile",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PrimeMobile - Premium Mobile Store & Electronics",
    description:
      "Discover the latest smartphones and tech gadgets at PrimeMobile. Quality products, secure payments, and fast shipping.",
    url: "/",
    siteName: "PrimeMobile",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PrimeMobile - Premium Mobile Store & Electronics",
    description:
      "Shop the latest tech and mobiles at PrimeMobile. Best deals on smartphones and accessories.",
    creator: "@PrimeMobile",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Askme />
      </div>
    </ClerkProvider>
  );
}