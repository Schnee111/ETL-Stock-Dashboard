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

const TerminalTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const isUp = (data.Close ?? 0) >= (data.Open ?? 0)
    const diff = (data.Close ?? 0) - (data.Open ?? 0)
    const diffPct = data.Open ? (diff / data.Open) * 100 : 0

    return (
      <div className="bg-[#0F121A] p-3 border border-[#2E3A54] rounded shadow-2xl font-mono text-xs text-[#E2E8F0] min-w-[210px]">
        <div className="flex items-center justify-between border-b border-[#1E2638] pb-1.5 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[#10B981]">{data.Symbol}</span>
            <span className="text-[10px] text-[#64748B]">{data.Date}</span>
          </div>
          <span
            className={`text-[10px] px-1 py-0.5 rounded font-mono ${
              isUp
                ? "bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30"
                : "bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30"
            }`}
          >
            {diff >= 0 ? "+" : ""}
            {diffPct.toFixed(2)}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] tabular-nums">
          <div className="flex justify-between text-[#94A3B8]">
            <span>OPEN</span>
            <span className="text-white font-medium">Rp {Number(data.Open).toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-[#94A3B8]">
            <span>HIGH</span>
            <span className="text-[#10B981] font-medium">Rp {Number(data.High).toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-[#94A3B8]">
            <span>LOW</span>
            <span className="text-[#EF4444] font-medium">Rp {Number(data.Low).toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-[#94A3B8]">
            <span>CLOSE</span>
            <span className="text-white font-bold">Rp {Number(data.Close).toLocaleString("id-ID")}</span>
          </div>
        </div>

        <div className="mt-2 pt-1.5 border-t border-[#1E2638] flex justify-between items-center text-[10px] text-[#64748B]">
          <span>VOL</span>
          <span className="font-mono tabular-nums text-[#94A3B8]">
            {Number(data.Volume).toLocaleString("id-ID")}
          </span>
        </div>
      </div>
    )
  }
  return null
}

export default function StockChart({ data }: PriceChartProps) {
  const [activeMetric, setActiveMetric] = useState<"Close" | "Open" | "High" | "Low">("Close")
  const [selectedRange, setSelectedRange] = useState<string>("all")
  const [chartType, setChartType] = useState<"area" | "line">("area")

  // Ensure dates are sorted chronologically
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime())
  }, [data])

  // Filter data based on selected range
  const formattedData = useMemo(() => {
    if (!sortedData.length || selectedRange === "all") return sortedData

    const endDate = new Date(sortedData[sortedData.length - 1].Date)
    const startDate = new Date(endDate)

    switch (selectedRange) {
      case "5d":
        startDate.setDate(endDate.getDate() - 5)
        break
      case "1mo":
        startDate.setMonth(endDate.getMonth() - 1)
        break
      case "6mo":
        startDate.setMonth(endDate.getMonth() - 6)
        break
      case "1y":
        startDate.setFullYear(endDate.getFullYear() - 1)
        break
      case "3y":
        startDate.setFullYear(endDate.getFullYear() - 3)
        break
    }

    return sortedData.filter((item) => new Date(item.Date) >= startDate)
  }, [sortedData, selectedRange])

  // Min and max bounds
  const { minValue, maxValue, maxVolume } = useMemo(() => {
    if (!formattedData.length) {
      return { minValue: 0, maxValue: 100, maxVolume: 1000 }
    }
    const vals = formattedData.map((d) => d[activeMetric] || d.Close)
    const min = Math.min(...vals)
    const max = Math.max(...vals)
    const pad = (max - min) * 0.08 || min * 0.05
    const vols = formattedData.map((d) => d.Volume || 0)
    return {
      minValue: Math.max(0, Math.floor(min - pad)),
      maxValue: Math.ceil(max + pad),
      maxVolume: Math.max(...vols) * 4, // 4x factor keeps volume bars in bottom quarter
    }
  }, [formattedData, activeMetric])

  const ranges = [
    { label: "5D", value: "5d" },
    { label: "1M", value: "1mo" },
    { label: "6M", value: "6mo" },
    { label: "1Y", value: "1y" },
    { label: "3Y", value: "3y" },
    { label: "ALL", value: "all" },
  ]

  const metrics: Array<{ key: "Close" | "Open" | "High" | "Low"; label: string; color: string }> = [
    { key: "Close", label: "CLOSE", color: "#10B981" },
    { key: "Open", label: "OPEN", color: "#06B6D4" },
    { key: "High", label: "HIGH", color: "#3B82F6" },
    { key: "Low", label: "LOW", color: "#EF4444" },
  ]

  return (
    <div className="w-full flex flex-col">
      {/* Top Chart Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-2 border-b border-[#1E2638]">
        {/* Metric Toggles */}
        <div className="flex items-center gap-1 bg-[#090A0F] p-0.5 rounded border border-[#1E2638]">
          {metrics.map((m) => {
            const active = activeMetric === m.key
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => setActiveMetric(m.key)}
                className={`px-2 py-0.5 text-[11px] font-mono tracking-wider rounded transition-colors ${
                  active
                    ? "bg-[#161B26] text-white font-semibold border border-[#2E3A54] shadow-sm"
                    : "text-[#64748B] hover:text-[#94A3B8]"
                }`}
              >
                {m.label}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          {/* Chart Style Switcher */}
          <div className="flex items-center bg-[#090A0F] p-0.5 rounded border border-[#1E2638]">
            <button
              type="button"
              onClick={() => setChartType("area")}
              className={`px-2 py-0.5 text-[11px] font-mono rounded ${
                chartType === "area"
                  ? "bg-[#161B26] text-[#10B981] font-semibold border border-[#1E2638]"
                  : "text-[#64748B] hover:text-[#94A3B8]"
              }`}
            >
              AREA
            </button>
            <button
              type="button"
              onClick={() => setChartType("line")}
              className={`px-2 py-0.5 text-[11px] font-mono rounded ${
                chartType === "line"
                  ? "bg-[#161B26] text-[#10B981] font-semibold border border-[#1E2638]"
                  : "text-[#64748B] hover:text-[#94A3B8]"
              }`}
            >
              LINE
            </button>
          </div>

          {/* Timeframe selector */}
          <div className="flex items-center gap-0.5 bg-[#090A0F] p-0.5 rounded border border-[#1E2638]">
            {ranges.map((range) => {
              const active = selectedRange === range.value
              return (
                <button
                  key={range.value}
                  type="button"
                  onClick={() => setSelectedRange(range.value)}
                  className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors ${
                    active
                      ? "bg-[#10B981] text-[#090A0F] font-bold"
                      : "text-[#64748B] hover:text-[#E2E8F0]"
                  }`}
                >
                  {range.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="h-[360px] w-full relative">
        {formattedData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={formattedData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="terminalEmeraldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="90%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="terminalCyanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.25} />
                  <stop offset="90%" stopColor="#06B6D4" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="2 3"
                stroke="#1E2638"
                vertical={false}
              />

              <XAxis
                dataKey="Date"
                stroke="#475569"
                tick={{ fontSize: 10, fill: "#64748B", fontFamily: "monospace" }}
                tickFormatter={(val: string) => {
                  if (!val) return ""
                  const d = new Date(val)
                  if (isNaN(d.getTime())) return val
                  if (selectedRange === "5d") return `${d.getDate()}/${d.getMonth() + 1}`
                  if (selectedRange === "1mo" || selectedRange === "6mo")
                    return `${d.getDate()} ${d.toLocaleString("en", { month: "short" })}`
                  if (selectedRange === "1y")
                    return `${d.toLocaleString("en", { month: "short" })} '${d.getFullYear().toString().slice(-2)}`
                  return `${d.getFullYear()}`
                }}
                minTickGap={45}
                axisLine={{ stroke: "#1E2638" }}
                tickLine={false}
              />

              <YAxis
                yAxisId="price"
                domain={[minValue, maxValue]}
                stroke="#475569"
                orientation="right"
                tick={{ fontSize: 10, fill: "#64748B", fontFamily: "monospace" }}
                tickFormatter={(val) => Number(val).toLocaleString("id-ID")}
                axisLine={false}
                tickLine={false}
                width={56}
              />

              <YAxis
                yAxisId="volume"
                domain={[0, maxVolume]}
                orientation="left"
                hide
              />

              <Tooltip
                content={<TerminalTooltip />}
                cursor={{ stroke: "#2E3A54", strokeWidth: 1, strokeDasharray: "3 3" }}
              />

              {/* Underlying Volume Bars in bottom section */}
              <Bar
                yAxisId="volume"
                dataKey="Volume"
                fill="#1E2638"
                opacity={0.65}
                maxBarSize={8}
                isAnimationActive={false}
              />

              {/* Price Line / Area */}
              {chartType === "area" ? (
                <Area
                  yAxisId="price"
                  type="monotone"
                  dataKey={activeMetric}
                  stroke="#10B981"
                  strokeWidth={1.75}
                  fill="url(#terminalEmeraldGradient)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#10B981", stroke: "#090A0F", strokeWidth: 2 }}
                />
              ) : (
                <Line
                  yAxisId="price"
                  type="monotone"
                  dataKey={activeMetric}
                  stroke="#10B981"
                  strokeWidth={1.75}
                  dot={false}
                  activeDot={{ r: 4, fill: "#10B981", stroke: "#090A0F", strokeWidth: 2 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-xs text-[#64748B]">
            DATA FEED EMPTY / CONNECTING
          </div>
        )}
      </div>

      {/* Monospace Sub-strip Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#1E2638] text-[10px] font-mono text-[#64748B] tabular-nums">
        <div className="flex items-center gap-3">
          <span>HIGH 52W: <strong className="text-[#94A3B8]">Rp {maxValue.toLocaleString("id-ID")}</strong></span>
          <span>LOW 52W: <strong className="text-[#94A3B8]">Rp {minValue.toLocaleString("id-ID")}</strong></span>
          <span>VOL (AVG): <strong className="text-[#94A3B8]">{(maxVolume / 4).toLocaleString("id-ID")}</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-[#10B981]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
          <span>REALTIME FEED</span>
        </div>
      </div>
    </div>
  )
}
