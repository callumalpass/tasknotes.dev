import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tasknotes.dev"),
  title: "TaskNotes documentation",
  description:
    "Guides and reference material for the TaskNotes app, Obsidian plugin, and portable task format.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#fcfcfd" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { const stored = localStorage.getItem("tasknotes:theme"); const preference = stored === "light" || stored === "dark" ? stored : "system"; const resolved = preference === "system" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : preference; document.documentElement.dataset.theme = resolved; document.documentElement.style.colorScheme = resolved; })();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
