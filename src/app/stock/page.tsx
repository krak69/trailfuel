'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase/client';

export default function StockPage(){
  const [rows, setRows] = useState<any[]>([]);

  async function load(){
    const { data } = await supabase.from('products').select('id,sku,name,stock:stock(qty)').order('name');
    setRows(data?.map((p:any)=>({ id:p.id, sku:p.sku, name:p.name, qty:p.stock?.qty??0 }))||[]);
  }
  useEffect(()=>{ load(); },[]);

  async function setQty(id:string, qty:number){
    const { error } = await supabase.from('stock').upsert({ product_id:id, qty });
    if(error) alert(error.message); else load();
  }

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold">Stock</h1>
      <table className="table">
        <thead><tr><th>SKU</th><th>Nom</th><th>Qté</th><th></th></tr></thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.id}>
              <td>{r.sku}</td><td>{r.name}</td>
              <td>{r.qty}</td>
              <td>
                <div className="flex gap-2">
                  <button className="btn" onClick={()=>setQty(r.id, r.qty+1)}>+1</button>
                  <button className="btn" onClick={()=>setQty(r.id, Math.max(0, r.qty-1))}>-1</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
