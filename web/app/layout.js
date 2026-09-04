import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CustomScrollbar from "../components/CustomScrollbar";
import GlobalKeyboardShortcuts from "../components/GlobalKeyboardShortcuts";
import PageTitleManager from "../components/PageTitleManager";
import InstallAppModal from "../components/InstallAppModal";
import { AppProvider } from "../context/AppContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "RTI Information Access Portal | Government of India",
    template: "%s | RTI Information Access Portal — Government of India",
  },
  description:
    "Official RTI Information Access Portal, Government of India. Search proactive public disclosures instantly via Flash RTI or submit statutory RTI applications online under the Right to Information Act, 2005.",
  applicationName: "RTI Information Access Portal",
  keywords: [
    "RTI",
    "Right to Information",
    "Right to Information Act 2005",
    "Government of India",
    "Flash RTI",
    "Public Records",
    "File RTI Online",
    "Central Information Commission",
    "Transparency Portal India",
    "CPIO"
  ],
  authors: [{ name: "Government of India" }],
  creator: "RTI Information Access Portal Initiative",
  publisher: "Ministry of Personnel, Public Grievances and Pensions, Government of India",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://rtionline.gov.in"),
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" }
    ],
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "RTI Information Access Portal | Government of India",
    description:
      "Official portal for Indian citizens to search proactive disclosures and file statutory RTI requests under the Right to Information Act, 2005.",
    siteName: "RTI Information Access Portal",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/logo2.png",
        width: 800,
        height: 600,
        alt: "RTI Information Access Portal — Government of India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RTI Information Access Portal | Government of India",
    description:
      "Official portal to search open government records instantly or file statutory RTI applications.",
    images: ["/logo2.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans text-gray-900 bg-[#f8fafc]">
        <AppProvider>
          <PageTitleManager />
          <GlobalKeyboardShortcuts />
          <CustomScrollbar />
          <InstallAppModal />
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
