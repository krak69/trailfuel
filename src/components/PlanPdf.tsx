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
          <View style={styles.card}><Text>D+: {Math.round(plan?.ascent_m||0)} m</Text></View>
          <View style={styles.card}><Text>D-: {Math.round(plan?.descent_m||0)} m</Text></View>
          <View style={styles.card}><Text>Durée cible: {plan?.target_duration_min||'—'} min</Text></View>
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
            {waypoints?.map((w:any)=>{
              const lines = (plan_products||[]).filter((p:any)=>p.waypoint_id===w.id);
              const products = lines.length? lines.map((p:any)=>`${p.products.name} x${p.qty}`).join(', ') : '—';
              return (
                <View key={w.id} style={styles.tr}>
                  <Text style={{...styles.td, width: 60}}>{w.t_min}</Text>
                  <Text style={{...styles.td, width: 60}}>{Number(w.km).toFixed(2)}</Text>
                  <Text style={{...styles.td, width: 100}}>{w.type}{w.label?` · ${w.label}`:''}</Text>
                  <Text style={{...styles.td, width: 260}}>{products}</Text>
                </View>
              );
            })}
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
