"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ArrowLeft, Newspaper, Tag, Calendar } from "lucide-react"

export const newsArticles = [
  {
    id: "1",
    title: "Bank Indonesia Pertahankan Suku Bunga Acuan di Level 5,75%",
    source: "CNBC Indonesia",
    author: "Herry Prasetyo",
    time: "2 jam yang lalu",
    date: "11 Mei 2025",
    tags: ["BBRI", "BBCA", "BMRI"],
    snippet:
      "Bank Indonesia (BI) memutuskan untuk mempertahankan suku bunga acuan atau BI Rate di level 5,75% dalam Rapat Dewan Gubernur (RDG) bulanan. Keputusan ini sejalan dengan upaya menjaga stabilitas nilai tukar rupiah dan mengendalikan inflasi.",
    content: `JAKARTA - Bank Indonesia (BI) memutuskan untuk mempertahankan suku bunga acuan atau BI Rate di level 5,75% dalam Rapat Dewan Gubernur (RDG) bulanan yang digelar pada 10-11 Mei 2025. Keputusan ini sejalan dengan upaya menjaga stabilitas nilai tukar rupiah dan mengendalikan inflasi.

Gubernur BI, Perry Warjiyo, mengatakan keputusan tersebut konsisten dengan kebijakan moneter yang pre-emptive dan forward looking untuk memastikan inflasi tetap terkendali dalam sasaran 3,0±1% pada 2025 dan 2026.

Keputusan BI untuk mempertahankan suku bunga acuan diprediksi akan berdampak positif bagi saham-saham perbankan seperti BBRI, BBCA, dan BMRI.`
  },
  {
    id: "2",
    title: "Telkom Indonesia Luncurkan Layanan 5G di 10 Kota Besar",
    source: "Investor Daily",
    author: "Dian Ayu Lestari",
    time: "4 jam yang lalu",
    date: "11 Mei 2025",
    tags: ["TLKM"],
    snippet:
      "PT Telkom Indonesia Tbk (TLKM) resmi meluncurkan layanan 5G di 10 kota besar di Indonesia. Langkah ini merupakan bagian dari strategi perseroan untuk memperkuat posisinya di industri telekomunikasi dan digital.",
    content: `JAKARTA - PT Telkom Indonesia Tbk (TLKM) resmi meluncurkan layanan 5G di 10 kota besar di Indonesia pada Rabu (10/5/2025). Kota-kota tersebut meliputi Jakarta, Surabaya, Bandung, Medan, Makassar, Denpasar, Semarang, Yogyakarta, Palembang, dan Balikpapan.`
  },
  {
    id: "3",
    title: "Astra International Catat Pertumbuhan Laba 15% di Kuartal II",
    source: "Bisnis.com",
    author: "Budi Santoso",
    time: "6 jam yang lalu",
    date: "11 Mei 2025",
    tags: ["ASII"],
    snippet:
      "PT Astra International Tbk (ASII) mencatatkan pertumbuhan laba bersih sebesar 15% secara year-on-year (yoy) pada kuartal II. Kinerja positif ini didorong oleh kontribusi dari segmen otomotif dan jasa keuangan.",
    content: `JAKARTA - PT Astra International Tbk (ASII) mencatatkan pertumbuhan laba bersih sebesar 15% secara year-on-year (yoy) pada kuartal II. Berdasarkan laporan keuangan resmi, perseroan membukukan laba bersih sebesar Rp8,2 triliun, naik dari Rp7,1 triliun pada periode yang sama tahun lalu.`
  },
  {
    id: "4",
    title: "BRI Agro Merger dengan BRI, Saham AGRO Melesat",
    source: "Kontan",
    author: "Ratna Dewi",
    time: "8 jam yang lalu",
    date: "11 Mei 2025",
    tags: ["BBRI", "AGRO"],
    snippet:
      "Saham PT Bank Rakyat Indonesia Agroniaga Tbk (AGRO) melesat setelah pengumuman rencana merger dengan induk usahanya, PT Bank Rakyat Indonesia Tbk (BBRI).",
    content: `Saham PT Bank Rakyat Indonesia Agroniaga Tbk (AGRO) melesat setelah pengumuman rencana merger dengan induk usahanya, PT Bank Rakyat Indonesia Tbk (BBRI). Langkah ini merupakan bagian dari strategi konsolidasi perbankan BUMN.`
  },
]

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null)

  const allTags = Array.from(new Set(newsArticles.flatMap((a) => a.tags))).sort()

  const filteredArticles = newsArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.snippet.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = selectedTag ? article.tags.includes(selectedTag) : true
    return matchesSearch && matchesTag
  })

  const selectedArticle = newsArticles.find((a) => a.id === activeArticleId)

  return (
    <div className="min-h-screen bg-[#0d0f14] text-[#f4f5f8] p-4 lg:p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Breadcrumb */}
        <div className="breadcrumb-strip">
          <div className="flex items-center gap-2.5 text-xs">
            <Link href="/" className="inline-flex items-center gap-1 text-[#10b981] hover:underline font-bold">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>MARKET TERMINAL</span>
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-[#f4f5f8] font-semibold">Financial Wire</span>
            <span className="text-white/20 hidden sm:inline">·</span>
            <span className="text-[#9ca3af] hidden sm:inline">IDX Disclosures</span>
          </div>
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] font-mono">
            <span className="emerald-pip" />
            <span className="text-[#9ca3af]">DISPATCH ARCHIVE</span>
          </div>
        </div>

        {selectedArticle ? (
          <div className="glass-panel p-6 space-y-4">
            <button
              onClick={() => setActiveArticleId(null)}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#10b981] hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to all articles
            </button>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#9ca3af]">
                <span className="text-[#10b981] font-bold">{selectedArticle.source}</span>
                <span>·</span>
                <span>{selectedArticle.date}</span>
                <span>·</span>
                <span>Oleh {selectedArticle.author}</span>
              </div>
              <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight leading-tight">
                {selectedArticle.title}
              </h1>
              <div className="flex gap-1.5 pt-1">
                {selectedArticle.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs font-mono text-[#9ca3af]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-white/8 text-sm text-[#cbd5e1] leading-relaxed whitespace-pre-line">
              {selectedArticle.content}
            </div>
          </div>
        ) : (
          <>
            {/* Search and Filters */}
            <div className="glass-panel p-3 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#6b7280]" />
                <input
                  type="text"
                  placeholder="Filter headlines, symbols, issuers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-8 w-full pl-8 pr-3 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder-[#6b7280] focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 items-center w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedTag(null)}
                  className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all ${
                    selectedTag === null
                      ? "bg-white/15 text-white font-bold border border-white/20"
                      : "bg-white/5 text-[#9ca3af] hover:text-white"
                  }`}
                >
                  ALL
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                    className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all ${
                      selectedTag === tag
                        ? "bg-[#10b981]/20 text-[#10b981] font-bold border border-[#10b981]/30"
                        : "bg-white/5 text-[#9ca3af] hover:text-white"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid gap-3.5 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => setActiveArticleId(article.id)}
                  className="glass-panel p-4 flex flex-col justify-between cursor-pointer hover:border-white/20 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#9ca3af] mb-2">
                      <span className="text-[#10b981] font-semibold">{article.source}</span>
                      <span>{article.time}</span>
                    </div>
                    <h3 className="font-semibold text-sm text-white group-hover:text-[#10b981] transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs text-[#9ca3af] mt-2 line-clamp-3 leading-relaxed">
                      {article.snippet}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-4 pt-3 border-t border-white/8">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono bg-white/5 text-[#9ca3af] border border-white/10 px-1.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
