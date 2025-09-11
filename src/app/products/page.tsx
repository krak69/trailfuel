'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function ProductsPage(){
  const [list, setList] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ sku:'', name:'', type:'gel', cho_g:30, sodium_mg:50 });

  async function load(){
    const { data } = await supabase.from('products').select('*').order('created_at',{ascending:false});
    setList(data||[]);
  }
  useEffect(()=>{ load(); },[]);

  async function add(){
    const { error } = await supabase.from('products').insert(form);
    if(error) alert(error.message); else { setForm({ sku:'', name:'', type:'gel', cho_g:30, sodium_mg:50 }); load(); }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Produits</h1>
      <div className="card grid grid-cols-6 gap-2">
        <input className="input col-span-2" placeholder="SKU" value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})} />
        <input className="input col-span-2" placeholder="Nom" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <select className="input" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
          <option>gel</option><option>boisson</option><option>barre</option><option>purée</option><option>caps</option><option>autre</option>
        </select>
        <button className="btn" onClick={add}>Ajouter</button>
      </div>
      <table className="table">
        <thead><tr><th>SKU</th><th>Nom</th><th>Type</th><th>CHO</th><th>Na</th></tr></thead>
        <tbody>
          {list.map(p=>(<tr key={p.id}><td>{p.sku}</td><td>{p.name}</td><td>{p.type}</td><td>{p.cho_g}</td><td>{p.sodium_mg}</td></tr>))}
        </tbody>
      </table>
    </div>
  )
}
