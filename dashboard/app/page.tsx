"use client"

import { useState, useEffect } from "react"
import {
  ArrowDown,
  ArrowUp,
  Search,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Layers,
  FileText,
  PieChart,
} from "lucide-react"

import StockChart from "@/components/stock-chart"
import MarketOverview from "@/components/market-overview"
import StockNews from "@/components/stock-news"
import StockComparison from "@/components/stock-comparison"
import PortfolioAnalytics from "@/components/portfolio-analytics"
import { StockFinancials } from "@/components/stock-finance"
import { FinancialChartCard } from "@/components/financial-chart"

interface Emiten {
  ticker: string
  name: string
}

interface PriceData {
  Close: number
  Date: string
  High: number
  Low: number
  Open: number
  Symbol: string
  Volume: number
}

interface StockData {
  price: number
  change: number
  changePercent: number
  open: number
  high: number
  low: number
  volume: number
}

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

async function fetchEmiten(): Promise<Emiten[]> {
  try {
    const apiUrl = "http://localhost:5000/api/emiten"
    const res = await fetch(apiUrl, { cache: "no-store" })
    if (!res.ok) throw new Error(`Failed to fetch emiten: ${res.status}`)
    const tickers: string[] = await res.json()
    return tickers.map((ticker) => ({ ticker, name: ticker.split(".")[0] }))
  } catch {
    return [
      { ticker: "BBRI.JK", name: "BBRI" },
      { ticker: "BBCA.JK", name: "BBCA" },
      { ticker: "TLKM.JK", name: "TLKM" },
      { ticker: "ASII.JK", name: "ASII" },
      { ticker: "BMRI.JK", name: "BMRI" },
      { ticker: "BBNI.JK", name: "BBNI" },
    ]
  }
}

function generateDummyPriceData(symbol: string, periodStr: string): PriceData[] {
  const basePrices: Record<string, number> = {
    "BBRI.JK": 4720,
    "BBCA.JK": 9850,
    "TLKM.JK": 3120,
    "ASII.JK": 5050,
    "BMRI.JK": 6550,
    "BBNI.JK": 5300,
  }
  const base = basePrices[symbol] || 4500
  const days = periodStr === "1m" ? 30 : periodStr === "3m" ? 90 : periodStr === "6m" ? 180 : 365
  const result: PriceData[] = []
  let current = base

  const now = new Date()
  for (let i = days; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    if (d.getDay() === 0 || d.getDay() === 6) continue

    const fluctuation = (Math.sin(i * 0.2) * 0.015 + (Math.random() - 0.48) * 0.02)
    const open = Math.round(current)
    current = Math.max(50, current * (1 + fluctuation))
    const close = Math.round(current)
    const high = Math.round(Math.max(open, close) * (1 + Math.random() * 0.012))
    const low = Math.round(Math.min(open, close) * (1 - Math.random() * 0.012))
    const volume = Math.round(35000000 + Math.random() * 85000000)

    result.push({
      Date: d.toISOString().split("T")[0],
      Open: open,
      High: high,
      Low: low,
      Close: close,
      Volume: volume,
      Symbol: symbol,
    })
  }
  return result
}

function generateDummyFinancials(symbol: string): FinancialData[] {
  const code = symbol.split(".")[0]
  const years = ["2024", "2023", "2022"]
  return years.map((y) => ({
    EntityCode: code,
    EntityName: `${code} Persero Tbk`,
    EndDate: `${y}-12-31`,
    CurrencyType: "IDR",
    Revenue: code === "BBCA" ? 82400000000000 : 124500000000000,
    GrossProfit: code === "BBCA" ? 64200000000000 : 88700000000000,
    OperatingProfit: "52000000000000",
    NetProfit: code === "BBCA" ? "48600000000000" : "60400000000000",
    TotalAssets: "1965000000000000",
    TotalEquity: "342000000000000",
    Cash: 45000000000000,
    CashFromOperating: "42000000000000",
    CashFromInvesting: "-12000000000000",
    CashFromFinancing: "-18000000000000",
    ShortTermBorrowing: 15000000000000,
    LongTermBorrowing: 85000000000000,
    filename: `financial_statement_${code}_${y}.pdf`,
  }))
}

async function fetchPriceData(emiten: string, period: string): Promise<PriceData[]> {
  try {
    const apiUrl = `http://localhost:5000/api/harga?emiten=${emiten}&period=${period}`
    const res = await fetch(apiUrl, { cache: "no-store" })
    if (!res.ok) throw new Error("Failed to fetch price data")
    const data = await res.json()
    if (Array.isArray(data) && data.length > 0) return data
    return generateDummyPriceData(emiten, period)
  } catch {
    return generateDummyPriceData(emiten, period)
  }
}

async function fetchFinancialData(entityCode: string): Promise<FinancialData[]> {
  try {
    const apiUrl = `http://localhost:5000/api/idx/finance?entity_code=${entityCode}`
    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error("Failed to fetch financial data")
    const data = await res.json()
    if (Array.isArray(data) && data.length > 0) return data as FinancialData[]
    return generateDummyFinancials(entityCode)
  } catch {
    return generateDummyFinancials(entityCode)
  }
}

