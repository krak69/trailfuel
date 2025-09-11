import { Waypoint } from './types'

export function exportWaypointsCSV(rows: {
  wp: Waypoint,
  products: { sku:string; name:string; qty:number; cho_g:number; sodium_mg:number; volume_ml:number; caffeine_mg:number }[]
}[]) {
  const head = ['time_min','km','type','label','product_sku','product_name','qty','cho_g','sodium_mg','caffeine_mg','volume_ml'];
  const lines = [head.join(',')];
  for(const row of rows){
    if(row.products.length===0){
      lines.push([row.wp.t_min,row.wp.km,row.wp.type,row.wp.label||'', '', '', 0,0,0,0,0].join(','));
    } else {
      for(const p of row.products){
        lines.push([row.wp.t_min,row.wp.km,row.wp.type,row.wp.label||'', p.sku, p.name, p.qty, p.cho_g, p.sodium_mg, p.caffeine_mg, p.volume_ml].join(','));
      }
    }
  }
  const blob = new Blob([lines.join('\n')], { type:'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'trailfuel_plan.csv'; a.click();
  URL.revokeObjectURL(url);
}
