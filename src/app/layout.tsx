import "~/styles/globals.css";

import { type Metadata } from "next";
import { SessionProvider } from 'next-auth/react'

export const metadata: Metadata = {
  title: "Valley's Drive In",
  description: "The Valley's Drive In Theater",
  icons: [{ rel: "icon", url: "/logo.webp" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SessionProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </SessionProvider>
  );
}
