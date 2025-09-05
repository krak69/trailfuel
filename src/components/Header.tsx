"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
};

const navItems: NavItem[] = [
  { href: "/account",     label: "Mon profil" },
  { href: "/plans",      label: "Mes plans nutrition" },
  { href: "/catalogue",  label: "Catalogue produits" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const isActive = (href: string) => pathname?.startsWith(href);

  const onImportClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // TODO: brancher votre logique d'upload/parse GPX ici
    // Pour le moment, on redirige simplement vers la page d'import avec le nom du fichier.
    window.location.href = `/gpx/import?filename=${encodeURIComponent(file.name)}`;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Gauche : Logo / Nom */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-black/80 grid place-items-center">
    <Image
      src="/logo-white.png"       
      alt="TrailFuel"
      width={20}                  // ajuste si besoin (<= 32 pour rester dans 8x8)
      height={20}
      priority
    />
  </div>
              <span className="text-lg font-semibold tracking-tight">TrailFuel</span>
            </Link>
          </div>

          {/* Milieu : Menu (desktop) */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "text-sm transition-colors",
                  isActive(item.href)
                    ? "font-semibold text-black"
                    : "text-black/70 hover:text-black"
                ].join(" ")}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Droite : actions rapides */}
          <div className="hidden md:flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".gpx,application/gpx+xml"
              className="hidden"
              onChange={onFileChange}
            />
            <button
              onClick={onImportClick}
              className="rounded-xl border px-3 py-2 text-sm font-medium hover:bg-black hover:text-white transition"
              aria-label="Importer un fichier GPX"
            >
              Import GPX
            </button>
            <Link
              href="/account"
              className="rounded-xl bg-black px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition"
            >
              Mon compte
            </Link>
          </div>

          {/* Bouton menu mobile */}
          <button
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border"
            onClick={() => setOpen((v) => !v)}
            aria-label="Ouvrir/fermer le menu"
            aria-expanded={open}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Menu mobile */}
        {open && (
          <div className="md:hidden border-t py-3">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={[
                    "rounded-lg px-2 py-2 text-sm",
                    isActive(item.href)
                      ? "bg-black text-white"
                      : "text-black/80 hover:bg-black/5"
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".gpx,application/gpx+xml"
                className="hidden"
                onChange={onFileChange}
              />
              <button
                onClick={onImportClick}
                className="flex-1 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-black hover:text-white transition"
              >
                Import GPX
              </button>
              <Link
                href="/account"
                className="flex-1 rounded-lg bg-black px-3 py-2 text-center text-sm font-medium text-white hover:opacity-90 transition"
                onClick={() => setOpen(false)}
              >
                Mon compte
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
