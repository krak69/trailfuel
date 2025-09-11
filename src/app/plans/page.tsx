'use client';
import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (url:string)=>fetch(url).then(r=>r.json());

export default function PlansList(){
  const { data } = useSWR('/api/plans', fetcher);
  const plans = data?.plans || [];
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Mes plans</h1>
        <Link href="/plans/new" className="btn">Nouveau plan</Link>
      </div>
      <table className="table">
        <thead><tr><th>Nom</th><th>Distance</th><th>D+</th><th>Durée</th><th></th></tr></thead>
        <tbody>
          {plans.map((p:any)=>(
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{Math.round((p.distance_km||0)*10)/10} km</td>
              <td>{Math.round(p.ascent_m||0)} m</td>
              <td>{p.target_duration_min ? `${p.target_duration_min} min` : '-'}</td>
              <td className="text-right">
                <Link href={`/plans/${p.id}`} className="btn">Voir</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
