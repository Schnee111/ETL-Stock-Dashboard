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
      <div className="bg-[#0F121A] border border-[#1E2638] rounded p-4 flex flex-col justify-center items-center h-full text-center">
        <Database className="h-6 w-6 text-[#64748B] mb-2" />
        <span className="font-mono text-xs text-[#64748B]">NO FINANCIAL METRICS AVAILABLE</span>
      </div>
    )
  }

  // Urutkan data dari tahun terbaru ke terlama
  const sortedData = [...financialData].sort(
    (a, b) => new Date(b.EndDate).getTime() - new Date(a.EndDate).getTime()
  )

  const defaultYear = sortedData[0].EndDate.split("-")[0]
  const currentYear = selectedYear || defaultYear
  const selectedData = sortedData.find((data) => data.EndDate.startsWith(currentYear)) || sortedData[0]
  const availableYears = Array.from(new Set(sortedData.map((data) => data.EndDate.split("-")[0])))

  const financialMetrics = [
    { label: "Reporting Period", value: selectedData.EndDate, isDate: true },
    { label: "Entity Code / Name", value: `${selectedData.EntityCode} - ${selectedData.EntityName}` },
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
    <div className="bg-[#0F121A] border border-[#1E2638] hover:border-[#2E3A54] rounded transition-colors flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b border-[#1E2638]">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-[#10B981]" />
          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#E2E8F0]">
              FINANCIAL STATEMENT DATA
            </h3>
          </div>
        </div>

        <Select value={currentYear} onValueChange={(value) => setSelectedYear(value)}>
          <SelectTrigger className="w-[100px] h-7 bg-[#090A0F] border-[#1E2638] text-xs font-mono text-[#E2E8F0]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent className="bg-[#0F121A] border-[#1E2638] text-[#E2E8F0] font-mono text-xs">
            {availableYears.map((yr) => (
              <SelectItem key={yr} value={yr} className="hover:bg-[#161B26] focus:bg-[#161B26]">
                FY {yr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="p-3 divide-y divide-[#1E2638]/70 overflow-y-auto max-h-[360px]">
        {financialMetrics.map((m, idx) => (
          <div key={idx} className="flex items-center justify-between py-2 text-xs font-mono">
            <span className="text-[#64748B] uppercase tracking-tight">{m.label}</span>
            <span
              className={`tabular-nums font-medium ${
                m.isProfit ? "text-[#10B981] font-bold" : m.highlight ? "text-white font-bold" : "text-[#E2E8F0]"
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
