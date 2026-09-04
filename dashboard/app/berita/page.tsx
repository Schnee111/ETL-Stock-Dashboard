"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ArrowLeft, Terminal } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const newsArticles = [
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
  },
  {
    id: "3",
    title: "Astra International Catat Pertumbuhan Laba 15% di Kuartal II-2023",
    source: "Bisnis.com",
    author: "Budi Santoso",
    time: "6 jam yang lalu",
    date: "11 Mei 2025",
    tags: ["ASII"],
    snippet:
      "PT Astra International Tbk (ASII) mencatatkan pertumbuhan laba bersih sebesar 15% secara year-on-year (yoy) pada kuartal II-2023. Kinerja positif ini didorong oleh kontribusi dari segmen otomotif dan jasa keuangan.",
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
      "Saham PT Bank Rakyat Indonesia Agroniaga Tbk (AGRO) melesat setelah pengumuman rencana merger dengan induk usahanya, PT Bank Rakyat Indonesia Tbk (BBRI). Langkah ini merupakan bagian dari strategi konsolidasi perbankan BUMN.",
  },
  {
    id: "5",
    title: "Unilever Indonesia Fokus Ekspansi Produk Ramah Lingkungan",
    source: "Kompas",
    author: "Anita Wijaya",
    time: "10 jam yang lalu",
    date: "11 Mei 2025",
    tags: ["UNVR"],
    snippet:
      "PT Unilever Indonesia Tbk (UNVR) mengumumkan fokus strategis pada pengembangan dan ekspansi produk ramah lingkungan. Perseroan menargetkan 50% dari portofolio produknya menggunakan bahan yang dapat didaur ulang pada tahun 2025.",
  },
  {
    id: "6",
    title: "Indeks Harga Saham Gabungan Ditutup Menguat 0,8%",
    source: "Antara News",
    author: "Fajar Nugroho",
    time: "12 jam yang lalu",
    date: "11 Mei 2025",
    tags: ["IHSG", "COMPOSITE"],
    snippet:
      "Indeks Harga Saham Gabungan (IHSG) ditutup menguat 0,8% ke level 7.250 pada perdagangan Kamis (11/5/2025). Penguatan ini didorong oleh aksi beli investor asing di saham-saham perbankan dan telekomunikasi.",
  },
  {
    id: "7",
    title: "Bank Mandiri Targetkan Pertumbuhan Kredit 10-12% Tahun Ini",
    source: "Detik Finance",
    author: "Rini Kusuma",
    time: "14 jam yang lalu",
    date: "11 Mei 2025",
    tags: ["BMRI"],
    snippet:
      "PT Bank Mandiri Tbk (BMRI) menargetkan pertumbuhan kredit sebesar 10-12% pada tahun 2025. Target ini didukung oleh pemulihan ekonomi dan ekspansi di segmen korporasi dan UMKM.",
  },
  {
    id: "8",
    title: "Pertamina Energi Geothermal Siap Melantai di Bursa",
    source: "Tempo",
    author: "Arif Wicaksono",
    time: "16 jam yang lalu",
    date: "11 Mei 2025",
    tags: ["PEGS"],
    snippet:
      "PT Pertamina Energi Geothermal (PEGS) siap melantai di Bursa Efek Indonesia (BEI) pada Juni 2025. Perusahaan menargetkan dana IPO sebesar Rp8 triliun untuk ekspansi kapasitas pembangkit listrik panas bumi.",
  },
]

export default function NewsListingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const allTags = Array.from(new Set(newsArticles.flatMap((article) => article.tags))).sort()

  const filteredArticles = newsArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.snippet.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTag = selectedTag ? article.tags.includes(selectedTag) : true

    return matchesSearch && matchesTag
  })

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#E2E8F0] p-4 md:p-6 font-mono">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-[#1E2638] pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#10B981] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            RETURN TO IDX TERMINAL
          </Link>
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <Terminal className="h-3.5 w-3.5 text-[#10B981]" />
            <span>WIRE SERVICE FEED</span>
          </div>
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-wider text-white">IDX FINANCIAL WIRE ARCHIVE</h1>
          <p className="text-xs text-[#64748B] mt-1">Real-time market intelligence and corporate disclosures</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#64748B]" />
            <Input
              placeholder="Filter headlines, issuers, keywords..."
              className="pl-9 h-8 text-xs font-mono bg-[#0F121A] border-[#1E2638] text-white focus:border-[#10B981]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-1.5 items-center">
            <button
              type="button"
              onClick={() => setSelectedTag(null)}
              className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                selectedTag === null
                  ? "bg-[#10B981] text-[#090A0F] font-bold border-[#10B981]"
                  : "bg-[#0F121A] text-[#64748B] border-[#1E2638] hover:text-white"
              }`}
            >
              ALL
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-2 py-1 text-xs rounded border transition-colors ${
                  selectedTag === tag
                    ? "bg-[#10B981] text-[#090A0F] font-bold border-[#10B981]"
                    : "bg-[#0F121A] text-[#64748B] border-[#1E2638] hover:text-white"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-[#0F121A] border border-[#1E2638] hover:border-[#2E3A54] rounded p-4 flex flex-col justify-between transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-2">
                  <span className="text-[#10B981] font-semibold">{article.source}</span>
                  <span>{article.time}</span>
                </div>
                <Link href={`/berita/${article.id}`}>
                  <h3 className="font-sans font-semibold text-sm text-white hover:text-[#10B981] transition-colors leading-snug">
                    {article.title}
                  </h3>
                </Link>
                <p className="text-xs font-sans text-[#94A3B8] mt-2 line-clamp-3 leading-relaxed">
                  {article.snippet}
                </p>
              </div>

              <div className="flex flex-wrap gap-1 mt-4 pt-3 border-t border-[#1E2638]">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] bg-[#161B26] text-[#94A3B8] border border-[#1E2638] px-1.5 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12 border border-dashed border-[#1E2638] rounded">
            <h3 className="text-xs font-mono text-[#94A3B8]">NO DISPATCHES FOUND</h3>
            <p className="text-xs text-[#64748B] mt-1">Adjust query or symbol filter parameters</p>
          </div>
        )}
      </div>
    </div>
  )
}
