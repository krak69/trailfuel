'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AuthGuard({ children }:{ children: React.ReactNode }){
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(()=>{
    (async()=>{
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/auth/login');
      } else {
        setReady(true);
      }
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session)=>{
        if(!session) router.replace('/auth/login');
      });
      return ()=>{ authListener.subscription.unsubscribe(); }
    })();
  }, [router]);

  if (!ready) return <div className="p-6">Vérification de la session…</div>;
  return <>{children}</>;
}
