import Link from "next/link"
import { Newspaper, ExternalLink } from "lucide-react"

interface StockNewsProps {
  fullPage?: boolean
}

export default function StockNews({ fullPage = false }: StockNewsProps) {
  const newsItems = [
    {
      id: "1",
      title: "Bank Indonesia Pertahankan BI-Rate di Level 5,75% untuk Stabilitas Kurs Rupiah",
      source: "CNBC IDX WIRE",
      time: "14:25 WIB",
      tags: ["BBRI", "BBCA", "BMRI"],
      snippet:
        "Bank Indonesia (BI) memutuskan untuk mempertahankan suku bunga acuan atau BI Rate di level 5,75% dalam Rapat Dewan Gubernur (RDG). Keputusan sejalan dengan upaya menjaga stabilitas nilai tukar rupiah dan ekspektasi inflasi.",
    },
    {
      id: "2",
      title: "Telkom Indonesia (TLKM) Genjot Capex Infrastruktur Digital & 5G di 10 Titik Baru",
      source: "INVESTOR WIRE",
      time: "13:10 WIB",
      tags: ["TLKM"],
      snippet:
        "PT Telkom Indonesia Tbk (TLKM) memperkuat ekosistem digital nasional dan data center hyperscale guna memacu arus kas berulang non-seluler ke depan.",
    },
    {
      id: "3",
      title: "Astra International (ASII) Bukukan Pertumbuhan Penjualan Segmen Otomotif Q2",
      source: "BLOOMBERG IDX",
      time: "11:45 WIB",
      tags: ["ASII"],
      snippet:
        "PT Astra International Tbk (ASII) mencatatkan momentum solid pada lini mobilitas dan jasa keuangan, mempertegas dominasi pangsa pasar roda empat domestik.",
    },
    {
      id: "4",
      title: "Kinerja Konsolidasi BUMN Perbankan: Arus Dana Asing Mengalir ke BBRI dan BMRI",
      source: "REUTERS FEED",
      time: "09:30 WIB",
      tags: ["BBRI", "BMRI"],
      snippet:
        "Investor institusional asing mencatatkan net buy solid di emiten big caps perbankan IDX di tengah rilis laporan keuangan kuartalan yang melampaui estimasi konsensus.",
    },
    {
      id: "5",
      title: "Permintaan Nikel & Tembaga Global Angkat Volume Perdagangan Emiten Metal IDX",
      source: "MARKET WATCH",
      time: "08:15 WIB",
      tags: ["ANTM", "MDKA"],
      snippet:
        "Kenaikan harga komoditas logam dasar di London Metal Exchange memberikan katalis penguatan margin terhadap produsen nikel dan emas domestik.",
    },
  ]

  const itemsToRender = fullPage ? newsItems : newsItems.slice(0, 4)

  return (
    <div className="bg-[#0F121A] border border-[#1E2638] hover:border-[#2E3A54] rounded transition-colors flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-[#1E2638]">
        <div className="flex items-center gap-2">
          <Newspaper className="h-4 w-4 text-[#10B981]" />
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#E2E8F0]">
            FINANCIAL WIRE & LIVE DISPATCH
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
          <span className="font-mono text-[10px] text-[#10B981] uppercase font-semibold">FEED LIVE</span>
        </div>
      </div>

      <div className="p-3 divide-y divide-[#1E2638]/70">
        {itemsToRender.map((news) => (
          <div key={news.id} className="py-2.5 first:pt-0 last:pb-0 group">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded border border-[#10B981]/20">
                  {news.source}
                </span>
                <span className="text-[10px] font-mono text-[#64748B]">{news.time}</span>
              </div>
              <div className="flex gap-1">
                {news.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[9px] font-mono bg-[#161B26] text-[#94A3B8] border border-[#1E2638] px-1 py-0.5 rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <Link href={`/berita/${news.id}`} className="block group">
              <h4 className="font-medium text-xs text-[#E2E8F0] group-hover:text-[#10B981] transition-colors leading-snug">
                {news.title}
              </h4>
            </Link>

            {fullPage && (
              <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                {news.snippet}
              </p>
            )}
          </div>
        ))}
      </div>

      {!fullPage && (
        <div className="p-2 border-t border-[#1E2638] bg-[#090A0F]/60 text-center">
          <Link
            href="/berita"
            className="text-[11px] font-mono text-[#64748B] hover:text-[#10B981] inline-flex items-center gap-1 transition-colors"
          >
            VIEW ALL MARKET HEADLINES <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  )
}
