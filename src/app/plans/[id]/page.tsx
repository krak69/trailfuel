'use client';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import { generatePlanPdf } from '@/components/PlanPdf';

const fetcher = (url:string)=>fetch(url).then(r=>r.json());

export default function PlanView(){
  const { id } = useParams<{id:string}>();
  const { data } = useSWR(`/api/plans?id=${id}`, fetcher);
  const plan = data?.plan;
  const wps = data?.waypoints||[];
  const prods = data?.plan_products||[];

  async function exportPdf(){
    // We could capture a canvas for elevation. Skipped here for brevity.
    await generatePlanPdf({ plan, waypoints: wps, plan_products: prods });
  }

  const content = !plan ? <div>Chargement...</div> : (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{plan.name}</h1>
        <div className="flex gap-2">
          <button className="btn" onClick={exportPdf}>Exporter PDF</button>
          <button className="btn" onClick={async()=>{
            if(!confirm('Supprimer ce plan ?')) return;
            const res = await fetch(`/api/plans?id=${id}`, { method:'DELETE' });
            if(res.ok) location.href = '/plans';
          }}>Supprimer</button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card">Distance<br/><b>{Math.round((plan.distance_km||0)*10)/10} km</b></div>
        <div className="card">D+<br/><b>{Math.round(plan.ascent_m||0)} m</b></div>
        <div className="card">D-<br/><b>{Math.round(plan.descent_m||0)} m</b></div>
        <div className="card">Durée cible<br/><b>{plan.target_duration_min||'—'} min</b></div>
      </div>
      <div className="card">
        <div className="font-semibold mb-2">Waypoints & produits</div>
        <table className="table">
          <thead><tr><th>t (min)</th><th>km</th><th>type</th><th>Produits</th></tr></thead>
          <tbody>
            {wps.map((w:any)=>(
              <tr key={w.id}>
                <td>{w.t_min}</td>
                <td>{Number(w.km).toFixed(2)}</td>
                <td>{w.type}{w.label?` · ${w.label}`:''}</td>
                <td>
                  {(prods.filter((p:any)=>p.waypoint_id===w.id)).map((p:any)=>`${p.products.name} x${p.qty}`).join(', ')||'—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link href="/plans" className="btn">← Retour</Link>
    </div>
  );

  return <AuthGuard>{content}</AuthGuard>;
}
