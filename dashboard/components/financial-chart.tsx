"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

interface FinancialData {
  Cash: number | null
  CashFromFinancing: string
  CashFromInvesting: string
  CashFromOperating: string
  CurrencyType: string
  EndDate: string
  EntityCode: string
  EntityName: string
  GrossProfit: number | null
  LongTermBorrowing: number | null
  NetProfit: string
  OperatingProfit: string
  Revenue: number | null
  ShortTermBorrowing: number | null
  TotalAssets: string
  TotalEquity: string
  filename: string
}

interface FinancialChartCardProps {
  financialData: FinancialData[]
}

const formatCurrencyShort = (value: number) => {
  if (Math.abs(value) >= 1000000000000) {
    return `Rp ${(value / 1000000000000).toFixed(1)}T`
  }
  if (Math.abs(value) >= 100000000) {
    return `Rp ${(value / 1000000000).toFixed(1)}B`
  }
  return `Rp ${value.toLocaleString("id-ID")}`
}

const FinancialTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0F121A] p-2.5 border border-[#2E3A54] rounded shadow-xl font-mono text-xs">
        <div className="text-[11px] font-bold text-[#94A3B8] border-b border-[#1E2638] pb-1 mb-1.5">
          FY {label}
        </div>
        {payload.map((item: any) => (
          <div key={item.name} className="flex items-center justify-between gap-4 py-0.5">
            <span className="flex items-center gap-1.5 text-[#94A3B8]">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color || item.fill }} />
              {item.name}
            </span>
            <span className="font-bold text-white tabular-nums">
              {formatCurrencyShort(Number(item.value))}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function FinancialChartCard({ financialData }: FinancialChartCardProps) {
  if (!financialData || financialData.length === 0) {
    return null
  }

  // Format data untuk chart
  const chartData = financialData
    .map((data) => ({
      year: new Date(data.EndDate).getFullYear(),
      netProfit: parseFloat(data.NetProfit) || 0,
      totalAssets: parseFloat(data.TotalAssets) || 0,
      operatingProfit: parseFloat(data.OperatingProfit) || 0,
      cashFromOperating: parseFloat(data.CashFromOperating) || 0,
    }))
    .reverse()

  return (
    <div className="bg-[#0F121A] border border-[#1E2638] hover:border-[#2E3A54] rounded transition-colors flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b border-[#1E2638]">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-[#06B6D4] rounded-sm" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#E2E8F0]">
            FINANCIAL PERFORMANCE TRENDS
          </h3>
        </div>
        <span className="font-mono text-[10px] text-[#64748B] uppercase">AUDITED STATEMENTS</span>
      </div>

      <div className="p-3 grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        {/* Grafik Line untuk Profit */}
        <div className="bg-[#090A0F] border border-[#1E2638] rounded p-2.5 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[11px] font-semibold text-[#94A3B8] uppercase">
              PROFITABILITY (NET & OPERATING)
            </span>
            <span className="font-mono text-[10px] text-[#64748B]">IDR TRIL</span>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="2 3" stroke="#1E2638" vertical={false} />
                <XAxis
                  dataKey="year"
                  stroke="#475569"
                  tick={{ fontSize: 10, fill: "#64748B", fontFamily: "monospace" }}
                  axisLine={{ stroke: "#1E2638" }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#475569"
                  tick={{ fontSize: 10, fill: "#64748B", fontFamily: "monospace" }}
                  tickFormatter={(value) => formatCurrencyShort(value)}
                  axisLine={false}
                  tickLine={false}
                  width={58}
                />
                <Tooltip content={<FinancialTooltip />} />
                <Line
                  type="monotone"
                  dataKey="netProfit"
                  name="Net Profit"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#10B981" }}
                />
                <Line
                  type="monotone"
                  dataKey="operatingProfit"
                  name="Operating Profit"
                  stroke="#06B6D4"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  dot={{ r: 2.5, fill: "#06B6D4" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grafik Bar untuk Aset dan Kas */}
        <div className="bg-[#090A0F] border border-[#1E2638] rounded p-2.5 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[11px] font-semibold text-[#94A3B8] uppercase">
              BALANCE SHEET ASSETS & OPERATING CASH
            </span>
            <span className="font-mono text-[10px] text-[#64748B]">IDR TRIL</span>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="2 3" stroke="#1E2638" vertical={false} />
                <XAxis
                  dataKey="year"
                  stroke="#475569"
                  tick={{ fontSize: 10, fill: "#64748B", fontFamily: "monospace" }}
                  axisLine={{ stroke: "#1E2638" }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#475569"
                  tick={{ fontSize: 10, fill: "#64748B", fontFamily: "monospace" }}
                  tickFormatter={(value) => formatCurrencyShort(value)}
                  axisLine={false}
                  tickLine={false}
                  width={58}
                />
                <Tooltip content={<FinancialTooltip />} />
                <Bar dataKey="totalAssets" name="Total Assets" fill="#3B82F6" radius={[2, 2, 0, 0]} maxBarSize={28} />
                <Bar
                  dataKey="cashFromOperating"
                  name="Operating Cash"
                  fill="#10B981"
                  radius={[2, 2, 0, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
