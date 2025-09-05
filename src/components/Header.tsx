"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import * as React from "react";

type NavItem = { href: string; label: string };

const navItems: NavItem[] = [
  { href: "/plans/new",  label: "Nouveau plan" },   // ✅ remplace Import GPX
  { href: "/profil",     label: "Mon profil" },
  { href: "/nutrition",  label: "Paramètres nutrition" },
  { href: "/plans",      label: "Mes plans" },
  { href: "/catalogue",  label: "Catalogue produits" },
];

export default function Header() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 border-b bg-black/90 backdrop-blur supports-[backdrop-filter]:bg-black/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="group inline-flex items-center gap-3">
          <Image
            src="/logo-white.svg"
            alt="TrailFuel"
            width={28}
            height={28}
            priority
            className="shrink-0"
          />
          <span className="text-sm font-semibold tracking-wide text-white group-hover:opacity-90">
            TrailFuel
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "rounded-md px-3 py-2 text-sm font-medium transition",
                isActive(item.href)
                  ? "bg-white text-black"
                  : "text-white/80 hover:bg-white/10 hover:text-white",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
