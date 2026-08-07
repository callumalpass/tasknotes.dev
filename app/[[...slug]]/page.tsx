import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { DocsShell } from "../docs-shell";
import { documentation, normalizeRoute, pageAt } from "../content";

interface RouteProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const route = normalizeRoute((await params).slug);
  const destination = documentation.redirects[route];
  const page = pageAt(destination || route);
  if (!page) return { title: "Page not found | TaskNotes" };
  const canonical = `https://tasknotes.dev${page.route}`;
  return {
    title: `${page.title} | TaskNotes`,
    description: page.description,
    alternates: { canonical },
    robots: page.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      title: `${page.title} | TaskNotes`,
      description: page.description,
      url: canonical,
      siteName: "TaskNotes",
      images: [{ url: "https://tasknotes.dev/og.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.title} | TaskNotes`,
      description: page.description,
      images: ["https://tasknotes.dev/og.png"],
    },
  };
}

export default async function DocumentationRoute({ params }: RouteProps) {
  const route = normalizeRoute((await params).slug);
  const destination = documentation.redirects[route];
  if (destination) redirect(destination);
  const page = pageAt(route);
  if (!page) notFound();
  const shellPage = {
    route: page.route,
    title: page.title,
    description: page.description,
    product: page.product,
    version: page.version,
    generated: page.generated,
    hideToc: page.hideToc,
    source: page.source,
    toc: page.toc,
    html: page.html,
  };
  return (
    <DocsShell
      page={shellPage}
      navigation={documentation.navigation}
      versions={documentation.versions}
    />
  );
}
