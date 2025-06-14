"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Download, Zap, BarChart3, Info, Code, Settings, FileCode } from "lucide-react"
import { JetBrains_Mono, Bungee_Tint } from "next/font/google"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const bungeeTint = Bungee_Tint({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
})

interface BarcodeOptions {
  bcid: string
  text: string
  scale: number
  includetext: boolean
  textxalign: string
}

declare global {
  interface Window {
    bwipjs: {
      toCanvas: (canvas: HTMLCanvasElement, options: BarcodeOptions) => void
    }
  }
}

export default function BarcodeGenerator() {
  const [barcodeText, setBarcodeText] = useState("AAA1234;BBB1234")
  const [symbology, setSymbology] = useState("code128")
  const [showText, setShowText] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [barcodes, setBarcodes] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    // Load saved preferences
    const savedDarkMode = localStorage.getItem("darkModeEnabled") === "true"
    const savedSymbology = localStorage.getItem("lastSymbology")
    const savedRequest = localStorage.getItem("lastRequest")

    if (savedDarkMode) setDarkMode(true)
    if (savedSymbology) setSymbology(savedSymbology)
    if (savedRequest) setBarcodeText(savedRequest)

    // Load bwip-js library
    const script = document.createElement("script")
    script.src = "https://cdn.jsdelivr.net/npm/bwip-js@4.5.1/dist/bwip-js-min.js"
    script.async = true
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("darkModeEnabled", darkMode.toString())
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const generateBarcodes = async () => {
    if (!barcodeText.trim()) {
      setBarcodes([])
      return
    }

    setIsGenerating(true)
    localStorage.setItem("lastRequest", barcodeText)
    localStorage.setItem("lastSymbology", symbology)

    try {
      // Determine separator
      let separator = ";"
      if (barcodeText.includes("\n")) separator = "\n"
      else if (barcodeText.includes(",")) separator = ","
      else if (barcodeText.includes(" ")) separator = " "

      const entries = barcodeText
        .split(separator)
        .map((entry) => entry.trim())
        .filter((entry) => entry)
      const generatedBarcodes: string[] = []

      // Wait for bwip-js to load
      await new Promise((resolve) => {
        const checkBwipjs = () => {
          if (window.bwipjs) {
            resolve(true)
          } else {
            setTimeout(checkBwipjs, 100)
          }
        }
        checkBwipjs()
      })

      const canvas = document.createElement("canvas")

      for (const entry of entries) {
        const options: BarcodeOptions = {
          bcid: symbology,
          text: entry,
          scale: 3,
          includetext: showText,
          textxalign: "center",
        }

        try {
          window.bwipjs.toCanvas(canvas, options)
          generatedBarcodes.push(canvas.toDataURL("image/png"))
        } catch (error) {
          console.error("Error generating barcode for:", entry, error)
        }
      }

      setBarcodes(generatedBarcodes)
    } catch (error) {
      console.error("Error generating barcodes:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const exportBarcodes = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Barcodes Export</title>
          <style>
            body { margin: 0; padding: 20px; font-family: system-ui; }
            .barcode-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
            .barcode-card { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; text-align: center; }
            .barcode-image { max-width: 100%; height: auto; }
            @media print {
              body { margin: 0; }
              .barcode-card { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="barcode-grid">
            ${barcodes
              .map(
                (barcode, index) => `
              <div class="barcode-card">
                <img src="${barcode}" alt="Barcode ${index + 1}" class="barcode-image" />
              </div>
            `,
              )
              .join("")}
          </div>
        </body>
      </html>
    `

    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${jetbrainsMono.variable} ${bungeeTint.variable}`}>
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-background dark:to-primary-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-primary-800 dark:text-primary-500 drop-shadow-md">
                Lazy Barcode Generator
              </h1>
            </div>
            <p className="text-lg text-foreground max-w-2xl mx-auto">
              Generate multiple barcodes easily using the powerful{" "}
              <a
                href="https://github.com/metafloor/bwip-js/wiki/Online-Barcode-API"
                className="text-primary-600 dark:text-primary-500 hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                bwip-js library
              </a>
            </p>
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex justify-end mb-6">
            <div className="flex items-center space-x-2">
              <Label htmlFor="dark-mode" className="text-sm font-medium">
                Dark mode
              </Label>
              <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-4 gap-6 mb-8">
            {/* Instructions */}
            <Card className="lg:col-span-1 bg-card/80 backdrop-blur-sm border-border">
              <CardHeader className="bg-muted/50 rounded-t-lg border-b border-border">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Info className="h-5 w-5 text-primary-600 dark:text-primary-500" />
                  Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground pt-4">
                <p className="flex items-start gap-2">
                  <span className="text-primary-600 dark:text-primary-500">•</span>
                  <span>Use semicolons (;), commas (,), spaces, or line breaks to separate barcode values</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-primary-600 dark:text-primary-500">•</span>
                  <span>No limit on the number of codes</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-primary-600 dark:text-primary-500">•</span>
                  <span>Barcodes are displayed in a responsive grid</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-primary-600 dark:text-primary-500">•</span>
                  <span>All barcodes are generated with white backgrounds for optimal scanning</span>
                </p>
              </CardContent>
            </Card>

            {/* Input Form */}
            <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm border-border">
              <CardHeader className="bg-muted/50 rounded-t-lg border-b border-border">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Code className="h-5 w-5 text-primary-600 dark:text-primary-500" />
                  Generate Barcodes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="barcode-input" className="text-sm font-medium mb-2 block text-foreground">
                    Barcode Values
                  </Label>
                  <Textarea
                    id="barcode-input"
                    placeholder="Enter barcode values separated by semicolons, commas, or line breaks..."
                    value={barcodeText}
                    onChange={(e) => setBarcodeText(e.target.value)}
                    className="min-h-[120px] font-mono text-sm resize-none bg-background/50 border-border text-foreground"
                  />
                </div>
                <Button
                  onClick={generateBarcodes}
                  disabled={isGenerating || !barcodeText.trim()}
                  className="w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 text-white"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Generate Barcodes
                    </>
                  )}
                </Button>
                <Button
                  onClick={exportBarcodes}
                  disabled={barcodes.length === 0}
                  variant="outline"
                  className="w-full border-primary-300 text-primary-700 hover:bg-primary-50 dark:border-primary-700 dark:text-primary-500 dark:hover:bg-primary-950/50"
                  size="lg"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export to Print
                </Button>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="lg:col-span-1 bg-card/80 backdrop-blur-sm border-border">
              <CardHeader className="bg-muted/50 rounded-t-lg border-b border-border">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Settings className="h-5 w-5 text-primary-600 dark:text-primary-500" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="symbology" className="text-sm font-medium mb-2 block text-foreground">
                    Symbology
                  </Label>
                  <Select value={symbology} onValueChange={setSymbology}>
                    <SelectTrigger className="bg-background/50 border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="code128">Code 128</SelectItem>
                      <SelectItem value="datamatrix">Data Matrix</SelectItem>
                      <SelectItem value="gs1datamatrix">GS1 Data Matrix</SelectItem>
                      <SelectItem value="pdf417">PDF417</SelectItem>
                      <SelectItem value="qrcode">QR Code</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="show-text" checked={showText} onCheckedChange={setShowText} />
                  <Label htmlFor="show-text" className="text-sm font-medium text-foreground">
                    Show text below barcode
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Barcodes Display */}
          {barcodes.length > 0 && (
            <Card className="bg-card/80 backdrop-blur-sm border-border">
              <CardHeader className="bg-muted/50 rounded-t-lg border-b border-border">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <BarChart3 className="h-5 w-5 text-primary-600 dark:text-primary-500" />
                  Generated Barcodes ({barcodes.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {barcodes.map((barcode, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                      <img
                        src={barcode || "/placeholder.svg"}
                        alt={`Barcode ${index + 1}`}
                        className="w-full h-auto max-h-32 object-contain"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t border-border">
            <p className="text-muted-foreground">
              Made with lazy <span className="text-error">❤️</span> by Javier Huamanchumo Arauco
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
