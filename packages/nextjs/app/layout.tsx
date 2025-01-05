import "@rainbow-me/rainbowkit/styles.css";
import { Metadata } from "next";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";

export const metadata: Metadata = {
  title: "BuidlGuidl Node Manager",
  description:
    "Professional node management with real-time monitoring, secure SSH access, and automated deployment for Ethereum nodes",
  keywords: ["ethereum", "node management", "SSH", "monitoring", "blockchain", "BuidlGuidl"],
  openGraph: {
    title: "BuidlGuidl Node Manager",
    description: "Advanced node management with real-time analytics",
    type: "website",
  },
  robots: "index, follow",
};

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem>
          <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
