'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export type Prod = { id:string; sku:string; name:string; type:string; cho_g:number; sodium_mg:number; caffeine_mg:number; volume_ml:number; };
type Props = {
  onSelect: (p:Prod)=>void
};

export default function ProductPicker({ onSelect }: Props){
  const [list, setList] = useState<Prod[]>([]);
  const [q, setQ] = useState('');
  useEffect(()=>{
    (async()=>{
      const { data } = await supabase.from('products').select('id,sku,name,type,cho_g,sodium_mg,caffeine_mg,volume_ml').eq('enabled', true).limit(200);
      setList(data||[]);
    })();
  }, []);
  const filtered = list.filter(p => (p.name+p.sku+p.type).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-2">
        <input className="input" placeholder="Rechercher..." value={q} onChange={e=>setQ(e.target.value)} />
      </div>
      <div className="max-h-56 overflow-auto space-y-1">
        {filtered.map(p=>(
          <button key={p.id} className="w-full text-left btn" onClick={()=>onSelect(p)}>
            <div className="font-medium">{p.name}</div>
            <div className="text-xs opacity-80">{p.sku} · {p.type} · {p.cho_g}g CHO · {p.sodium_mg}mg Na</div>
          </button>
        ))}
      </div>
    </div>
  )
}
