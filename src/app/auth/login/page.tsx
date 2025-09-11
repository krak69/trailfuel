'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function Login(){
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(()=>{
    (async()=>{
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.replace('/plans');
    })();
  }, [router]);

  async function login(e: React.FormEvent){
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: typeof window!=='undefined' ? `${window.location.origin}/plans` : undefined } });
    if(error) alert(error.message); else setSent(true);
  }

  return (
    <div className="max-w-md mx-auto card space-y-4">
      <h1 className="text-xl font-bold">Connexion</h1>
      <p className="opacity-80">Saisis ton email, tu recevras un lien magique.</p>
      <form onSubmit={login} className="space-y-2">
        <input className="input w-full" type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="ton@email.com" />
        <button className="btn w-full" type="submit">Recevoir le lien</button>
      </form>
      {sent && <div className="text-sm opacity-80">Lien envoyé. Vérifie ta boîte mail.</div>}
    </div>
  )
}
