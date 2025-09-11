import { ParsedGpx, Waypoint } from './types'

export function generateWaypoints(opts: {
  gpx: ParsedGpx,
  carbs_g_per_hour: number,
  ml_per_hour: number,
  sodium_mg_per_hour: number,
  target_duration_min?: number,
  interval_min?: number,
  ravitos?: { km:number; label?:string }[]
}): Waypoint[] {
  const {
    gpx, target_duration_min, interval_min=30, ravitos=[]
  } = opts;
  const totalKm = gpx.totalDistance;
  let durationMin = target_duration_min ?? Math.round((totalKm/8)*60); // fallback 8km/h
  const res: Waypoint[] = [];
  // start
  res.push({ km: 0, t_min: 0, type:'start', label:'Départ' });
  for(let t=interval_min; t<durationMin; t+=interval_min){
    // linear map time -> distance
    const km = totalKm * (t/durationMin);
    res.push({ km, t_min: t, type:'auto' });
  }
  // finish
  res.push({ km: totalKm, t_min: durationMin, type:'finish', label:'Arrivée' });

  // merge ravitos (snap to nearest t)
  for(const r of ravitos){
    const t = Math.round((r.km/totalKm)*durationMin);
    // find nearest in res
    let idx = 0; let best = 1e9;
    for(let i=0;i<res.length;i++){
      const d = Math.abs(res[i].t_min - t);
      if (d<best){ best = d; idx = i; }
    }
    res[idx] = { ...res[idx], type:'ravito', label: r.label || `Ravito ${Math.round(r.km)} km` };
  }
  // sort by time
  res.sort((a,b)=>a.t_min-b.t_min);
  return res;
}
