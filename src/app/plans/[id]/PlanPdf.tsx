'use client';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

export default function PlanPdf({ plan, waypoints, products }:any){
  const styles = StyleSheet.create({
    page:{ padding:30, fontSize:12 },
    section:{ marginBottom:12 },
    heading:{ fontSize:18, marginBottom:8 },
    row:{ flexDirection:'row', justifyContent:'space-between' },
  });
  const Doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading}>{plan.name}</Text>
        <Text>Distance: {plan.distance_km?.toFixed(1)} km  D+ {plan.ascent_m} m  D- {plan.descent_m} m  Durée {plan.target_duration_min} min</Text>
        {waypoints.map((w:any)=>(
          <View key={w.id} style={styles.section}>
            <Text>{w.t_min} min - Km {w.km.toFixed(1)} {w.type} {w.label||''}</Text>
            {products.filter((p:any)=>p.waypoint_id===w.id).map((pp:any)=>(
              <Text key={pp.id}>  - {pp.products.name} x{pp.qty} ({pp.products.cho_g}g CHO, {pp.products.sodium_mg}mg Na, {pp.products.volume_ml}ml)</Text>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
  return <PDFDownloadLink document={Doc} fileName={`plan-${plan.id}.pdf`}>
    {({loading})=> loading? 'Préparation PDF...' : 'Télécharger PDF'}
  </PDFDownloadLink>;
}
