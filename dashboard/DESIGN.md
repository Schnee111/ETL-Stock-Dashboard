# Visual & Architectural Specification: ETL Stock Terminal

## 1. Objective & Design Philosophy
Transform generic v0 shadcn/ui stock dashboard into a high-density, professional Financial Market Terminal (Bloomberg / Koyfin / TradingView inspired).

## 2. Design Tokens & Palette
- Background: Void Obsidian `#090A0F`, Card Deep Slate `#0F121A`, Elevated Card `#161B26`
- Borders: Subtle hairline `#1E2638` (hover: `#2E3A54`)
- Accent Profit/Up: Clean Emerald `#10B981` / `#059669` (dark/light contrast)
- Accent Loss/Down: Crisp Crimson `#EF4444` / `#DC2626`
- Typography:
  - Sans: Inter / Geist Sans for labels
  - Tabular Numbers: `font-mono tabular-nums` (SF Mono, Roboto Mono, JetBrains Mono) for all currency, percentages, volume, and prices.
- Aesthetics: High data density, micro-badges, clean candlestick/volume bar charts, seamless real-time ticker bar.

## 3. Scope of Changes
- `app/globals.css`: Dark terminal theme default, tabular-nums utility, hairline border classes.
- `app/layout.tsx`: Dark mode lock/preferred, clean terminal topbar header with market status ping.
- `app/page.tsx`: Re-architect layout into multi-panel terminal:
  - Live Ticker Tape banner
  - Top Metrics strip (IHSG, Top Gainer, Top Loser, Total Volume)
  - Main Chart panel with timeframe selector (1D, 1W, 1M, 1Y, ALL) and clean chart controls
  - Order Book / Market Depth or Emiten Financial Summary side-by-side
  - News stream in compact terminal wire format
- `components/stock-chart.tsx`: Modernize Recharts into sleek dark theme with gradient fills, crosshair tooltips, volume bars, and tabular price overlays.
- `components/stock-ticker.tsx`: Seamless scrolling live ticker with green/red pill badges.
- `components/market-overview.tsx` & `components/financial-chart.tsx`: Tighten visual hierarchy, remove clunky shadows, add micro sparklines.
