'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function LoginPage(){
  const [email,setEmail] = useState('');
  const [msg,setMsg] = useState<string|null>(null);

  async function handleLogin(e:React.FormEvent){
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    });
    if(error){ setMsg(error.message); }
    else { setMsg('Lien de connexion envoyé. Vérifie ton email.'); }
  }

  return (
    <div className="max-w-md mx-auto p-6 card space-y-4">
      <h1 className="text-xl font-bold">Connexion</h1>
      <form onSubmit={handleLogin} className="space-y-2">
        <input className="input w-full" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <button className="btn w-full">Recevoir le lien magique</button>
      </form>
      {msg && <div>{msg}</div>}
    </div>
  )
}
