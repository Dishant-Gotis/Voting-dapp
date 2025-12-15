import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "BlockVote - Decentralized Voting System",
  description: "A secure, transparent, and immutable blockchain-based voting platform built on Ethereum",
  openGraph: {
    title: "BlockVote - Decentralized Voting System",
    description: "Cast your vote securely on the blockchain",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="blockchain-grid min-h-screen">
          {children}
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(30, 41, 59, 0.95)',
              border: '1px solid rgba(37, 99, 235, 0.3)',
              color: '#f1f5f9',
            },
          }}
        />
      </body>
    </html>
  );
}
