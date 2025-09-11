'use client';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type Props = { data: { dist:number; ele:number }[], onHover?: (index:number|null)=>void };

export default function ElevationChart({ data, onHover }: Props){
  const [active, setActive] = useState<number|null>(null);
  return (
    <div className="h-52 w-full card">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          onMouseMove={(e)=>{
            // @ts-ignore
            const idx = e && e.activeTooltipIndex!=null ? e.activeTooltipIndex : null;
            setActive(idx); onHover?.(idx);
          }}
          onMouseLeave={()=>{ setActive(null); onHover?.(null); }}
        >
          <XAxis dataKey="dist" tick={{fill:'#9fb3d8'}} />
          <YAxis tick={{fill:'#9fb3d8'}} />
          <Tooltip />
          <Line type="monotone" dataKey="ele" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
