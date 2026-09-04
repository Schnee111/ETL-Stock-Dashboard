"use client"

import { useState, useEffect } from "react"
import {
  ArrowDown,
  ArrowUp,
  Activity,
  Terminal,
  Clock,
  RefreshCw,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Wifi,
  BarChart3,
  Layers,
  Database,
  ExternalLink,
} from "lucide-react"

import StockChart from "@/components/stock-chart"
import MarketOverview from "@/components/market-overview"
import StockNews from "@/components/stock-news"
import StockTicker from "@/components/stock-ticker"
import StockComparison from "@/components/stock-comparison"
import PortfolioAnalytics from "@/components/portfolio-analytics"
import { StockFinancials } from "@/components/stock-finance"
import { FinancialChartCard } from "@/components/financial-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
    return []
  }
}

function calculateStockData(prices: PriceData[]): StockData | null {
  if (prices.length < 1) return null
  const latest = prices[prices.length - 1]
  const previous = prices.length > 1 ? prices[prices.length - 2] : null

  const price = latest.Close
  const change = previous ? price - previous.Close : 0
  const changePercent = previous && previous.Close ? (change / previous.Close) * 100 : 0

  return {
    price,
    change,
    changePercent,
    open: latest.Open,
    high: latest.High,
    low: latest.Low,
    volume: latest.Volume,
  }
}

