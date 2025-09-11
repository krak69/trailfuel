import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { PDFDocument, rgb } from '@react-pdf/renderer'

export async function POST(req:NextRequest){
  try {
    const { planId } = await req.json();
    const s = supabaseServer();
    const { data: plan } = await s.from('plans').select('*').eq('id', planId).single();
    const { data: waypoints } = await s.from('waypoints').select('*').eq('plan_id', planId).order('t_min');
    const { data: plan_products } = await s.from('plan_products').select('*,products(*)').eq('plan_id', planId);
    if(!plan) return NextResponse.json({error:'Plan not found'},{status:404});

    // Generate a simple PDF with route summary and table of products
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595,842]); // A4 portrait
    const { height } = page.getSize();
    const font = await pdfDoc.embedFont(PDFDocument.PDFFont?.Helvetica ?? (await pdfDoc.embedStandardFont('Helvetica')));
    let y = height-50;
    page.drawText(`Plan nutrition: ${plan.name}`, {x:50,y, size:18, font});
    y-=30;
    page.drawText(`Distance: ${plan.distance_km?.toFixed(1)} km, D+: ${plan.ascent_m} m, D-: ${plan.descent_m} m`, {x:50,y, size:12});
    y-=20;
    page.drawText(`Durée cible: ${plan.target_duration_min||'-'} min`, {x:50,y, size:12});
    y-=40;

    waypoints.forEach((w:any)=>{
      page.drawText(`${w.t_min}min - Km${w.km.toFixed(1)} ${w.type} ${w.label||''}`, {x:50,y, size:10});
      y-=15;
      const prods = (plan_products||[]).filter((p:any)=>p.waypoint_id===w.id);
      prods.forEach((pp:any)=>{
        page.drawText(`   • ${pp.products.name} x${pp.qty} (${pp.products.cho_g}g CHO)`, {x:70,y, size:9});
        y-=12;
      });
    });

    const pdfBytes = await pdfDoc.save();
    return new NextResponse(pdfBytes, {
      headers:{
        'Content-Type':'application/pdf',
        'Content-Disposition': `attachment; filename="plan-${planId}.pdf"`
      }
    });
  }catch(e:any){
    return NextResponse.json({error: e.message}, {status:500});
  }
}
