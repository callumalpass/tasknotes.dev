"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  productLabel,
  sourceEditUrl,
  type NavigationSection,
  type PageView,
  type SearchEntry,
  type Versions,
} from "./content-model";

type Theme = "system" | "light" | "dark";

export function DocsShell({
  page,
  navigation,
  versions,
}: {
  page: PageView;
  navigation: NavigationSection[];
  versions: Versions;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<Theme>("system");
  const [searchPages, setSearchPages] = useState<SearchEntry[]>([]);
  const searchInput = useRef<HTMLInputElement>(null);
  const searchRequest = useRef<Promise<void> | null>(null);

  const openSearch = useCallback(() => {
    setSearchOpen(true);
    if (!searchRequest.current) {
      searchRequest.current = fetch("/search-index.json")
        .then((response) => {
          if (!response.ok) throw new Error(`Search index returned ${response.status}`);
          return response.json() as Promise<SearchEntry[]>;
        })
        .then(setSearchPages)
        .catch(() => setSearchPages([]));
    }
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const stored = localStorage.getItem("tasknotes:theme");
      setTheme(stored === "light" || stored === "dark" ? stored : "system");
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const resolved = theme === "system" ? (media.matches ? "dark" : "light") : theme;
      document.documentElement.dataset.theme = resolved;
      document.documentElement.style.colorScheme = resolved;
      if (theme === "system") localStorage.removeItem("tasknotes:theme");
      else localStorage.setItem("tasknotes:theme", theme);
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (searchOpen) {
          setSearchOpen(false);
          setQuery("");
        } else openSearch();
      } else if (event.key === "Escape") {
        setSearchOpen(false);
        setQuery("");
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openSearch, searchOpen]);

  useEffect(() => {
    document.body.classList.toggle("is-nav-open", menuOpen);
    return () => document.body.classList.remove("is-nav-open");
  }, [menuOpen]);

  useEffect(() => {
    if (searchOpen) queueMicrotask(() => searchInput.current?.focus());
  }, [searchOpen]);

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
  };

  const results = useMemo(() => search(searchPages, query), [query, searchPages]);
  const editUrl = sourceEditUrl(page);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="TaskNotes documentation home">
          <TaskNotesMark />
          <span className="brand__copy">
            <strong>TaskNotes</strong>
            <span>Documentation</span>
          </span>
        </Link>
        <div className="site-header__actions">
          <button
            className="search-trigger"
            type="button"
            aria-haspopup="dialog"
            onClick={openSearch}
          >
            <SearchMark />
            <span>Search</span>
            <kbd>⌘ K</kbd>
          </button>
          <label className="theme-control">
            <span className="sr-only">Colour theme</span>
            <select
              aria-label="Colour theme"
              value={theme}
              onChange={(event) => setTheme(event.target.value as Theme)}
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <a className="app-link" href="https://app.tasknotes.dev/">
            Open app
          </a>
          <button
            className="menu-trigger"
            type="button"
            aria-label="Open documentation navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <MenuMark />
          </button>
        </div>
      </header>

      <div className="site-shell">
        <aside
          className={`sidebar${menuOpen ? " is-open" : ""}`}
          aria-label="Documentation"
        >
          <div className="sidebar__mobile-header">
            <span>Documentation</span>
            <button type="button" onClick={() => setMenuOpen(false)}>
              Close
            </button>
          </div>
          <nav className="sidebar__nav" aria-label="TaskNotes documentation">
            {navigation.map((section) => (
              <section className="nav-section is-open" key={section.label}>
                <p className="nav-section__label">{section.label}</p>
                <ul className="nav-list nav-list--child">
                  {section.items.map((item) => {
                    const active = item.route === page.route;
                    return (
                      <li key={item.route}>
                        <Link
                          className={`nav-link${active ? " is-active" : ""}`}
                          href={item.route}
                          aria-current={active ? "page" : undefined}
                          onClick={() => setMenuOpen(false)}
                        >
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </nav>
          <footer className="sidebar__footer">
            <span>App {versions.app}</span>
            <span>Plugin {versions.obsidian}</span>
            <a href="https://github.com/callumalpass">GitHub</a>
          </footer>
        </aside>

        <button
          className={`sidebar-overlay${menuOpen ? " is-visible" : ""}`}
          type="button"
          aria-label="Close documentation navigation"
          onClick={() => setMenuOpen(false)}
        />

        <main className="prose" id="main">
          {page.route !== "/" ? (
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <ol>
                <li>
                  <Link href="/">Docs</Link>
                </li>
                <li>
                  <span>{productLabel(page.product)}</span>
                </li>
                <li aria-current="page">
                  <span>{page.title}</span>
                </li>
              </ol>
            </nav>
          ) : null}
          <header className="doc-header">
            <p className={`doc-status doc-status--${page.product}`}>
              {productLabel(page.product)}
              {page.version ? ` · ${page.version}` : ""}
              {page.generated ? " · Generated from source" : ""}
            </p>
            <h1 className="page-title">{page.title}</h1>
            <p className="page-description">{page.description}</p>
          </header>
          <div dangerouslySetInnerHTML={{ __html: page.html }} />
          {editUrl ? (
            <footer className="page-source">
              <span>Source: {page.source}</span>
              <a href={editUrl}>View source</a>
            </footer>
          ) : null}
        </main>

        <aside className="toc-column" aria-label="Page outline">
          {!page.hideToc && page.toc.length > 1 ? (
            <nav className="toc" aria-label="On this page">
              <p className="toc__heading">On this page</p>
              <ul>
                {page.toc.map((item) => (
                  <li className={item.level === 3 ? "toc__sub" : undefined} key={item.id}>
                    <a href={`#${item.id}`}>{item.text}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </aside>
      </div>

      {searchOpen ? (
        <div className="search-backdrop" role="presentation" onMouseDown={closeSearch}>
          <section
            className="search-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-label"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="search-dialog__header">
              <label id="search-label" htmlFor="docs-search">
                Search TaskNotes documentation
              </label>
              <button type="button" onClick={closeSearch}>
                Close
              </button>
            </div>
            <input
              id="docs-search"
              ref={searchInput}
              type="search"
              autoComplete="off"
              placeholder="App, Obsidian, collections, reminders…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <p className="search-dialog__hint" aria-live="polite">
              {query.trim().length < 2
                ? "Type at least two characters."
                : `${results.length} result${results.length === 1 ? "" : "s"}.`}
            </p>
            <ol className="search-results">
              {results.map((result) => (
                <li key={result.url}>
                  <Link href={result.url} onClick={closeSearch}>
                    <strong>{result.title}</strong>
                    <span>{result.description}</span>
                    <small>{productLabel(result.product)}</small>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        </div>
      ) : null}
    </>
  );
}

function search(pages: SearchEntry[], query: string): SearchEntry[] {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (query.trim().length < 2 || !terms.length) return [];
  return pages
    .map((page) => {
      const title = page.title.toLowerCase();
      const description = page.description.toLowerCase();
      const text = page.text.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (!title.includes(term) && !description.includes(term) && !text.includes(term))
          return { page, score: 0 };
        if (title.includes(term)) score += 30;
        if (description.includes(term)) score += 10;
        score += Math.min(5, text.split(term).length - 1);
      }
      return { page, score };
    })
    .filter((result) => result.score > 0)
    .sort((left, right) => right.score - left.score || left.page.title.localeCompare(right.page.title))
    .slice(0, 12)
    .map((result) => result.page);
}

function TaskNotesMark() {
  return (
    <svg className="brand__mark" viewBox="0 0 100 100" aria-hidden="true">
      <path
        fill="currentColor"
        d="M98.5.6c-2.2-.1-5.8 2.1-7.1 3.4-3.8 3.5-9.4 11.1-15.4 18.4 3.4 7.4 1.5 17.1-9.8 28.1-8.7 8.4-16.7 14.4-21.3 20.6-4.5 6-6.2 12-2.8 22.1.2-.2.4-.5.5-.8 10.6-19.7 17.9-27.3 41.9-47.1 4.8-4 4.8-9.5 6-17 1-7 2.7-15.6 8.5-26.8.7-1.4.8-2.2.3-2.7-.2-.2-.5-.3-.8-.2ZM72.7 26.3c-9.7 11.9-21.2 25.5-30.8 32.8-5.9 4.6-11.8-4.4-17.2-9.8-5.2-6.9-9.6-12.7-12.3-6.7-1 2.6-1.6 6.2-3.4 10.1 4.1.6 7.3 2.3 9.8 4.5 6.1 5.4 8.1 13.8 12.4 17.3 1.9 1.8 4.1 3 7.5 3.2.7-1.4 1.6-2.7 2.5-4 5.2-7.1 13.3-13 21.8-21.2 7.5-7.3 12.7-17.7 9.7-26.2ZM6.4 56.9c-1.1 1.4-2.4 2.8-4.1 4.1-4.8 4 2 7 9.8 12 7.3 4.7 17.8 11.6 25.7 24.2.6 1 1.7 2 2.9 2.6-.9-5.4-.9-8.8-.5-11.9-3.3-.6-6.1-2.1-8.4-4.7-5.7-6.3-7.5-13.7-12.6-18.3-3-2.7-7-4.6-12.8-4.7Z"
      />
    </svg>
  );
}

function SearchMark() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="5.5" />
      <path d="m12.5 12.5 4 4" />
    </svg>
  );
}

function MenuMark() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3 5.5h14M3 10h14M3 14.5h14" />
    </svg>
  );
}
