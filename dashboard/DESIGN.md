# Design System Specification — AETER Monitor Archetype & Clean Utilitarian Craft
**Project**: ETL Stock & Financial Market Intelligence
**Archetype**: `monitor.aeter.my.id` + `taste-minimalist` + `impeccable` + `frontend-ui-engineering`
**Audience**: Equity Analysts, Portfolio Managers, Data Engineers

---

## 1. Design Philosophy
- **Authentic Materiality**: Premium frosted glass substrate, hairline borders, quiet layout without visual clutter.
- **Anti-Slop Zero Tolerance**:
  - NO faux-cyber terminal costumes (`v2.4-PRO`, `AIRFLOW: NOMINAL`, fake ping).
  - NO marquee ticker tapes that flicker and strain the eyes.
  - NO heavy opaque black boxes with aggressive borders.
- **Precision & Scannability**: Strict tabular alignment, consistent spatial scale, clear typographic hierarchy.

## 2. Typography
- **Display & Headlines**: `Plus Jakarta Sans`, sans-serif (`-0.02em` letter spacing).
- **Financial Figures, Tickers & Ratios**: `JetBrains Mono`, monospace with `tabular-nums`.

## 3. Color Tokens
- **Canvas Substrate**: Deep muted obsidian slate with subtle ambient glow (`#0d0f14` / frosted backdrop).
- **Cards & Panels**: Frosted obsidian glass (`rgba(22, 25, 33, 0.72)` with `backdrop-filter: blur(20px)` and border `1px solid rgba(255, 255, 255, 0.08)`).
- **Ink**:
  - Pure: `#f4f5f8`
  - Secondary: `#9ca3af`
  - Subtle: `#6b7280`
- **Signals**:
  - Gain / Inflow: `#10b981` (Emerald)
  - Loss / Outflow: `#f43f5e` (Rose)
  - Neutral / Volume: `#3b82f6` (Cobalt)

## 4. Components Architecture
1. **Header**: Minimalist Linear Breadcrumb Strip (`IDX / Market Intelligence · Equity Analytics & Financial Reports`), live indicator chip, ticker selector.
2. **Key Financial Metrics**: Clean horizontal stat blocks with precise delta tags and subtle sparkline visual aids.
3. **Interactive Stock Chart**: Clean dual-pane Recharts (Price Area Gradient on top, Volume Bars below) with high-legibility crosshair tooltip.
4. **Statements & News**: Tabular statement viewer with year selection and high-density editorial financial news list.
