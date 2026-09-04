import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "IDX Terminal | Financial Market Intelligence",
  description: "High-density institutional stock & market terminal for Indonesia Stock Exchange (IDX)",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }} suppressHydrationWarning>
      <body className="min-h-screen bg-[#090A0F] text-[#E2E8F0] font-sans antialiased selection:bg-[#10B981]/30 selection:text-white">
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
