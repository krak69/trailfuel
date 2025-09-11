import { gpx } from '@tmcw/togeojson'
import type { FeatureCollection, LineString } from 'geojson'
import { ParsedGpx, ParsedPoint } from './types'

function haversine(lat1:number, lon1:number, lat2:number, lon2:number){
  const R = 6371000;
  const toRad = (d:number)=>d*Math.PI/180;
  const dLat = toRad(lat2-lat1);
  const dLon = toRad(lon2-lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export function parseGpxText(xmlText:string): ParsedGpx {
  const doc = new DOMParser().parseFromString(xmlText, 'text/xml');
  const fc = gpx(doc) as FeatureCollection;
  const line = fc.features.find(f=>f.geometry?.type==='LineString') as any;
  if(!line) throw new Error('No LineString in GPX');
  const coords = (line.geometry as LineString).coordinates as [number,number,number?][];
  const name = line.properties?.name || 'Parcours';
  let totalDist = 0, totalUp = 0, totalDown = 0;
  const pts: ParsedPoint[] = [];
  let prev = None as any;
  for (let i=0;i<coords.length;i++){
    const [lon,lat,eleRaw] = coords[i];
    const ele = Number(eleRaw||0);
    if(i>0){
      const [plon,plat,pele] = coords[i-1];
      const d = haversine(plat, plon, lat, lon);
      totalDist += d;
      const diff = ele - Number(pele||0);
      if (diff > 0) totalUp += diff; else totalDown += -diff;
    }
    pts.push({ lat, lon, ele, dist_km: totalDist/1000 });
  }
  return {
    name,
    points: pts,
    totalDistance: totalDist/1000,
    totalAscent: totalUp,
    totalDescent: totalDown,
    hasTime: false
  }
}
