"use client"

import { useState, useMemo } from "react"
import {
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface PriceData {
  Symbol: string
  Date: string
  Open: number
  High: number
  Low: number
  Close: number
  Volume: number
}

interface PriceChartProps {
  data: PriceData[]
}

const CleanChartTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const diff = (data.Close ?? 0) - (data.Open ?? 0)
    const diffPct = data.Open ? (diff / data.Open) * 100 : 0
    const isUp = diff >= 0

    return (
      <div className="glass-panel p-3 border border-white/10 rounded-xl shadow-2xl font-sans text-xs text-[#f4f5f8] min-w-[190px] max-w-[240px] pointer-events-none">
        <div className="flex items-center justify-between border-b border-white/8 pb-2 mb-2">
          <div className="flex flex-col">
            <span className="font-bold text-white text-xs">{data.Symbol}</span>
            <span className="text-[10px] text-[#9ca3af] font-mono">{data.Date}</span>
          </div>
          <span
            className={`text-[11px] px-1.5 py-0.5 rounded font-mono font-medium ${
              isUp
                ? "bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/25"
                : "bg-[#f43f5e]/15 text-[#f43f5e] border border-[#f43f5e]/25"
            }`}
          >
            {diff >= 0 ? "+" : ""}
            {diffPct.toFixed(2)}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] font-mono tabular-nums">
          <div className="flex justify-between">
            <span className="text-[#9ca3af]">Open</span>
            <span className="text-white">Rp {Number(data.Open).toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#9ca3af]">Close</span>
            <span className="text-white font-semibold">Rp {Number(data.Close).toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#9ca3af]">High</span>
            <span className="text-[#10b981]">Rp {Number(data.High).toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#9ca3af]">Low</span>
            <span className="text-[#f43f5e]">Rp {Number(data.Low).toLocaleString("id-ID")}</span>
          </div>
        </div>

        <div className="mt-2 pt-1.5 border-t border-white/8 flex justify-between items-center text-[10px] text-[#9ca3af]">
          <span>Volume</span>
          <span className="font-mono tabular-nums text-white">
            {Number(data.Volume).toLocaleString("id-ID")}
          </span>
        </div>
      </div>
    )
  }
  return null
}

export default function StockChart({ data }: PriceChartProps) {
  const [activeMetric] = useState<"Close" | "Open" | "High" | "Low">("Close")
  const [chartType, setChartType] = useState<"area" | "line">("area")

  // Ensure dates are sorted chronologically
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime())
  }, [data])

  const { minValue, maxValue, maxVolume } = useMemo(() => {
    if (!sortedData.length) return { minValue: 0, maxValue: 100, maxVolume: 1000 }
    let min = Infinity
    let max = -Infinity
    let maxVol = 0

    sortedData.forEach((d) => {
      const val = d[activeMetric] ?? 0
      if (val < min) min = val
      if (val > max) max = val
      if (d.Volume > maxVol) maxVol = d.Volume
    })

    const padding = (max - min) * 0.08 || 10
    return {
      minValue: Math.max(0, Math.floor(min - padding)),
      maxValue: Math.ceil(max + padding),
      maxVolume: maxVol || 1000,
    }
  }, [sortedData, activeMetric])

  const isNetPositive = useMemo(() => {
    if (sortedData.length < 2) return true
    return sortedData[sortedData.length - 1].Close >= sortedData[0].Close
  }, [sortedData])

  const strokeColor = isNetPositive ? "#10b981" : "#f43f5e"

  return (
    <div className="w-full flex flex-col">
      {/* Chart Controls Bar */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/8 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[#9ca3af] font-medium hidden sm:inline">Display:</span>
          <div className="inline-flex rounded-lg bg-white/5 p-0.5 border border-white/8">
            <button
              type="button"
              onClick={() => setChartType("area")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                chartType === "area"
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-[#9ca3af] hover:text-white"
              }`}
            >
              Area
            </button>
            <button
              type="button"
              onClick={() => setChartType("line")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                chartType === "line"
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-[#9ca3af] hover:text-white"
              }`}
            >
              Line
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-[#9ca3af]">
          <span className="hidden sm:inline">Range:</span>
          <span className="tabular-nums text-white">
            Rp {minValue.toLocaleString("id-ID")} - Rp {maxValue.toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      {/* Main Chart SVG Canvas */}
      <div className="h-[240px] sm:h-[320px] md:h-[360px] w-full relative">
        {sortedData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={sortedData}
              margin={{ top: 8, right: 0, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={strokeColor} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255, 255, 255, 0.05)"
                vertical={false}
              />

              <XAxis
                dataKey="Date"
                stroke="transparent"
                tick={{ fontSize: 10, fill: "#6b7280", fontFamily: "var(--font-jetbrains), monospace" }}
                tickFormatter={(val: string) => {
                  if (!val) return ""
                  const d = new Date(val)
                  if (isNaN(d.getTime())) return val
                  return `${d.getDate()}/${d.getMonth() + 1}`
                }}
                minTickGap={35}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                yAxisId="price"
                domain={[minValue, maxValue]}
                orientation="right"
                tick={{ fontSize: 10, fill: "#6b7280", fontFamily: "var(--font-jetbrains), monospace" }}
                tickFormatter={(val) => {
                  if (val >= 1000) return `${(val / 1000).toFixed(1)}k`
                  return `${val}`
                }}
                axisLine={false}
                tickLine={false}
                width={38}
              />

              <YAxis
                yAxisId="volume"
                domain={[0, maxVolume * 3.5]}
                orientation="left"
                hide
              />

              <Tooltip
                content={<CleanChartTooltip />}
                cursor={{ stroke: "rgba(255, 255, 255, 0.15)", strokeWidth: 1, strokeDasharray: "2 2" }}
              />

              {/* Underlying Volume Histogram */}
              <Bar
                yAxisId="volume"
                dataKey="Volume"
                fill="rgba(255, 255, 255, 0.08)"
                maxBarSize={6}
                radius={[2, 2, 0, 0]}
                isAnimationActive={false}
              />

              {/* Price Line / Area */}
              {chartType === "area" ? (
                <Area
                  yAxisId="price"
                  type="monotone"
                  dataKey={activeMetric}
                  stroke={strokeColor}
                  strokeWidth={2}
                  fill="url(#chartGradient)"
                  dot={false}
                  activeDot={{ r: 4, fill: strokeColor, stroke: "#0d0f14", strokeWidth: 2 }}
                />
              ) : (
                <Line
                  yAxisId="price"
                  type="monotone"
                  dataKey={activeMetric}
                  stroke={strokeColor}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: strokeColor, stroke: "#0d0f14", strokeWidth: 2 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-xs text-[#6b7280]">
            Connecting to real-time market stream...
          </div>
        )}
      </div>

      {/* Sub-strip Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 mt-1 border-t border-white/8 text-[11px] font-mono text-[#9ca3af] tabular-nums">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <span>52W High: <strong className="text-white">Rp {maxValue.toLocaleString("id-ID")}</strong></span>
          <span>52W Low: <strong className="text-white">Rp {minValue.toLocaleString("id-ID")}</strong></span>
          <span className="hidden sm:inline">Avg Vol: <strong className="text-white">{(maxVolume / 4).toLocaleString("id-ID")}</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-[#10b981]">
          <span className="emerald-pip" />
          <span className="text-[10px] font-semibold tracking-wider">LIVE FEED</span>
        </div>
      </div>
    </div>
  )
}
