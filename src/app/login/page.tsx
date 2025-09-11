'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase/client';

export default function LegacyLoginRedirect(){
  const router = useRouter();
  useEffect(()=>{ router.replace('/auth/login'); }, [router]);
  return <div className="p-6">Redirection vers la page de connexion…</div>;
}
