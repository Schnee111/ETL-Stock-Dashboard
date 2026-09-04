"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUp, ArrowDown, PieChart, ShieldCheck, Wallet, Activity } from "lucide-react"

export default function PortfolioAnalytics() {
  const holdings = [
    { ticker: "BBCA.JK", name: "Bank Central Asia", shares: "25.000", avgPrice: 8850, currentPrice: 9250, value: 231250000, pl: 10000000, plPct: 4.52 },
    { ticker: "BBRI.JK", name: "Bank Rakyat Indonesia", shares: "30.000", avgPrice: 4950, currentPrice: 5175, value: 155250000, pl: 6750000, plPct: 4.55 },
    { ticker: "TLKM.JK", name: "Telkom Indonesia", shares: "20.000", avgPrice: 3950, currentPrice: 3850, value: 77000000, pl: -2000000, plPct: -2.53 },
    { ticker: "ASII.JK", name: "Astra International", shares: "15.000", avgPrice: 4500, currentPrice: 4680, value: 70200000, pl: 2700000, plPct: 4.0 },
  ]

  const totalValue = holdings.reduce((sum, item) => sum + item.value, 0)
  const totalPL = holdings.reduce((sum, item) => sum + item.pl, 0)
  const totalPLPct = (totalPL / (totalValue - totalPL)) * 100

  return (
    <div className="space-y-4">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#0F121A] border border-[#1E2638] rounded p-3">
          <div className="flex items-center justify-between text-[#64748B] text-[11px] font-mono">
            <span>NAV / PORTFOLIO VALUE</span>
            <Wallet className="h-3.5 w-3.5 text-[#10B981]" />
          </div>
          <div className="text-xl font-bold font-mono text-white tabular-nums mt-1">
            Rp {totalValue.toLocaleString("id-ID")}
          </div>
          <div className="text-[10px] font-mono text-[#64748B] mt-0.5">SETTLED ASSETS</div>
        </div>

        <div className="bg-[#0F121A] border border-[#1E2638] rounded p-3">
          <div className="flex items-center justify-between text-[#64748B] text-[11px] font-mono">
            <span>UNREALIZED P&L</span>
            <Activity className="h-3.5 w-3.5 text-[#10B981]" />
          </div>
          <div
            className={`text-xl font-bold font-mono tabular-nums mt-1 flex items-center gap-1 ${
              totalPL >= 0 ? "text-[#10B981]" : "text-[#EF4444]"
            }`}
          >
            {totalPL >= 0 ? "+" : ""}Rp {totalPL.toLocaleString("id-ID")}
          </div>
          <div className="text-[10px] font-mono text-[#10B981] mt-0.5">
            {totalPLPct >= 0 ? "+" : ""}{totalPLPct.toFixed(2)}% ALL-TIME
          </div>
        </div>

        <div className="bg-[#0F121A] border border-[#1E2638] rounded p-3">
          <div className="flex items-center justify-between text-[#64748B] text-[11px] font-mono">
            <span>RISK PROFILE / SHARPE</span>
            <ShieldCheck className="h-3.5 w-3.5 text-[#06B6D4]" />
          </div>
          <div className="text-xl font-bold font-mono text-white tabular-nums mt-1">
            1.84 <span className="text-xs text-[#06B6D4] font-normal font-sans">OPTIMAL</span>
          </div>
          <div className="text-[10px] font-mono text-[#64748B] mt-0.5">BETA: 0.89 VS IHSG</div>
        </div>

        <div className="bg-[#0F121A] border border-[#1E2638] rounded p-3">
          <div className="flex items-center justify-between text-[#64748B] text-[11px] font-mono">
            <span>ALLOCATION DIVERSITY</span>
            <PieChart className="h-3.5 w-3.5 text-[#F59E0B]" />
          </div>
          <div className="text-xl font-bold font-mono text-white tabular-nums mt-1">
            4 POSITIONS
          </div>
          <div className="text-[10px] font-mono text-[#64748B] mt-0.5">FINANCE (72%), TELCO (14%), AUTO (14%)</div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-[#0F121A] border border-[#1E2638] rounded overflow-hidden">
        <div className="p-3 border-b border-[#1E2638] flex items-center justify-between">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#E2E8F0]">
            ACTIVE PORTFOLIO POSITIONS
          </h3>
          <span className="font-mono text-[10px] text-[#64748B]">IDX REALTIME SETTLEMENT</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-[#1E2638] text-[#64748B] text-left">
                <th className="p-3 uppercase">TICKER</th>
                <th className="p-3 uppercase">NAME</th>
                <th className="p-3 text-right uppercase">SHARES</th>
                <th className="p-3 text-right uppercase">AVG BUY</th>
                <th className="p-3 text-right uppercase">LAST PRICE</th>
                <th className="p-3 text-right uppercase">TOTAL VALUE</th>
                <th className="p-3 text-right uppercase">UNREALIZED P/L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2638]/50">
              {holdings.map((h) => {
                const isPositive = h.pl >= 0
                return (
                  <tr key={h.ticker} className="hover:bg-[#161B26]/60 transition-colors">
                    <td className="p-3 font-bold text-[#10B981]">{h.ticker}</td>
                    <td className="p-3 text-[#94A3B8]">{h.name}</td>
                    <td className="p-3 text-right tabular-nums text-white">{h.shares}</td>
                    <td className="p-3 text-right tabular-nums text-[#94A3B8]">
                      Rp {h.avgPrice.toLocaleString("id-ID")}
                    </td>
                    <td className="p-3 text-right tabular-nums text-white font-semibold">
                      Rp {h.currentPrice.toLocaleString("id-ID")}
                    </td>
                    <td className="p-3 text-right tabular-nums text-white">
                      Rp {h.value.toLocaleString("id-ID")}
                    </td>
                    <td
                      className={`p-3 text-right tabular-nums font-bold ${
                        isPositive ? "text-[#10B981]" : "text-[#EF4444]"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {h.plPct.toFixed(2)}% (Rp {h.pl.toLocaleString("id-ID")})
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
