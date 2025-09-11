'use client';
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, pdf } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 11 },
  h1: { fontSize: 18, marginBottom: 12 },
  row: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  card: { border: 1, borderColor: '#ddd', padding: 8, borderRadius: 6, marginBottom: 8 },
  table: { display: 'table', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderColor: '#eee', marginTop: 8 },
  tr: { flexDirection: 'row' },
  th: { fontWeight: 'bold', padding: 4, borderRight: 1, borderBottom: 1, borderColor: '#eee' },
  td: { padding: 4, borderRight: 1, borderBottom: 1, borderColor: '#eee' }
});

export async function generatePlanPdf(opts: {
  plan: any, waypoints: any[], plan_products: any[], elevationPngDataUrl?: string
}){
  const { plan, waypoints, plan_products, elevationPngDataUrl } = opts;

  const Doc = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>{plan?.name || 'Plan'}</Text>
        <View style={styles.row}>
          <View style={styles.card}><Text>Distance: {Math.round((plan?.distance_km||0)*10)/10} km</Text></View>
          <View className="card"><Text>D+: {Math.round(plan?.ascent_m||0)} m</Text></View>
          <View className="card"><Text>D-: {Math.round(plan?.descent_m||0)} m</Text></View>
          <View className="card"><Text>Durée cible: {plan?.target_duration_min||'—'} min</Text></View>
        </View>
        {elevationPngDataUrl && (<Image src={elevationPngDataUrl} />)}
        <View>
          <Text style={{ marginTop: 8, fontSize: 14 }}>Waypoints & Produits</Text>
          <View style={styles.table}>
            <View style={styles.tr}>
              <Text style={{...styles.th, width: 60}}>t (min)</Text>
              <Text style={{...styles.th, width: 60}}>km</Text>
              <Text style={{...styles.th, width: 100}}>type</Text>
              <Text style={{...styles.th, width: 260}}>Produits</Text>
            </View>
            {waypoints?.map((w:any)=>(
              <View key={w.id} style={styles.tr}>
                <Text style={{...styles.td, width: 60}}>{w.t_min}</Text>
                <Text style={{...styles.td, width: 60}}>{Number(w.km).toFixed(2)}</Text>
                <Text style={{...styles.td, width: 100}}>{w.type}{w.label?` · ${w.label}`:''}</Text>
                <Text style={{...styles.td, width: 260}}>{(plan_products.filter((p:any)=>p.waypoint_id===w.id)).map((p:any)=>`${p.products.name} x${p.qty}`).join(', ')||'—'}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );

  const blob = await pdf(<Doc />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `plan_${plan?.id||'export'}.pdf`; a.click();
  URL.revokeObjectURL(url);
}
""")

# 5) src/app/plans/[id]/page.tsx (fix imports to relative)
write("src/app/plans/[id]/page.tsx", """
'use client';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AuthGuard from '../../../components/AuthGuard';
import { generatePlanPdf } from '../../../components/PlanPdf';

const fetcher = (url:string)=>fetch(url).then(r=>r.json());

export default function PlanView(){
  const { id } = useParams<{id:string}>();
  const { data } = useSWR(`/api/plans?id=${id}`, fetcher);
  const plan = data?.plan;
  const wps = data?.waypoints||[];
  const prods = data?.plan_products||[];

  async function exportPdf(){
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
""")

# 6) src/app/plans/new/page.tsx (fix imports to relative)
write("src/app/plans/new/page.tsx", """
'use client';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { parseGpxText } from '../../../lib/parseGpx';
import GpxMap from '../../../components/GpxMap';
import ElevationChart from '../../../components/ElevationChart';
import { generateWaypoints } from '../../../lib/waypoints';
import ProductPicker, { Prod } from '../../../components/ProductPicker';
import { exportWaypointsCSV } from '../../../lib/export';
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
      </div
