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
  { href: "/account",    label: "Mon profil" },
  { href: "/plans",      label: "Mes plans nutrition" },
  { href: "/suivi",      label: "Suivi nutrition" },
  { href: "/catalogue",  label: "Catalogue produits" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const isActive = (href: string) => pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Gauche : Logo / Nom */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-black/80">
                <Image
                  src="/logo-white.png"
                  alt="TrailFuel"
                  width={20}
                  height={20}
                  priority
                />
              </div>
              <span className="text-lg font-semibold tracking-tight">TrailFuel</span>
            </Link>
          </div>

          {/* Milieu : Menu (desktop) */}
          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "rounded-lg px-3 py-2 text-sm transition",
                    active
                      ? "bg-black text-white font-semibold"
                      : "text-black/70 hover:text-black hover:bg-black/5",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Droite : actions rapides */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/plans/new"
              className="rounded-xl bg-black px-3 py-2 text-sm font-medium text-white transition hover:opacity-90"
              aria-label="Créer un nouveau plan"
            >
              Nouveau plan
            </Link>
            <Link
              href="/account"
              className="rounded-xl border px-3 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
            >
              Mon compte
            </Link>
          </div>

          {/* Bouton menu mobile */}
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Ouvrir/fermer le menu"
            aria-expanded={open}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Menu mobile */}
        {open && (
          <div className="md:hidden border-t py-3">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={[
                      "rounded-lg px-3 py-2 text-sm",
                      active
                        ? "bg-black text-white font-semibold"
                        : "text-black/80 hover:bg-black/5",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-3 flex items-center gap-2">
              <Link
                href="/plans/new"
                className="flex-1 rounded-lg bg-black px-3 py-2 text-center text-sm font-medium text-white transition hover:opacity-90"
                onClick={() => setOpen(false)}
              >
                Nouveau plan
              </Link>
              <Link
                href="/account"
                className="flex-1 rounded-lg border px-3 py-2 text-center text-sm font-medium transition hover:bg-black hover:text-white"
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
