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
      source: "CNBC IDX",
      time: "14:25 WIB",
      tags: ["BBRI", "BBCA", "BMRI"],
      snippet:
        "Bank Indonesia (BI) memutuskan untuk mempertahankan suku bunga acuan atau BI Rate di level 5,75% dalam Rapat Dewan Gubernur (RDG). Keputusan sejalan dengan upaya menjaga stabilitas nilai tukar rupiah dan ekspektasi inflasi.",
    },
    {
      id: "2",
      title: "Telkom Indonesia (TLKM) Genjot Capex Infrastruktur Digital & 5G di 10 Titik Baru",
      source: "INVESTOR DAILY",
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
      source: "REUTERS",
      time: "09:30 WIB",
      tags: ["BBRI", "BMRI"],
      snippet:
        "Investor institusional asing mencatatkan net buy solid di emiten big caps perbankan IDX di tengah rilis laporan keuangan kuartalan yang melampaui estimasi konsensus.",
    },
  ]

  const itemsToRender = fullPage ? newsItems : newsItems.slice(0, 4)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/8">
        <div className="flex items-center gap-2">
          <Newspaper className="h-4 w-4 text-[#10b981]" />
          <h3 className="text-xs font-semibold text-white tracking-tight">
            Financial Wire & Disclosures
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#10b981]">
          <span className="emerald-pip" />
          <span className="text-[10px] font-semibold">STREAM ACTIVE</span>
        </div>
      </div>

      <div className="divide-y divide-white/5 overflow-y-auto max-h-[360px] custom-scrollbar pr-1">
        {itemsToRender.map((news) => (
          <div key={news.id} className="py-2.5 first:pt-0 last:pb-0 group">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[9.5px] font-mono font-medium text-[#10b981] bg-[#10b981]/10 px-1.5 py-0.5 rounded border border-[#10b981]/20">
                  {news.source}
                </span>
                <span className="text-[10px] font-mono text-[#6b7280]">{news.time}</span>
              </div>
              <div className="flex gap-1">
                {news.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[9px] font-mono bg-white/5 text-[#9ca3af] border border-white/10 px-1 py-0.5 rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <Link href="/berita" className="block group">
              <h4 className="font-medium text-xs text-[#f4f5f8] group-hover:text-[#10b981] transition-colors leading-snug">
                {news.title}
              </h4>
            </Link>

            <p className="text-[11px] text-[#9ca3af] mt-1 line-clamp-2 leading-relaxed">
              {news.snippet}
            </p>
          </div>
        ))}
      </div>

      {!fullPage && (
        <div className="pt-2.5 mt-2 border-t border-white/8 text-center">
          <Link
            href="/berita"
            className="text-[11px] font-mono text-[#9ca3af] hover:text-[#10b981] inline-flex items-center gap-1 transition-colors"
          >
            <span>All Corporate Disclosures</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  )
}
