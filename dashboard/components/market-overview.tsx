"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUp, ArrowDown } from "lucide-react"

interface MarketData {
  name: string
  value: number
  changePercent: number
  spark?: number[]
}

async function fetchMarketData(type: string): Promise<MarketData[]> {
  try {
    const apiUrl = `http://localhost:5000/api/harga?type=${type}`
    const res = await fetch(apiUrl, { cache: "no-store" })
    if (!res.ok) {
      throw new Error(`Failed to fetch ${type} data: ${res.status}`)
    }
    return await res.json()
  } catch {
    switch (type) {
      case "indices":
        return [
          { name: "IHSG Composite", value: 7234.56, changePercent: 1.2, spark: [7180, 7195, 7210, 7205, 7234] },
          { name: "LQ45 Blue Chip", value: 982.45, changePercent: 0.8, spark: [975, 978, 980, 979, 982] },
          { name: "JII Islamic", value: 567.23, changePercent: -0.3, spark: [572, 570, 569, 568, 567] },
          { name: "IDX80 Large", value: 234.56, changePercent: 0.5, spark: [232, 233, 233, 234, 234.5] },
          { name: "IDX30 Top Tier", value: 567.89, changePercent: -0.3, spark: [570, 569, 568, 568, 567.8] },
          { name: "IDXBUMN20 State", value: 432.15, changePercent: 1.5, spark: [425, 427, 429, 430, 432] },
        ]
      case "sectors":
        return [
          { name: "Financials", value: 1234.56, changePercent: 2.1, spark: [1210, 1220, 1225, 1234] },
          { name: "Technology", value: 876.54, changePercent: 3.2, spark: [850, 860, 868, 876] },
          { name: "Consumer Non-Cyclical", value: 876.54, changePercent: 0.9, spark: [870, 872, 874, 876] },
          { name: "Infrastructure", value: 765.43, changePercent: 1.7, spark: [750, 755, 760, 765] },
          { name: "Healthcare", value: 654.32, changePercent: 1.5, spark: [645, 648, 650, 654] },
          { name: "Energy & Mining", value: 543.21, changePercent: -0.8, spark: [548, 546, 545, 543] },
        ]
      case "commodities":
        return [
          { name: "Crude Oil (Brent)", value: 75.43, changePercent: 2.3, spark: [73.5, 74.0, 74.8, 75.43] },
          { name: "Gold (USD/oz)", value: 1876.54, changePercent: 0.5, spark: [1868, 1870, 1872, 1876] },
          { name: "Crude Palm Oil (CPO)", value: 11450, changePercent: -0.7, spark: [11550, 11500, 11480, 11450] },
          { name: "Thermal Coal (Newcastle)", value: 98.75, changePercent: 1.2, spark: [97, 97.5, 98.1, 98.75] },
        ]
      case "forex":
        return [
          { name: "USD / IDR", value: 15432, changePercent: -0.3, spark: [15480, 15460, 15450, 15432] },
          { name: "EUR / IDR", value: 16789, changePercent: 0.2, spark: [16750, 16770, 16780, 16789] },
          { name: "SGD / IDR", value: 11432, changePercent: 0.1, spark: [11420, 11425, 11430, 11432] },
          { name: "JPY / IDR", value: 107.65, changePercent: -0.5, spark: [108.2, 108.0, 107.8, 107.65] },
        ]
      default:
        return []
    }
  }
}

function MiniSparkline({ data, isUp }: { data?: number[]; isUp: boolean }) {
  if (!data || data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const width = 48
  const height = 16

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width
      const y = height - ((val - min) / range) * (height - 4) - 2
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")

  return (
    <svg width={width} height={height} className="overflow-visible shrink-0">
      <polyline
        fill="none"
        stroke={isUp ? "#10b981" : "#f43f5e"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  )
}

export default function MarketOverview() {
  const [indicesData, setIndicesData] = useState<MarketData[]>([])
  const [sectorsData, setSectorsData] = useState<MarketData[]>([])
  const [commoditiesData, setCommoditiesData] = useState<MarketData[]>([])
  const [forexData, setForexData] = useState<MarketData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadAll() {
      setIsLoading(true)
      try {
        const [ind, sec, com, fx] = await Promise.all([
          fetchMarketData("indices"),
          fetchMarketData("sectors"),
          fetchMarketData("commodities"),
          fetchMarketData("forex"),
        ])
        setIndicesData(ind)
        setSectorsData(sec)
        setCommoditiesData(com)
        setForexData(fx)
      } finally {
        setIsLoading(false)
      }
    }
    loadAll()
  }, [])

  const renderGrid = (items: MarketData[]) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => {
          const isUp = item.changePercent >= 0
          return (
            <div
              key={item.name}
              className="glass-panel p-3.5 rounded-xl flex items-center justify-between transition-all hover:border-white/20"
            >
              <div className="min-w-0 pr-2">
                <span className="text-xs font-semibold text-white tracking-tight block truncate">
                  {item.name}
                </span>
                <span className="text-sm font-bold font-mono tabular-nums text-white mt-0.5 block">
                  {item.value.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <MiniSparkline data={item.spark} isUp={isUp} />
                <div
                  className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                    isUp
                      ? "bg-[#10b981]/15 text-[#10b981]"
                      : "bg-[#f43f5e]/15 text-[#f43f5e]"
                  }`}
                >
                  {isUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  <span className="tabular-nums">{Math.abs(item.changePercent).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/8">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-tight">Broad Market Overview</h2>
          <p className="text-[11px] text-[#9ca3af]">IDX indices, sector performances, and global macroeconomic indicators</p>
        </div>
      </div>

      <Tabs defaultValue="indices" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl h-auto mb-4 flex flex-wrap gap-1">
          <TabsTrigger
            value="indices"
            className="text-xs font-medium px-3 py-1.5 rounded-lg data-[state=active]:bg-white/15 data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            Major Indices
          </TabsTrigger>
          <TabsTrigger
            value="sectors"
            className="text-xs font-medium px-3 py-1.5 rounded-lg data-[state=active]:bg-white/15 data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            Sectors
          </TabsTrigger>
          <TabsTrigger
            value="commodities"
            className="text-xs font-medium px-3 py-1.5 rounded-lg data-[state=active]:bg-white/15 data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            Commodities
          </TabsTrigger>
          <TabsTrigger
            value="forex"
            className="text-xs font-medium px-3 py-1.5 rounded-lg data-[state=active]:bg-white/15 data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            Forex / Currency
          </TabsTrigger>
        </TabsList>

        <TabsContent value="indices" className="mt-0">{renderGrid(indicesData)}</TabsContent>
        <TabsContent value="sectors" className="mt-0">{renderGrid(sectorsData)}</TabsContent>
        <TabsContent value="commodities" className="mt-0">{renderGrid(commoditiesData)}</TabsContent>
        <TabsContent value="forex" className="mt-0">{renderGrid(forexData)}</TabsContent>
      </Tabs>
    </div>
  )
}
