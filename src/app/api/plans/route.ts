import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET(req: NextRequest){
  const id = req.nextUrl.searchParams.get('id');
  const s = supabaseServer();
  if(id){
    const { data: plan } = await s.from('plans').select('*').eq('id', id).single();
    const { data: waypoints } = await s.from('waypoints').select('*').eq('plan_id', id).order('t_min');
    const { data: plan_products } = await s.from('plan_products').select('id,qty,waypoint_id,products:product_id(name)').eq('plan_id', id);
    return NextResponse.json({ plan, waypoints, plan_products });
  } else {
    const { data: plans } = await s.from('plans').select('*').order('created_at', { ascending: false }).limit(100);
    return NextResponse.json({ plans });
  }
}

export async function POST(req: NextRequest){
  const body = await req.json();
  const s = supabaseServer();

  const { data: plan, error } = await s.from('plans').insert({
    user_id: null,
    name: body.name,
    distance_km: body.distance_km,
    ascent_m: body.ascent_m,
    descent_m: body.descent_m,
    target_duration_min: body.target_duration_min,
    params: body.params,
    totals: {},
    status: 'saved'
  }).select('*').single();

  if(error) return NextResponse.json({ error: error.message }, { status: 400 });

  // insert waypoints
  const wps = (body.waypoints||[]).map((w:any)=>({ ...w, plan_id: plan.id }));
  if(wps.length>0){
    const { error: e2, data: wpInserted } = await s.from('waypoints').insert(wps).select('id,t_min');
    if(e2) return NextResponse.json({ error: e2.message }, { status: 400 });

    // map index->id
    const sorted = [...wpInserted].sort((a,b)=>(a.t_min - b.t_min));
    const mapIndexToId = (idx:number)=>sorted[idx]?.id;

    // insert plan_products (will trigger stock decrement)
    const lines = (body.products_by_wp||[]).flatMap((row:any)=>{
      const waypoint_id = mapIndexToId(row.index);
      return row.products.map((p:any)=>({ plan_id: plan.id, product_id: p.product_id, waypoint_id, qty: p.qty || 1 }))
    });
    if(lines.length>0){
      const { error: e3 } = await s.from('plan_products').insert(lines);
      if(e3) return NextResponse.json({ error: e3.message }, { status: 400 });
    }
  }

  return NextResponse.json({ id: plan.id });
}

export async function DELETE(req: NextRequest){
  const id = req.nextUrl.searchParams.get('id');
  if(!id) return NextResponse.json({ error:'missing id' }, { status:400 });
  const s = supabaseServer();
  // deleting plan cascades plan_products -> trigger increments stock
  const { error } = await s.from('plans').delete().eq('id', id);
  if(error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
