'use client';
import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

type Props = { geojson: any, hoverIndex?: number };

export default function GpxMap({ geojson, hoverIndex }: Props) {
  const ref = useRef<HTMLDivElement|null>(null);
  const mapRef = useRef<maplibregl.Map|null>(null);

  useEffect(()=>{
    if(!ref.current) return;
    if(mapRef.current) return;
    const map = new maplibregl.Map({
      container: ref.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [2,48],
      zoom: 5
    });
    mapRef.current = map;
    map.on('load', ()=>{
      map.addSource('track', { type:'geojson', data: geojson });
      map.addLayer({
        id:'track-line', type:'line', source:'track',
        paint:{ 'line-color':'#4dd0ff', 'line-width':3 }
      });
      const bounds = new maplibregl.LngLatBounds();
      for (const c of geojson.features[0].geometry.coordinates) bounds.extend(c as any);
      map.fitBounds(bounds, { padding: 40, maxZoom: 13 });
    });
    return ()=>{ map.remove(); }
  }, [geojson]);

  useEffect(()=>{
    const map = mapRef.current; if(!map) return;
    let marker = (map as any).__cursor as maplibregl.Marker|undefined;
    if(hoverIndex==null){ if(marker){ marker.remove(); (map as any).__cursor=undefined; } return; }
    const coords = geojson.features[0].geometry.coordinates[hoverIndex];
    if(!coords) return;
    if(!marker){
      marker = new maplibregl.Marker({ color:'#ffcf4d' });
      marker.addTo(map); (map as any).__cursor = marker;
    }
    marker!.setLngLat(coords as any);
  }, [hoverIndex, geojson]);

  return <div ref={ref} className="h-72 w-full rounded-xl overflow-hidden border border-white/10" />
}
