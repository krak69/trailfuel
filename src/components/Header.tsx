'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const p = usePathname();
  const tab = (href:string, label:string) => (
    <Link href={href} className={`px-3 py-2 rounded-xl ${p===href?'bg-white/20':'bg-white/10 hover:bg-white/20'}`}>{label}</Link>
  );
  return (
    <header className="flex items-center justify-between p-4">
      <Link href="/" className="font-bold text-xl">TrailFuel</Link>
      <nav className="flex gap-2">
        {tab('/plans', 'Plans')}
        {tab('/products', 'Produits')}
        {tab('/stock', 'Stock')}
        <Link href="/plans/new" className="btn">Nouveau plan</Link>
      </nav>
    </header>
  )
}
