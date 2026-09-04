"use client"

import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Database } from "lucide-react"

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

interface StockFinancialsProps {
  financialData: FinancialData[] | null
}

const formatCurrency = (value: number | string | null | undefined) => {
  if (value === null || value === undefined || value === "") return "-"
  const numValue = typeof value === "string" ? parseFloat(value) : value
  if (isNaN(numValue)) return "-"
  return `Rp ${numValue.toLocaleString("id-ID")}`
}

export function StockFinancials({ financialData }: StockFinancialsProps) {
  const [selectedYear, setSelectedYear] = useState<string>("")

  if (!financialData || financialData.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-full py-8 text-center">
        <Database className="h-5 w-5 text-[#6b7280] mb-2" />
        <span className="font-mono text-xs text-[#6b7280]">No financial disclosures available</span>
      </div>
    )
  }

  const sortedData = [...financialData].sort(
    (a, b) => new Date(b.EndDate).getTime() - new Date(a.EndDate).getTime()
  )

  const defaultYear = sortedData[0].EndDate.split("-")[0]
  const currentYear = selectedYear || defaultYear
  const selectedData = sortedData.find((data) => data.EndDate.startsWith(currentYear)) || sortedData[0]
  const availableYears = Array.from(new Set(sortedData.map((data) => data.EndDate.split("-")[0])))

  const financialMetrics = [
    { label: "Reporting Period", value: selectedData.EndDate },
    { label: "Entity Code", value: `${selectedData.EntityCode} - ${selectedData.EntityName}` },
    { label: "Base Currency", value: selectedData.CurrencyType || "IDR" },
    { label: "Total Assets", value: formatCurrency(selectedData.TotalAssets), highlight: true },
    { label: "Total Equity", value: formatCurrency(selectedData.TotalEquity) },
    { label: "Net Profit", value: formatCurrency(selectedData.NetProfit), isProfit: true },
    { label: "Operating Profit", value: formatCurrency(selectedData.OperatingProfit) },
    { label: "Operating Cash Flow", value: formatCurrency(selectedData.CashFromOperating) },
    { label: "Investing Cash Flow", value: formatCurrency(selectedData.CashFromInvesting) },
    { label: "Financing Cash Flow", value: formatCurrency(selectedData.CashFromFinancing) },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/8">
        <div>
          <h3 className="text-xs font-semibold text-white tracking-tight">
            Financial Disclosures
          </h3>
          <p className="text-[10.5px] text-[#9ca3af]">Audited statements filed with IDX</p>
        </div>

        <Select value={currentYear} onValueChange={(value) => setSelectedYear(value)}>
          <SelectTrigger className="w-[96px] h-7 bg-white/5 border-white/10 text-xs font-mono text-[#f4f5f8] rounded-lg">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent className="glass-panel-strong border-white/15 text-[#f4f5f8] font-mono text-xs">
            {availableYears.map((yr) => (
              <SelectItem key={yr} value={yr} className="hover:bg-white/10 focus:bg-white/10">
                FY {yr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="divide-y divide-white/5 overflow-y-auto max-h-[360px] custom-scrollbar pr-1">
        {financialMetrics.map((m, idx) => (
          <div key={idx} className="flex items-center justify-between py-2 text-xs font-mono">
            <span className="text-[#9ca3af]">{m.label}</span>
            <span
              className={`tabular-nums ${
                m.isProfit
                  ? "text-[#10b981] font-semibold"
                  : m.highlight
                  ? "text-white font-semibold"
                  : "text-[#cbd5e1]"
              }`}
            >
              {m.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
