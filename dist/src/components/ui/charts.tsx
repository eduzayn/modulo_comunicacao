'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: number[] | { name: string, value: number }[]
  height?: number
  showLabels?: boolean
  showGrid?: boolean
  color?: string
}

/**
 * Componente de gráfico de área simples
 */
export function AreaChart({
  data,
  height = 100,
  showLabels = false,
  showGrid = false,
  color = 'hsl(var(--primary))',
  className,
  ...props
}: ChartProps) {
  const chartData = useMemo(() => {
    if (!Array.isArray(data)) return []
    return Array.isArray(data[0]) ? data : data.map(d => typeof d === 'number' ? d : d.value)
  }, [data])
  
  // Calcular valor mínimo e máximo para escala
  const max = Math.max(...chartData.map(d => Number(d)))
  const min = Math.min(...chartData.map(d => Number(d)))
  
  // Ajustar para ter um pouco de margem no topo e na base
  const adjustedMax = max + (max - min) * 0.1
  const adjustedMin = Math.max(0, min - (max - min) * 0.1)
  
  // Pontos do path para o gráfico
  const points = chartData.map((value, i) => {
    const x = (i / (chartData.length - 1)) * 100
    const y = 100 - ((Number(value) - adjustedMin) / (adjustedMax - adjustedMin)) * 100
    return `${x},${y}`
  })
  
  // Criar path para a área
  const linePath = `M${points.join(' L')}`
  const areaPath = `${linePath} L100,100 L0,100 Z`
  
  return (
    <div
      className={cn('relative w-full', className)}
      style={{ height }}
      {...props}
    >
      {showGrid && (
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-4">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="border-dashed border-border/50 border-0 border-t border-l first:border-l-0"
            />
          ))}
        </div>
      )}
      
      <svg
        className="w-full h-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.5" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Área sob a linha */}
        <path
          d={areaPath}
          fill="url(#area-gradient)"
          strokeWidth="0"
        />
        
        {/* Linha principal */}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        
        {/* Pontos de dados */}
        {showLabels && chartData.map((value, i) => {
          const x = (i / (chartData.length - 1)) * 100
          const y = 100 - ((Number(value) - adjustedMin) / (adjustedMax - adjustedMin)) * 100
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r="2"
                fill="white"
                stroke={color}
                strokeWidth="1.5"
              />
              {i === chartData.length - 1 && (
                <text
                  x={x - 2}
                  y={y - 8}
                  fontSize="10"
                  textAnchor="end"
                  fill="currentColor"
                >
                  {value}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

/**
 * Componente de gráfico de barras simples
 */
export function BarChart({
  data,
  height = 100,
  showLabels = false,
  showGrid = false,
  color = 'hsl(var(--primary))',
  className,
  ...props
}: ChartProps) {
  const chartData = useMemo(() => {
    if (!Array.isArray(data)) return []
    return Array.isArray(data[0]) ? data : data.map(d => typeof d === 'number' ? d : d.value)
  }, [data])
  
  // Calcular valor máximo para escala
  const max = Math.max(...chartData.map(d => Number(d)))
  
  return (
    <div
      className={cn('relative w-full', className)}
      style={{ height }}
      {...props}
    >
      {showGrid && (
        <div className="absolute inset-0 flex flex-col">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-1 border-t border-border/50 last:border-t-0"
            />
          ))}
        </div>
      )}
      
      <div className="relative h-full flex items-end">
        {chartData.map((value, i) => {
          const height = (Number(value) / max) * 100
          return (
            <div
              key={i}
              className="relative flex-1 mx-[1px] group"
            >
              <div
                className="w-full rounded-t transition-all duration-300 group-hover:opacity-80"
                style={{
                  height: `${height}%`,
                  backgroundColor: color,
                }}
              />
              {showLabels && (
                <div className="absolute w-full text-center text-xs -top-5 truncate">
                  {value}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Componente de gráfico de barras horizontais
 */
export function BarChartHorizontal({
  data,
  height = 200,
  showLabels = true,
  showGrid = true,
  color = 'hsl(var(--primary))',
  className,
  ...props
}: ChartProps) {
  const chartData = useMemo(() => {
    if (!Array.isArray(data)) return []
    return data.map(d => typeof d === 'object' ? d : { name: `Item ${d}`, value: Number(d) })
  }, [data])
  
  // Calcular valor máximo para escala
  const max = Math.max(...chartData.map(d => Number(d.value)))
  
  return (
    <div
      className={cn('relative w-full', className)}
      style={{ height }}
      {...props}
    >
      {showGrid && (
        <div className="absolute inset-y-0 right-0 w-[calc(100%-100px)] flex flex-col">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex-1 border-t border-border/50 last:border-t-0"
            />
          ))}
        </div>
      )}
      
      <div className="relative h-full flex flex-col justify-around">
        {chartData.map((item, i) => (
          <div key={i} className="flex items-center h-8 group">
            <div className="w-24 text-sm truncate pr-2">
              {item.name}
            </div>
            <div className="flex-1 h-6 relative">
              <div
                className="absolute inset-y-0 left-0 rounded transition-all duration-300 group-hover:opacity-80"
                style={{
                  width: `${(Number(item.value) / max) * 100}%`,
                  backgroundColor: color,
                }}
              />
              {showLabels && (
                <div className="absolute inset-y-0 flex items-center pl-2 text-xs font-medium text-background">
                  {item.value}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 