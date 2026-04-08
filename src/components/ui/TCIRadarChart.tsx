'use client'

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts'

interface TCIData {
  subject: string
  score: number
  fullMark: number
}

interface TCIRadarChartProps {
  data: TCIData[]
}

export function TCIRadarChart({ data }: TCIRadarChartProps) {
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#64748b', fontSize: 13, fontWeight: 700 }} 
          />
          <Radar
            name="기질 척도"
            dataKey="score"
            stroke="#ff5e5e"
            strokeWidth={2}
            fill="#ff5e5e"
            fillOpacity={0.3}
            isAnimationActive={true}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px -2px rgb(0 0 0 / 0.15)' }}
            itemStyle={{ color: '#ff5e5e', fontWeight: 'bold' }}
            cursor={{ fill: '#ff5e5e', opacity: 0.05 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
