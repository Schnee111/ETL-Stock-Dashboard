"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUp, ArrowDown, Activity } from "lucide-react"

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
      throw new Error(`Failed to fetch ${type} data: ${res.status} ${res.statusText}`)
    }
    return await res.json()
  } catch (error) {
    switch (type) {
      case "indices":
        return [
          { name: "IHSG", value: 7234.56, changePercent: 1.2, spark: [7180, 7195, 7210, 7205, 7234] },
          { name: "LQ45", value: 982.45, changePercent: 0.8, spark: [975, 978, 980, 979, 982] },
          { name: "JII", value: 567.23, changePercent: -0.3, spark: [572, 570, 569, 568, 567] },
          { name: "IDX80", value: 234.56, changePercent: 0.5, spark: [232, 233, 233, 234, 234.5] },
          { name: "IDX30", value: 567.89, changePercent: -0.3, spark: [570, 569, 568, 568, 567.8] },
          { name: "IDXBUMN20", value: 432.15, changePercent: 1.5, spark: [425, 427, 429, 430, 432] },
          { name: "IDXSMC-LIQ", value: 345.67, changePercent: 0.2, spark: [344, 344.5, 345, 345.2, 345.6] },
          { name: "IDXESGL", value: 287.65, changePercent: -0.7, spark: [290, 289, 288.5, 288, 287.6] },
        ]
      case "sectors":
        return [
          { name: "Keuangan", value: 1234.56, changePercent: 2.1, spark: [1210, 1220, 1225, 1234] },
          { name: "Teknologi", value: 876.54, changePercent: 3.2, spark: [850, 860, 868, 876] },
          { name: "Konsumer", value: 876.54, changePercent: 0.9, spark: [870, 872, 874, 876] },
          { name: "Infrastruktur", value: 765.43, changePercent: 1.7, spark: [750, 755, 760, 765] },
          { name: "Kesehatan", value: 654.32, changePercent: 1.5, spark: [645, 648, 650, 654] },
          { name: "Pertanian", value: 321.98, changePercent: 0.4, spark: [320, 321, 321.5, 322] },
          { name: "Pertambangan", value: 543.21, changePercent: -0.8, spark: [548, 546, 545, 543] },
          { name: "Properti", value: 432.12, changePercent: -1.2, spark: [438, 436, 434, 432] },
        ]
      case "commodities":
        return [
          { name: "Minyak Mentah", value: 75.43, changePercent: 2.3, spark: [73.5, 74.0, 74.8, 75.43] },
          { name: "Emas (USD)", value: 1876.54, changePercent: 0.5, spark: [1868, 1870, 1872, 1876] },
          { name: "CPO", value: 11450, changePercent: -0.7, spark: [11550, 11500, 11480, 11450] },
          { name: "Batubara", value: 98.75, changePercent: 1.2, spark: [97, 97.5, 98.1, 98.75] },
        ]
      case "forex":
        return [
          { name: "USD/IDR", value: 15432, changePercent: -0.3, spark: [15480, 15460, 15450, 15432] },
          { name: "EUR/IDR", value: 16789, changePercent: 0.2, spark: [16750, 16770, 16780, 16789] },
          { name: "SGD/IDR", value: 11432, changePercent: 0.1, spark: [11420, 11425, 11430, 11432] },
          { name: "JPY/IDR", value: 107.65, changePercent: -0.5, spark: [108.2, 108.0, 107.8, 107.65] },
        ]
      default:
        return []
    }
  }
}

