"use client"

import { useState, useEffect } from "react"
import {
  ArrowDown,
  ArrowUp,
  Search,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  BarChart3,
  Layers,
  FileText,
  PieChart,
  ExternalLink,
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

async function fetchPriceData(emiten: string, period: string): Promise<PriceData[]> {
  try {
    const apiUrl = `http://localhost:5000/api/harga?emiten=${emiten}&period=${period}`
    const res = await fetch(apiUrl, { cache: "no-store" })
    if (!res.ok) throw new Error("Failed to fetch price data")
    return await res.json()
  } catch {
    return []
  }
}

async function fetchFinancialData(entityCode: string): Promise<FinancialData[]> {
  try {
    const apiUrl = `http://localhost:5000/api/idx/finance?entity_code=${entityCode}`
    const res = await fetch(apiUrl)
    if (!res.ok) throw new Error("Failed to fetch financial data")
    const data = await res.json()
    if (!Array.isArray(data)) return []
    return data as FinancialData[]
  } catch {
    return []
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
    } catch {
      // Graceful fallback
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

  const filteredEmiten = emitenList.filter((e) =>
    e.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const isProfit = stockData ? stockData.change >= 0 : true

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0f14] text-[#f4f5f8] select-none">
      {/* 1. Header: AETER Breadcrumb Strip */}
      <div className="px-4 lg:px-6 pt-4 pb-2">
        <header className="breadcrumb-strip">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="font-bold tracking-tight text-white">IDX</span>
            <span className="text-white/20">/</span>
            <span className="text-[#f4f5f8] font-semibold">Market Intelligence</span>
            <span className="text-white/20 hidden sm:inline">·</span>
            <span className="text-[#9ca3af] hidden sm:inline">Equity Analytics</span>
            <span className="text-white/20 hidden md:inline">·</span>
            <span className="text-[#6b7280] hidden md:inline">Indonesia Stock Exchange</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs">
              <span className="emerald-pip" />
              <span className="text-[#f4f5f8] font-medium text-[11.5px]">Live Feed</span>
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

      {/* 2. Sub Navigation & Filter Bar */}
      <div className="px-4 lg:px-6 py-2">
        <div className="glass-panel p-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
            {[
              { id: "terminal", label: "Market Overview", icon: BarChart3 },
              { id: "stocks", label: "Equities Directory", icon: Layers },
              { id: "correlation", label: "Cross-Comparison", icon: PieChart },
              { id: "portfolio", label: "Portfolio Analytics", icon: TrendingUp },
              { id: "news", label: "Financial Wire", icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-white/10 text-white border border-white/15 shadow-sm"
                      : "text-[#9ca3af] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-[#10b981]" : "text-[#9ca3af]"}`} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#6b7280]" />
              <input
                type="text"
                placeholder="Search symbol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-full pl-8 pr-3 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder-[#6b7280] focus:outline-none focus:border-white/20 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Content Container */}
      <main className="flex-1 px-4 lg:px-6 pb-6 overflow-y-auto custom-scrollbar">
        {activeTab === "terminal" && (
          <div className="space-y-4">
            {/* Top Stat Row: Active Emiten Highlight */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
              {/* Card 1: Active Equity Price */}
              <div className="glass-panel p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white tracking-tight">{activeStock}</span>
                    <span className="text-[11px] text-[#9ca3af]">IDX Equity</span>
                  </div>
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                      isProfit
                        ? "bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/25"
                        : "bg-[#f43f5e]/15 text-[#f43f5e] border border-[#f43f5e]/25"
                    }`}
                  >
                    {isProfit ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    <span className="tabular-nums">{stockData ? Math.abs(stockData.changePercent).toFixed(2) : "0.00"}%</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-2xl font-bold font-mono tabular-nums text-white tracking-tight">
                    {stockData ? formatCurrency(stockData.price) : "Rp 0"}
                  </div>
                  <div className="text-[11px] text-[#9ca3af] font-mono tabular-nums mt-0.5">
                    {isProfit ? "+" : ""}
                    {stockData ? formatCurrency(stockData.change) : "Rp 0"} today
                  </div>
                </div>
              </div>

              {/* Card 2: Range Today (High / Low) */}
              <div className="glass-panel p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#9ca3af]">Day Range (L / H)</span>
                  <span className="text-[11px] font-mono text-[#6b7280]">Spread</span>
                </div>
                <div className="mt-3">
                  <div className="flex items-baseline justify-between text-sm font-mono tabular-nums">
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

              {/* Card 3: Volume Ingestion */}
              <div className="glass-panel p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#9ca3af]">Volume Transacted</span>
                  <span className="text-[11px] font-mono text-[#6b7280]">Shares</span>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-bold font-mono tabular-nums text-white tracking-tight">
                    {stockData ? formatNumber(stockData.volume) : "0"}
                  </div>
                  <div className="text-[11px] text-[#9ca3af] mt-0.5">Continuous market volume</div>
                </div>
              </div>

              {/* Card 4: Quick Symbol Switcher */}
              <div className="glass-panel p-3 flex flex-col justify-between">
                <span className="text-xs font-medium text-[#9ca3af] mb-1.5">Quick Watchlist</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {emitenList.slice(0, 6).map((item) => (
                    <button
                      key={item.ticker}
                      onClick={() => setActiveStock(item.ticker)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                        activeStock === item.ticker
                          ? "bg-white/15 text-white border border-white/20 shadow-sm"
                          : "bg-white/5 text-[#9ca3af] hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle: Chart Workspace & Emiten Selector */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3 glass-panel p-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/8">
                  <div>
                    <h3 className="text-sm font-semibold text-white tracking-tight">
                      Price Movement & Volume Telemetry
                    </h3>
                    <p className="text-[11px] text-[#9ca3af]">
                      Historical market quotes aggregated via Big Data Pipeline
                    </p>
                  </div>

                  {/* Period Switcher */}
                  <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 self-start sm:self-auto">
                    {["1m", "3m", "6m", "1y", "all"].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={`px-2.5 py-1 rounded text-xs font-mono uppercase transition-all ${
                          period === p
                            ? "bg-white/15 text-white font-bold shadow-sm"
                            : "text-[#9ca3af] hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stock Chart Component */}
                <div className="min-h-[380px]">
                  <StockChart data={priceData} />
                </div>
              </div>

              {/* Right Column: Key Financial Metrics & Ratios */}
              <div className="lg:col-span-1 glass-panel p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-white tracking-tight pb-2 border-b border-white/8">
                    Financial Valuation
                  </h3>
                  <div className="divide-y divide-white/5 text-xs font-mono">
                    <div className="py-2.5 flex justify-between">
                      <span className="text-[#9ca3af]">Open</span>
                      <span className="text-white tabular-nums">{stockData ? formatCurrency(stockData.open) : "-"}</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-[#9ca3af]">Prev Close</span>
                      <span className="text-white tabular-nums">
                        {stockData ? formatCurrency(stockData.price - stockData.change) : "-"}
                      </span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-[#9ca3af]">High</span>
                      <span className="text-white tabular-nums">{stockData ? formatCurrency(stockData.high) : "-"}</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-[#9ca3af]">Low</span>
                      <span className="text-white tabular-nums">{stockData ? formatCurrency(stockData.low) : "-"}</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-[#9ca3af]">Exchange</span>
                      <span className="text-[#10b981]">IDX (Indonesia)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/8">
                  <span className="text-[11px] text-[#6b7280]">Data updated daily from official IDX ingestion</span>
                </div>
              </div>
            </div>

            {/* Bottom Row: Financial Statements & Market Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="glass-panel p-4">
                <StockFinancials financialData={financialData} />
              </div>
              <div className="glass-panel p-4">
                <FinancialChartCard financialData={financialData} />
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
            <StockNews />
          </div>
        )}
      </main>

      {/* Footer Minimal Row */}
      <footer className="px-6 py-3 border-t border-white/8 text-[11px] text-[#6b7280] flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          <span className="text-[#9ca3af] font-medium">IDX Analytics Intelligence</span> · Clean Financial Materiality
        </div>
        <div className="font-mono text-[10.5px]">
          Pipeline Status: <span className="text-[#10b981]">Active</span> · Updated Automatically
        </div>
      </footer>
    </div>
  )
}
