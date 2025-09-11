'use client';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { parseGpxText } from '../../../lib/parseGpx';
import GpxMap from '../../../components/GpxMap'; // assume exists in your repo
import ElevationChart from '../../../components/ElevationChart'; // assume exists in your repo
import { generateWaypoints } from '../../../lib/waypoints'; // assume exists in your repo
import ProductPicker, { Prod } from '../../../components/ProductPicker'; // assume exists in your repo
import { exportWaypointsCSV } from '../../../lib/export'; // assume exists in your repo
import AuthGuard from '../../../components/AuthGuard';
import { supabase } from '../../../lib/supabase/client';

export default function NewPlan(){
  const router = useRouter();
  const [userId, setUserId] = useState<string|null>(null);

  useEffect(()=>{
    (async()=>{
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    })();
  }, []);

  const [gpx, setGpx] = useState<any|null>(null);
  const [parsed, setParsed] = useState<any|null>(null);
  const [hover, setHover] = useState<number|null>(null);

  const [carbs, setCarbs] = useState(60);
  const [ml, setMl] = useState(600);
  const [sodium, setSodium] = useState(800);
  const [duration, setDuration] = useState<number|''>('');
  const [ravitos, setRavitos] = useState<{km:number; label?:string}[]>([]);

  const wps = useMemo(()=>{
    if(!parsed) return [];
    return generateWaypoints({
      gpx: parsed,
      carbs_g_per_hour: carbs,
      ml_per_hour: ml,
      sodium_mg_per_hour: sodium,
      target_duration_min: duration===''?undefined:Number(duration),
      interval_min: 30,
      ravitos
    })
  }, [parsed, carbs, ml, sodium, duration, ravitos]);

  const chartData = useMemo(()=>{
    if(!parsed) return [];
    return parsed.points.map((p:any)=>({ dist: Math.round(p.dist_km*100)/100, ele: Math.round(p.ele) }));
  }, [parsed]);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>){
    const f = e.target.files?.[0]; if(!f) return;
    const txt = await f.text();
    const p = parseGpxText(txt);
    setParsed(p);
    const geojson = {
      type:'FeatureCollection',
      features:[{ type:'Feature', properties:{}, geometry:{ type:'LineString', coordinates: p.points.map((pp:any)=>[pp.lon,pp.lat]) } }]
    };
    setGpx(geojson);
  }

  const [sel, setSel] = useState<Record<number, Prod[]>>({});

  function pickFor(index:number){
    const onSelect = (p:Prod)=>{
      setSel(s => ({ ...s, [index]: [...(s[index]||[]), p] }));
    };
    return <ProductPicker onSelect={onSelect} />
  }

  async function handleSave(){
    const res = await fetch('/api/plans', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({
        user_id: userId,
        name: parsed?.name || 'Plan sans nom',
        distance_km: parsed?.totalDistance,
        ascent_m: parsed?.totalAscent,
        descent_m: parsed?.totalDescent,
        target_duration_min: duration===''?undefined:Number(duration),
        params: { carbs, ml, sodium, ravitos },
        waypoints: wps,
        products_by_wp: Object.entries(sel).map(([idx, arr])=>({
          index: Number(idx),
          products: arr.map(p=>({ product_id: p.id, qty: 1 }))
        }))
      })
    });
    const payload = await res.json().catch(()=>({}));
    if(!res.ok) alert(payload.error||'Erreur'); else {
      router.push(`/plans/${payload.id}`);
    }
  }

  const content = (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Nouveau plan</h1>
      <input type="file" accept=".gpx,application/gpx+xml" onChange={onUpload} className="block" />
      {gpx && (<><GpxMap geojson={gpx} hoverIndex={hover??undefined} /><ElevationChart data={chartData} onHover={setHover} /></>)}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <label className="card">Glucides (g/h)<input className="input mt-2" type="number" value={carbs} onChange={e=>setCarbs(Number(e.target.value))} /></label>
        <label className="card">Hydratation (ml/h)<input className="input mt-2" type="number" value={ml} onChange={e=>setMl(Number(e.target.value))} /></label>
        <label className="card">Sodium (mg/h)<input className="input mt-2" type="number" value={sodium} onChange={e=>setSodium(Number(e.target.value))} /></label>
        <label className="card">Durée cible (min)<input className="input mt-2" type="number" placeholder="ex. 360" value={duration} onChange={e=>setDuration(e.target.value===''?'':Number(e.target.value))} /></label>
      </div>
      {wps.length>0 && (
        <div className="card">
          <div className="font-semibold mb-2">Waypoints</div>
          <table className="table">
            <thead><tr><th>t (min)</th><th>km</th><th>type</th><th>Produits</th><th>+</th></tr></thead>
            <tbody>
              {wps.map((w,i)=>(
                <tr key={i}>
                  <td>{w.t_min}</td><td>{w.km.toFixed(2)}</td><td>{w.type}{w.label?` · ${w.label}`:''}</td>
                  <td>{(sel[i]||[]).map(p=>p.name).join(', ')||'—'}</td>
                  <td>{pickFor(i)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex gap-2">
        <button className="btn" onClick={()=>{
          const rows = wps.map((w,i)=>({ wp:w, products: (sel[i]||[]).map(p=>({
            sku:p.sku, name:p.name, qty:1, cho_g:p.cho_g, sodium_mg:p.sodium_mg, caffeine_mg:p.caffeine_mg, volume_ml:p.volume_ml
          })) }));
          exportWaypointsCSV(rows);
        }}>Exporter CSV</button>
        <button className="btn" onClick={handleSave}>Enregistrer le plan</button>
      </div>
    </div>
  );

  return <AuthGuard>{content}</AuthGuard>;
}