// Micro Sparkline SVG Component
function Sparkline({ data, isUp }: { data?: number[]; isUp: boolean }) {
  if (!data || data.length < 2) {
    return null
  }
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const width = 54
  const height = 18

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
        stroke={isUp ? "#10B981" : "#EF4444"}
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
    async function loadMarketData() {
      setIsLoading(true)
      const [indices, sectors, commodities, forex] = await Promise.all([
        fetchMarketData("indices"),
        fetchMarketData("sectors"),
        fetchMarketData("commodities"),
        fetchMarketData("forex"),
      ])
      setIndicesData(indices)
      setSectorsData(sectors)
      setCommoditiesData(commodities)
      setForexData(forex)
      setIsLoading(false)
    }
    loadMarketData()
  }, [])

  const renderMarketGrid = (items: MarketData[], isCommodityOrForex = false) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-[#0F121A] border border-[#1E2638] rounded animate-pulse" />
          ))}
        </div>
      )
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {items.map((item) => {
          const isUp = item.changePercent >= 0
          return (
            <div
              key={item.name}
              className="bg-[#0F121A] border border-[#1E2638] hover:border-[#2E3A54] rounded p-2.5 flex items-center justify-between transition-colors group"
            >
              <div className="min-w-0 pr-2">
                <div className="text-[11px] font-mono text-[#94A3B8] truncate uppercase tracking-tight">
                  {item.name}
                </div>
                <div className="text-sm font-mono font-bold text-white tabular-nums tracking-tight mt-0.5">
                  {isCommodityOrForex && item.value > 1000
                    ? `Rp ${item.value.toLocaleString("id-ID")}`
                    : item.value.toLocaleString("id-ID", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                </div>
                <div
                  className={`flex items-center text-[11px] font-mono font-medium mt-0.5 ${
                    isUp ? "text-[#10B981]" : "text-[#EF4444]"
                  }`}
                >
                  {isUp ? <ArrowUp className="h-3 w-3 mr-0.5 shrink-0" /> : <ArrowDown className="h-3 w-3 mr-0.5 shrink-0" />}
                  <span>
                    {isUp ? "+" : ""}
                    {item.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>

              <Sparkline data={item.spark} isUp={isUp} />
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="bg-[#0F121A] border border-[#1E2638] rounded p-3">
      <Tabs defaultValue="indices" className="w-full">
        <div className="flex items-center justify-between border-b border-[#1E2638] pb-2 mb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-[#10B981]" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#E2E8F0]">
              MARKET OVERVIEW & BENCHMARKS
            </span>
          </div>

          <TabsList className="bg-[#090A0F] border border-[#1E2638] h-7 p-0.5">
            <TabsTrigger
              value="indices"
              className="text-[11px] font-mono h-6 px-2.5 data-[state=active]:bg-[#161B26] data-[state=active]:text-[#10B981] data-[state=active]:font-bold rounded-sm"
            >
              INDICES
            </TabsTrigger>
            <TabsTrigger
              value="sectors"
              className="text-[11px] font-mono h-6 px-2.5 data-[state=active]:bg-[#161B26] data-[state=active]:text-[#10B981] data-[state=active]:font-bold rounded-sm"
            >
              SECTORS
            </TabsTrigger>
            <TabsTrigger
              value="commodities"
              className="text-[11px] font-mono h-6 px-2.5 data-[state=active]:bg-[#161B26] data-[state=active]:text-[#10B981] data-[state=active]:font-bold rounded-sm"
            >
              COMMODITIES
            </TabsTrigger>
            <TabsTrigger
              value="forex"
              className="text-[11px] font-mono h-6 px-2.5 data-[state=active]:bg-[#161B26] data-[state=active]:text-[#10B981] data-[state=active]:font-bold rounded-sm"
            >
              FX RATES
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="indices" className="m-0 focus-visible:outline-none">
          {renderMarketGrid(indicesData)}
        </TabsContent>
        <TabsContent value="sectors" className="m-0 focus-visible:outline-none">
          {renderMarketGrid(sectorsData)}
        </TabsContent>
        <TabsContent value="commodities" className="m-0 focus-visible:outline-none">
          {renderMarketGrid(commoditiesData, true)}
        </TabsContent>
        <TabsContent value="forex" className="m-0 focus-visible:outline-none">
          {renderMarketGrid(forexData, true)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