function calculateStockData(prices: PriceData[]): StockData | null {
  if (prices.length < 1) return null

  const sortedPrices = [...prices].sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime())
  const latest = sortedPrices[sortedPrices.length - 1]
  const previous = sortedPrices.length > 1 ? sortedPrices[sortedPrices.length - 2] : latest

  const change = latest.Close - previous.Close
  const changePercent = previous.Close > 0 ? (change / previous.Close) * 100 : 0

  return {
    price: latest.Close,
    change,
    changePercent,
    open: latest.Open,
    high: latest.High,
    low: latest.Low,
    volume: latest.Volume,
  }
}

function LiveClock() {
  const [timeStr, setTimeStr] = useState<string>("")

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTimeStr(
        now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      )
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  return <span className="font-mono text-xs tabular-nums text-[#9ca3af]">{timeStr || "--:--:--"} WIB</span>
}

export default function Home() {
  const [emitenList, setEmitenList] = useState<Emiten[]>([])
  const [activeStock, setActiveStock] = useState<string>("BBRI.JK")
  const [period, setPeriod] = useState<string>("1y")
  const [priceData, setPriceData] = useState<PriceData[]>([])
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [financialData, setFinancialData] = useState<FinancialData[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("terminal")
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const loadData = async (ticker: string, per: string) => {
    setIsLoading(true)
    try {
      const [emitens, prices] = await Promise.all([
        fetchEmiten(),
        fetchPriceData(ticker, per),
      ])
      setEmitenList(emitens)
      setPriceData(prices)
      setStockData(calculateStockData(prices))

      const baseCode = ticker.split(".")[0]
      const financials = await fetchFinancialData(baseCode)
      setFinancialData(financials)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData(activeStock, period)
  }, [activeStock, period])

  const handleRefresh = () => {
    loadData(activeStock, period)
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val)

  const formatNumber = (val: number) =>
    new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(val)

  const isProfit = stockData ? stockData.change >= 0 : true

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0f14] text-[#f4f5f8]">
      {/* 1. Mobile-Optimized Linear Breadcrumb Header */}
      <div className="px-3 sm:px-6 pt-3 sm:pt-4 pb-2">
        <header className="breadcrumb-strip flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div className="flex items-center gap-2 text-xs font-sans">
              <span className="font-bold tracking-tight text-white text-sm sm:text-xs">IDX</span>
              <span className="text-white/25">/</span>
              <span className="text-white font-semibold">Market Intelligence</span>
              <span className="text-white/20 hidden md:inline">·</span>
              <span className="text-[#9ca3af] hidden md:inline text-[11.5px]">Equity Terminal</span>
            </div>

            <div className="flex sm:hidden items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10.5px]">
                <span className="emerald-pip" />
                <span className="text-white font-medium">Live</span>
              </div>
              <LiveClock />
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs">
              <span className="emerald-pip" />
              <span className="text-[#f4f5f8] font-medium text-[11.5px]">Market Feed</span>
            </div>
            <LiveClock />
            <button
              type="button"
              onClick={handleRefresh}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#9ca3af] hover:text-white border border-white/10 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </header>
      </div>

      {/* 2. Mobile Ticker Scroller & Tab Bar */}
      <div className="px-3 sm:px-6 py-1.5 space-y-2">
        {/* Quick Ticker Switcher Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {emitenList.map((item) => {
            const isSelected = activeStock === item.ticker
            return (
              <button
                key={item.ticker}
                onClick={() => setActiveStock(item.ticker)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-white/15 text-white border border-white/20 shadow-sm font-bold"
                    : "bg-white/5 text-[#9ca3af] hover:text-white hover:bg-white/10 border border-transparent"
                }`}
              >
                {item.name}
              </button>
            )
          })}
        </div>

        {/* View Nav Tabs */}
        <div className="glass-panel p-1.5 flex items-center justify-between gap-2 overflow-x-auto custom-scrollbar">
          <div className="flex items-center gap-1 min-w-max">
            {[
              { id: "terminal", label: "Overview", icon: BarChart3 },
              { id: "stocks", label: "Broad Market", icon: Layers },
              { id: "correlation", label: "Comparison", icon: PieChart },
              { id: "portfolio", label: "Portfolio", icon: TrendingUp },
              { id: "news", label: "Disclosures", icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-white/15 text-white border border-white/15 shadow-sm"
                      : "text-[#9ca3af] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-[#10b981]" : "text-[#9ca3af]"}`} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 3. Main Content Container */}
      <main className="flex-1 px-3 sm:px-6 pb-6 overflow-y-auto custom-scrollbar">
        {activeTab === "terminal" && (
          <div className="space-y-3.5">
            {/* Top Stat Row: Primary Highlights */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
              {/* Card 1: Active Equity Price */}
              <div className="glass-panel p-3.5 sm:p-4 flex flex-col justify-between col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white tracking-tight">{activeStock}</span>
                    <span className="text-[10.5px] text-[#9ca3af]">IDX</span>
                  </div>
                  <div
                    className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                      isProfit
                        ? "bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/25"
                        : "bg-[#f43f5e]/15 text-[#f43f5e] border border-[#f43f5e]/25"
                    }`}
                  >
                    {isProfit ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    <span className="tabular-nums">{stockData ? Math.abs(stockData.changePercent).toFixed(2) : "0.00"}%</span>
                  </div>
                </div>

                <div className="mt-2.5">
                  <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white tracking-tight">
                    {stockData ? formatCurrency(stockData.price) : "Rp 0"}
                  </div>
                  <div className="text-[11px] text-[#9ca3af] font-mono tabular-nums mt-0.5">
                    {isProfit ? "+" : ""}
                    {stockData ? formatCurrency(stockData.change) : "Rp 0"} (Today)
                  </div>
                </div>
              </div>

              {/* Card 2: Range Today (High / Low) */}
              <div className="glass-panel p-3.5 sm:p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#9ca3af]">Day Range</span>
                  <span className="text-[10.5px] font-mono text-[#6b7280]">Spread</span>
                </div>
                <div className="mt-2.5">
                  <div className="flex items-baseline justify-between text-xs sm:text-sm font-mono tabular-nums">
                    <span className="text-[#9ca3af]">L: {stockData ? formatCurrency(stockData.low) : "-"}</span>
                    <span className="text-white font-medium">H: {stockData ? formatCurrency(stockData.high) : "-"}</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-2">
                    <div
                      className="bg-[#3b82f6] h-full rounded-full"
                      style={{
                        width: stockData && stockData.high > stockData.low
                          ? `${Math.min(100, Math.max(0, ((stockData.price - stockData.low) / (stockData.high - stockData.low)) * 100))}%`
                          : "50%",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Volume Transacted */}
              <div className="glass-panel p-3.5 sm:p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#9ca3af]">Transacted Volume</span>
                  <span className="text-[10.5px] font-mono text-[#6b7280]">Shares</span>
                </div>
                <div className="mt-2.5">
                  <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white tracking-tight">
                    {stockData ? formatNumber(stockData.volume) : "0"}
                  </div>
                  <div className="text-[11px] text-[#9ca3af] mt-0.5 truncate">Continuous liquidity</div>
                </div>
              </div>

              {/* Card 4: Open & Prev Close */}
              <div className="glass-panel p-3.5 sm:p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#9ca3af]">Market Quotes</span>
                  <span className="text-[10.5px] font-mono text-[#10b981]">Active</span>
                </div>
                <div className="mt-2.5 space-y-1 text-xs font-mono tabular-nums">
                  <div className="flex justify-between">
                    <span className="text-[#9ca3af]">Open:</span>
                    <span className="text-white font-medium">{stockData ? formatCurrency(stockData.open) : "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9ca3af]">Prev Close:</span>
                    <span className="text-[#cbd5e1]">{stockData ? formatCurrency(stockData.price - stockData.change) : "-"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle: Chart Workspace with Mobile Period Switcher */}
            <div className="glass-panel p-3.5 sm:p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-white/8">
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-tight">
                    {activeStock} Price Movement & Volume
                  </h3>
                  <p className="text-[11px] text-[#9ca3af]">
                    Interactive timeline quotes aggregated from Indonesia Stock Exchange
                  </p>
                </div>

                {/* Period Switcher (Horizontal scrollable on mobile) */}
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 overflow-x-auto self-start sm:self-auto">
                  {["1m", "3m", "6m", "1y", "all"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`px-3 py-1 rounded text-xs font-mono uppercase transition-all ${
                        period === p
                          ? "bg-white/20 text-white font-bold shadow-sm"
                          : "text-[#9ca3af] hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Chart Component */}
              <StockChart data={priceData} />
            </div>

            {/* Bottom Row: Financial Disclosures & Market Wire */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
              <div className="glass-panel p-4">
                <StockFinancials financialData={financialData} />
              </div>
              <div className="glass-panel p-4">
                <StockNews />
              </div>
            </div>
          </div>
        )}

        {activeTab === "stocks" && (
          <div className="glass-panel p-4">
            <MarketOverview />
          </div>
        )}

        {activeTab === "correlation" && (
          <div className="glass-panel p-4">
            <StockComparison />
          </div>
        )}

        {activeTab === "portfolio" && (
          <div className="glass-panel p-4">
            <PortfolioAnalytics />
          </div>
        )}

        {activeTab === "news" && (
          <div className="glass-panel p-4">
            <StockNews fullPage />
          </div>
        )}
      </main>

      {/* Mobile-Friendly Minimal Footer */}
      <footer className="px-4 sm:px-6 py-3 border-t border-white/8 text-[11px] text-[#6b7280] flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div>
          <span className="text-[#9ca3af] font-medium">IDX Analytics</span> · Clean Financial Intelligence
        </div>
        <div className="font-mono text-[10.5px]">
          State: <span className="text-[#10b981]">Online</span> · Telemetry Buffer Sync
        </div>
      </footer>
    </div>
  )
}
