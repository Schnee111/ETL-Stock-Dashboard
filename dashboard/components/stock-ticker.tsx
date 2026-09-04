"use client"

import { useEffect, useState } from "react"
import { ArrowDown, ArrowUp } from "lucide-react"

export default function StockTicker() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const tickerItems = [
    { symbol: "IHSG", price: "7.234,56", change: "+0,82%", isPositive: true },
    { symbol: "BBCA", price: "9.250", change: "+2,4%", isPositive: true },
    { symbol: "BBRI", price: "5.175", change: "+1,2%", isPositive: true },
    { symbol: "TLKM", price: "3.850", change: "-0,8%", isPositive: false },
    { symbol: "ASII", price: "4.680", change: "+3,1%", isPositive: true },
    { symbol: "BMRI", price: "6.125", change: "+0,8%", isPositive: true },
    { symbol: "BBNI", price: "5.450", change: "+1,1%", isPositive: true },
    { symbol: "UNVR", price: "3.750", change: "-1,4%", isPositive: false },
    { symbol: "PGAS", price: "1.450", change: "+1,7%", isPositive: true },
    { symbol: "ANTM", price: "2.350", change: "+4,2%", isPositive: true },
    { symbol: "INDF", price: "6.750", change: "-0,4%", isPositive: false },
    { symbol: "ICBP", price: "9.875", change: "+0,6%", isPositive: true },
    { symbol: "MDKA", price: "2.680", change: "-1,8%", isPositive: false },
    { symbol: "GOTO", price: "68", change: "+1,5%", isPositive: true },
  ]

  return (
    <div className="hidden md:flex flex-1 items-center overflow-hidden bg-[#090A0F] border-x border-[#1E2638] px-2 h-7">
      <div className="flex items-center gap-1.5 px-2 text-[10px] uppercase font-mono tracking-wider text-[#64748B] border-r border-[#1E2638] shrink-0 pr-3 mr-1">
        <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
        TAPE
      </div>
      <div className="ticker-wrap flex-1">
        <div className="ticker">
          {tickerItems.map((item, index) => (
            <div key={index} className="ticker-item gap-1.5 font-mono text-xs">
              <span className="font-semibold text-[#E2E8F0] tracking-tight">{item.symbol}</span>
              <span className="text-[#94A3B8] tabular-nums font-mono">Rp{item.price}</span>
              <span
                className={`inline-flex items-center text-[11px] font-mono px-1 py-0.2 rounded border ${
                  item.isPositive
                    ? "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/25"
                    : "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/25"
                }`}
              >
                {item.isPositive ? <ArrowUp className="h-2.5 w-2.5 mr-0.5" /> : <ArrowDown className="h-2.5 w-2.5 mr-0.5" />}
                {item.change}
              </span>
            </div>
          ))}
          {mounted &&
            tickerItems.map((item, index) => (
              <div key={`dup-${index}`} className="ticker-item gap-1.5 font-mono text-xs">
                <span className="font-semibold text-[#E2E8F0] tracking-tight">{item.symbol}</span>
                <span className="text-[#94A3B8] tabular-nums font-mono">Rp{item.price}</span>
                <span
                  className={`inline-flex items-center text-[11px] font-mono px-1 py-0.2 rounded border ${
                    item.isPositive
                      ? "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/25"
                      : "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/25"
                  }`}
                >
                  {item.isPositive ? <ArrowUp className="h-2.5 w-2.5 mr-0.5" /> : <ArrowDown className="h-2.5 w-2.5 mr-0.5" />}
                  {item.change}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
