import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Lazy Barcode Generator",
  description: "Free and simple online barcode images generator. Generate multiple barcodes using bwip-js library.",
  keywords:
    "bwipjs generator, online, free, online barcodes, barcode images list, export barcodes images, barcode, barcodes images, barcodes generator, barcodes list generator, barcodes list, code 128, datamatrix, gs1, qrcode",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