function LiveClock() {
  const [time, setTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      // format to WIB (UTC+7)
      const formatted = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(now)
      setTime(`${formatted} WIB`)
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center gap-1.5 font-mono text-xs text-[#94A3B8] tabular-nums">
      <Clock className="h-3.5 w-3.5 text-[#10B981]" />
      <span>{time || "SYNCING..."}</span>
    </div>
  )
}

export default function TerminalDashboard() {
  const [initialEmiten, setInitialEmiten] = useState<Emiten[]>([])
  const [activeStock, setActiveStock] = useState("BBRI.JK")
  const [priceData, setPriceData] = useState<PriceData[]>([])
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [financialData, setFinancialData] = useState<FinancialData[]>([])
  const [period, setPeriod] = useState<"daily" | "monthly" | "yearly">("yearly")
  const [activeTab, setActiveTab] = useState("terminal")
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())

  useEffect(() => {
    async function loadInitialEmiten() {
      setIsLoading(true)
      const emitens = await fetchEmiten()
      setInitialEmiten(emitens)
      setActiveStock(emitens[0]?.ticker || "BBRI.JK")
      setIsLoading(false)
    }
    loadInitialEmiten()
  }, [])

  useEffect(() => {
    async function loadPriceData() {
      if (!activeStock) return
      setIsLoading(true)
      const data = await fetchPriceData(activeStock, period)
      setPriceData(data)
      setStockData(calculateStockData(data))
      setIsLoading(false)
    }
    loadPriceData()
  }, [activeStock, period, lastRefreshed])

  useEffect(() => {
    async function loadFinancialData() {
      if (!activeStock) return
      const entityCode = activeStock.split(".")[0]
      const data = await fetchFinancialData(entityCode)
      setFinancialData(data || [])
    }
    loadFinancialData()
  }, [activeStock, lastRefreshed])

  const filteredEmiten = initialEmiten.filter(
    (emiten) =>
      emiten.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emiten.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleRefresh = () => {
    setLastRefreshed(new Date())
  }

  const formatCurrency = (value: number) => `Rp ${value.toLocaleString("id-ID")}`
  const formatPercentage = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
  const formatVolume = (value: number) => {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(2)}B`
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    return value.toLocaleString("id-ID")
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#090A0F] text-[#E2E8F0] selection:bg-[#10B981]/30">
      {/* 1. Terminal Top Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between h-12 bg-[#090A0F] border-b border-[#1E2638] px-4 font-mono select-none">
        {/* Left: Terminal Identity & System Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 pr-3 border-r border-[#1E2638]">
            <Terminal className="h-4 w-4 text-[#10B981]" />
            <span className="font-bold text-sm tracking-widest text-white">IDX//TERMINAL</span>
            <span className="text-[10px] bg-[#161B26] text-[#10B981] px-1.5 py-0.5 rounded border border-[#1E2638] font-mono">
              v2.4-PRO
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-[11px]">
            <div className="flex items-center gap-1.5 text-[#10B981]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span>IDX: CONNECTED</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#94A3B8]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]" />
              <span>AIRFLOW: NOMINAL</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#94A3B8]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
              <span>LATENCY: 18ms</span>
            </div>
          </div>
        </div>

        {/* Middle: Stock Ticker Tape */}
        <StockTicker />

        {/* Right: Live Clock & Action */}
        <div className="flex items-center gap-3 pl-3">
          <LiveClock />
          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono bg-[#161B26] hover:bg-[#1E2638] text-[#10B981] border border-[#1E2638] rounded transition-colors"
            title="Refresh Data Feeds"
          >
            <RefreshCw className="h-3 w-3" />
            <span className="hidden sm:inline">REFRESH</span>
          </button>
        </div>
      </header>

      {/* 2. Sub Navigation Bar */}
      <div className="bg-[#0F121A] border-b border-[#1E2638] px-4 py-1.5 flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-1">
          {[
            { id: "terminal", label: "MARKET TERMINAL" },
            { id: "stocks", label: "ALL EQUITIES" },
            { id: "correlation", label: "CORRELATION" },
            { id: "portfolio", label: "PORTFOLIO NAV" },
            { id: "news", label: "FINANCIAL WIRE" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#161B26] text-[#10B981] font-bold border border-[#1E2638] shadow-sm"
                  : "text-[#64748B] hover:text-[#94A3B8]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quick Search in Subnav */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-[#64748B]" />
            <input
              type="text"
              placeholder="QUICK TICKER SEARCH..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-7 w-48 pl-8 pr-2 text-xs font-mono bg-[#090A0F] border border-[#1E2638] rounded text-[#E2E8F0] placeholder-[#64748B] focus:outline-none focus:border-[#10B981]"
            />
          </div>
        </div>
      </div>

      {/* 3. Main Workspace Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side: Emiten Directory & Watchlist */}
        <aside className="w-64 border-r border-[#1E2638] bg-[#090A0F] flex flex-col shrink-0 hidden md:flex">
          <div className="p-3 border-b border-[#1E2638]">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] uppercase tracking-wider mb-2">
              <span>WATCHLIST DIRECTORY</span>
              <span className="text-[#10B981]">{filteredEmiten.length} SYMBOLS</span>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-[#64748B]" />
              <input
                type="text"
                placeholder="Filter watchlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-7 pl-8 pr-2 text-xs font-mono bg-[#0F121A] border border-[#1E2638] rounded text-[#E2E8F0] placeholder-[#64748B] focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#1E2638]/60">
            {filteredEmiten.map((emiten) => {
              const isSelected = activeStock === emiten.ticker
              return (
                <button
                  key={emiten.ticker}
                  type="button"
                  onClick={() => setActiveStock(emiten.ticker)}
                  className={`w-full text-left p-2.5 flex items-center justify-between transition-colors font-mono ${
                    isSelected
                      ? "bg-[#161B26] border-l-2 border-l-[#10B981] text-white"
                      : "hover:bg-[#0F121A] text-[#94A3B8]"
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      <span className={isSelected ? "text-[#10B981]" : "text-white"}>
                        {emiten.ticker}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#64748B] truncate max-w-[130px]">
                      {emiten.name}
                    </div>
                  </div>

                  {isSelected && stockData && (
                    <div className="text-right">
                      <div className="text-xs font-semibold tabular-nums text-white">
                        {formatCurrency(stockData.price)}
                      </div>
                      <div
                        className={`text-[10px] font-bold tabular-nums flex items-center justify-end ${
                          stockData.changePercent >= 0 ? "text-[#10B981]" : "text-[#EF4444]"
                        }`}
                      >
                        {stockData.changePercent >= 0 ? (
                          <ArrowUp className="h-2.5 w-2.5 mr-0.5" />
                        ) : (
                          <ArrowDown className="h-2.5 w-2.5 mr-0.5" />
                        )}
                        {formatPercentage(stockData.changePercent)}
                      </div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          <div className="p-2 border-t border-[#1E2638] bg-[#0F121A] text-[10px] font-mono text-[#64748B] flex items-center justify-between">
            <span>FEED: QUOTE_STREAM</span>
            <span className="text-[#10B981]">OK</span>
          </div>
        </aside>

        {/* Center/Right Main Panel */}
        <main className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#090A0F]">
          {/* TAB 1: Main Terminal Overview */}
          {activeTab === "terminal" && (
            <>
              {/* High-density Market Overview (Indices, Sectors, FX) */}
              <MarketOverview />

              {/* Main Active Emiten Chart Panel & Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                {/* Left 8-col: Interactive Stock Chart */}
                <div className="lg:col-span-8 bg-[#0F121A] border border-[#1E2638] hover:border-[#2E3A54] rounded p-3 transition-colors flex flex-col">
                  {/* Emiten Header Strip */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E2638]">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 px-2 py-1 rounded font-mono font-bold text-sm">
                        {activeStock}
                      </div>
                      <div>
                        <div className="text-xs font-mono text-[#64748B]">INDONESIA STOCK EXCHANGE</div>
                        <div className="text-sm font-bold text-white font-mono">
                          {initialEmiten.find((e) => e.ticker === activeStock)?.name || activeStock.split(".")[0]}
                        </div>
                      </div>
                    </div>

                    {/* Big Price Display */}
                    {stockData ? (
                      <div className="flex items-baseline gap-2 font-mono">
                        <span className="text-2xl font-bold text-white tabular-nums">
                          {formatCurrency(stockData.price)}
                        </span>
                        <div
                          className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded border ${
                            stockData.change >= 0
                              ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30"
                              : "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30"
                          }`}
                        >
                          {stockData.change >= 0 ? (
                            <ArrowUp className="h-3 w-3 mr-0.5" />
                          ) : (
                            <ArrowDown className="h-3 w-3 mr-0.5" />
                          )}
                          <span>
                            {stockData.change >= 0 ? "+" : ""}
                            {formatCurrency(stockData.change)} ({formatPercentage(stockData.changePercent)})
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs font-mono text-[#64748B] animate-pulse">STREAMING PRICE...</div>
                    )}

                    {/* Period selection */}
                    <div className="flex items-center gap-1 bg-[#090A0F] p-0.5 rounded border border-[#1E2638]">
                      {(["daily", "monthly", "yearly"] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPeriod(p)}
                          className={`px-2 py-0.5 text-[11px] font-mono uppercase rounded ${
                            period === p
                              ? "bg-[#161B26] text-[#10B981] font-bold border border-[#1E2638]"
                              : "text-[#64748B] hover:text-[#94A3B8]"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stock Chart Component */}
                  <div className="pt-2 flex-1">
                    <StockChart data={priceData} />
                  </div>
                </div>

                {/* Right 4-col: Emiten Metrics & Trading Stats */}
                <div className="lg:col-span-4 bg-[#0F121A] border border-[#1E2638] hover:border-[#2E3A54] rounded p-3 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-[#1E2638]">
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#E2E8F0]">
                        MARKET METRICS
                      </span>
                      <span className="font-mono text-[10px] text-[#64748B]">SESSION SUMMARY</span>
                    </div>

                    {stockData ? (
                      <div className="divide-y divide-[#1E2638]/70 text-xs font-mono mt-2">
                        <div className="flex justify-between py-2">
                          <span className="text-[#64748B]">OPENING PRICE</span>
                          <span className="text-white tabular-nums font-medium">{formatCurrency(stockData.open)}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-[#64748B]">SESSION HIGH</span>
                          <span className="text-[#10B981] tabular-nums font-medium">
                            {formatCurrency(stockData.high)}
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-[#64748B]">SESSION LOW</span>
                          <span className="text-[#EF4444] tabular-nums font-medium">
                            {formatCurrency(stockData.low)}
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-[#64748B]">PREVIOUS CLOSE</span>
                          <span className="text-white tabular-nums font-medium">
                            {formatCurrency(stockData.price - stockData.change)}
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-[#64748B]">ACCUMULATED VOLUME</span>
                          <span className="text-white tabular-nums font-bold">
                            {formatVolume(stockData.volume)} LOTS
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-[#64748B]">SPREAD HIGH/LOW</span>
                          <span className="text-[#06B6D4] tabular-nums font-medium">
                            {formatCurrency(stockData.high - stockData.low)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-8 text-center text-xs font-mono text-[#64748B]">
                        INITIALIZING EMITEN DATA...
                      </div>
                    )}
                  </div>

                  {/* Terminal Action Buttons */}
                  <div className="pt-3 border-t border-[#1E2638] mt-4 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        className="py-1.5 font-mono text-xs font-bold text-[#10B981] bg-[#10B981]/15 hover:bg-[#10B981]/25 border border-[#10B981]/40 rounded transition-colors"
                      >
                        ORDER BUY
                      </button>
                      <button
                        type="button"
                        className="py-1.5 font-mono text-xs font-bold text-[#EF4444] bg-[#EF4444]/15 hover:bg-[#EF4444]/25 border border-[#EF4444]/40 rounded transition-colors"
                      >
                        ORDER SELL
                      </button>
                    </div>
                    <div className="text-[10px] font-mono text-center text-[#64748B]">
                      EXECUTION ROUTED VIA DIRECT IDX FIX GATEWAY
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Health Indicators & Fundamental Performance */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                <div className="lg:col-span-5">
                  <StockFinancials financialData={financialData} />
                </div>
                <div className="lg:col-span-7">
                  <FinancialChartCard financialData={financialData} />
                </div>
              </div>

              {/* Compact Financial News Stream */}
              <StockNews fullPage={false} />
            </>
          )}

          {/* TAB 2: All Equities Grid */}
          {activeTab === "stocks" && (
            <div className="bg-[#0F121A] border border-[#1E2638] rounded overflow-hidden">
              <div className="p-3 border-b border-[#1E2638] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#10B981]" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#E2E8F0]">
                    COMPREHENSIVE IDX EQUITY MATRIX
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#64748B]">{filteredEmiten.length} LISTED ASSETS</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#1E2638] text-[#64748B] text-left">
                      <th className="p-3 uppercase">TICKER</th>
                      <th className="p-3 uppercase">COMPANY NAME</th>
                      <th className="p-3 uppercase">MARKET</th>
                      <th className="p-3 text-right uppercase">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E2638]/50">
                    {filteredEmiten.map((emiten) => (
                      <tr
                        key={emiten.ticker}
                        className="hover:bg-[#161B26]/60 transition-colors cursor-pointer"
                        onClick={() => {
                          setActiveStock(emiten.ticker)
                          setActiveTab("terminal")
                        }}
                      >
                        <td className="p-3 font-bold text-[#10B981]">{emiten.ticker}</td>
                        <td className="p-3 text-[#E2E8F0]">{emiten.name}</td>
                        <td className="p-3 text-[#64748B]">IDX MAIN BOARD</td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            className="text-[11px] font-mono text-[#10B981] hover:underline"
                          >
                            OPEN TERMINAL &rarr;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Multi-Emiten Correlation */}
          {activeTab === "correlation" && <StockComparison />}

          {/* TAB 4: Portfolio NAV */}
          {activeTab === "portfolio" && <PortfolioAnalytics />}

          {/* TAB 5: Full News Wire */}
          {activeTab === "news" && <StockNews fullPage={true} />}
        </main>
      </div>

      {/* 4. Terminal Status Bar Footer */}
      <footer className="h-7 bg-[#090A0F] border-t border-[#1E2638] px-4 flex items-center justify-between text-[11px] font-mono text-[#64748B] select-none">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-[#10B981]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
            DATA ENGINE: ACTIVE
          </span>
          <span className="hidden sm:inline">ETL PIPELINE: HOURLY SYNC</span>
          <span className="hidden md:inline">POSTGRES + DUCKDB STORAGE</span>
        </div>

        <div className="flex items-center gap-3">
          <span>SOURCE: IDX / YAHOO FINANCE</span>
          <span className="text-[#E2E8F0]">TERMINAL MODE</span>
        </div>
      </footer>
    </div>
  )
}
