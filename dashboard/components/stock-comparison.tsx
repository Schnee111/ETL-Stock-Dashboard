"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronsUpDown, Plus, X, BarChart2 } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

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

async function fetchEmiten(): Promise<Emiten[]> {
  try {
    const apiUrl = "http://localhost:5000/api/emiten"
    const res = await fetch(apiUrl, { cache: "no-store" })
    if (!res.ok) throw new Error(`Failed to fetch emiten: ${res.status}`)
    const tickers: string[] = await res.json()
    return tickers.map((ticker) => ({ ticker, name: ticker.split(".")[0] }))
  } catch (error) {
    return [{ ticker: "BBRI.JK", name: "BBRI" }]
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

const STOCK_COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EC4899", "#8B5CF6"]

const ComparisonTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0F121A] p-2.5 border border-[#2E3A54] rounded shadow-xl font-mono text-xs min-w-[160px]">
        <div className="text-[10px] text-[#64748B] border-b border-[#1E2638] pb-1 mb-1.5 font-mono">
          DATE: {label}
        </div>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between items-center py-0.5">
            <span className="font-bold text-[11px]" style={{ color: entry.stroke }}>
              {entry.name}
            </span>
            <span className="tabular-nums text-white">Rp {Number(entry.value).toLocaleString("id-ID")}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function StockComparison() {
  const [selectedStocks, setSelectedStocks] = useState<string[]>(["BBRI.JK", "BBCA.JK"])
  const [open, setOpen] = useState(false)
  const [priceData, setPriceData] = useState<{ [key: string]: PriceData[] }>({})
  const [emitens, setEmitens] = useState<Emiten[]>([])

  useEffect(() => {
    async function loadEmitens() {
      const fetchedEmitens = await fetchEmiten()
      setEmitens(fetchedEmitens)
    }
    loadEmitens()
  }, [])

  useEffect(() => {
    async function fetchAllPriceData() {
      const data: { [key: string]: PriceData[] } = {}
      for (const stock of selectedStocks) {
        const response = await fetchPriceData(stock, "yearly")
        data[stock] = response
      }
      setPriceData(data)
    }
    if (selectedStocks.length > 0) {
      fetchAllPriceData()
    }
  }, [selectedStocks])

  const handleAddStock = (value: string) => {
    if (selectedStocks.length < 5 && !selectedStocks.includes(value)) {
      setSelectedStocks([...selectedStocks, value])
    }
    setOpen(false)
  }

  const handleRemoveStock = (value: string) => {
    if (selectedStocks.length > 1) {
      setSelectedStocks(selectedStocks.filter((stock) => stock !== value))
    }
  }

  // Normalize/merge series by Date
  const allDates = Array.from(
    new Set(
      Object.values(priceData)
        .flat()
        .map((p) => p.Date)
    )
  ).sort()

  const chartData = allDates.map((date) => {
    const row: any = { Date: date }
    selectedStocks.forEach((ticker) => {
      const point = priceData[ticker]?.find((p) => p.Date === date)
      if (point) {
        row[ticker] = point.Close
      }
    })
    return row
  })

  return (
    <div className="bg-[#0F121A] border border-[#1E2638] rounded p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E2638] pb-3">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-[#10B981]" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#E2E8F0]">
            MULTI-EMITEN PRICE CORRELATION
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex gap-1.5 flex-wrap">
            {selectedStocks.map((ticker, index) => (
              <span
                key={ticker}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono border"
                style={{
                  backgroundColor: `${STOCK_COLORS[index % STOCK_COLORS.length]}15`,
                  borderColor: `${STOCK_COLORS[index % STOCK_COLORS.length]}40`,
                  color: STOCK_COLORS[index % STOCK_COLORS.length],
                }}
              >
                {ticker}
                <button
                  type="button"
                  onClick={() => handleRemoveStock(ticker)}
                  className="hover:opacity-75 focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs font-mono bg-[#090A0F] border-[#1E2638] text-[#E2E8F0] hover:bg-[#161B26]"
              >
                <Plus className="h-3 w-3 mr-1 text-[#10B981]" />
                ADD SYMBOL
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-52 bg-[#0F121A] border-[#1E2638] text-[#E2E8F0]">
              <Command className="bg-transparent">
                <CommandInput placeholder="Search ticker..." className="h-8 text-xs font-mono" />
                <CommandList className="max-h-48 text-xs font-mono">
                  <CommandEmpty>No symbols found.</CommandEmpty>
                  <CommandGroup>
                    {emitens.map((emiten) => (
                      <CommandItem
                        key={emiten.ticker}
                        onSelect={() => handleAddStock(emiten.ticker)}
                        className="hover:bg-[#161B26] cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-3.5 w-3.5 text-[#10B981]",
                            selectedStocks.includes(emiten.ticker) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {emiten.ticker}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="h-[380px] w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="2 3" stroke="#1E2638" vertical={false} />
              <XAxis
                dataKey="Date"
                stroke="#475569"
                tick={{ fontSize: 10, fill: "#64748B", fontFamily: "monospace" }}
                minTickGap={45}
                axisLine={{ stroke: "#1E2638" }}
                tickLine={false}
              />
              <YAxis
                stroke="#475569"
                orientation="right"
                tick={{ fontSize: 10, fill: "#64748B", fontFamily: "monospace" }}
                tickFormatter={(val) => Number(val).toLocaleString("id-ID")}
                axisLine={false}
                tickLine={false}
                width={56}
              />
              <Tooltip content={<ComparisonTooltip />} />
              {selectedStocks.map((ticker, index) => (
                <Line
                  key={ticker}
                  type="monotone"
                  dataKey={ticker}
                  name={ticker}
                  stroke={STOCK_COLORS[index % STOCK_COLORS.length]}
                  strokeWidth={1.8}
                  dot={false}
                  activeDot={{ r: 4, stroke: "#090A0F", strokeWidth: 2 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center font-mono text-xs text-[#64748B]">
            LOADING COMPARATIVE MATRIX...
          </div>
        )}
      </div>
    </div>
  )
}
