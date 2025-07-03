"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Camera, CameraOff, CheckCircle, AlertCircle, Keyboard, QrCode } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QRScannerProps {
  onScan: (data: string) => void
  title?: string
  description?: string
  expectedFormat?: string
}

export function QRScanner({
  onScan,
  title = "QR Code Scanner",
  description = "Scan a QR code or enter manually",
  expectedFormat = "SMS-USER-XXXX",
}: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [manualEntry, setManualEntry] = useState("")
  const [lastScan, setLastScan] = useState<string | null>(null)
  const [scanHistory, setScanHistory] = useState<Array<{ code: string; time: string }>>([])
  const [error, setError] = useState<string | null>(null)
  const [showManualEntry, setShowManualEntry] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const { toast } = useToast()

  const startCamera = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsScanning(true)
      }
    } catch (err) {
      setError("Camera access denied or not available. Please use manual entry.")
      console.error("Camera error:", err)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }

  const handleScan = (scannedData: string) => {
    if (scannedData && scannedData !== lastScan) {
      setLastScan(scannedData)
      const scanTime = new Date().toLocaleTimeString()
      setScanHistory((prev) => [{ code: scannedData, time: scanTime }, ...prev.slice(0, 4)])

      toast({
        title: "QR Code Scanned",
        description: `Code: ${scannedData}`,
      })

      onScan(scannedData)
      stopCamera()
    }
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualEntry.trim()) {
      handleScan(manualEntry.trim())
      setManualEntry("")
      setShowManualEntry(false)
    }
  }

  // Simulate QR code detection (in real app, use a QR code library)
  const simulateQRDetection = () => {
    const mockCodes = ["SMS-USER-1001", "SMS-USER-1002", "SMS-MEAL-BREAKFAST-001", "SMS-WELFARE-CHECK-001"]
    const randomCode = mockCodes[Math.floor(Math.random() * mockCodes.length)]
    handleScan(randomCode)
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
          {expectedFormat && (
            <Badge variant="outline" className="w-fit">
              Expected format: {expectedFormat}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Camera View */}
          <div className="relative">
            {isScanning ? (
              <div className="relative">
                <video ref={videoRef} autoPlay playsInline className="w-full h-64 bg-black rounded-lg object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-white border-dashed rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                      Position QR code here
                    </span>
                  </div>
                </div>
                <div className="absolute top-4 right-4 space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={simulateQRDetection}
                    className="bg-white bg-opacity-90"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Simulate Scan
                  </Button>
                  <Button size="sm" variant="destructive" onClick={stopCamera} className="bg-red-600 bg-opacity-90">
                    <CameraOff className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">Camera not active</p>
                  <div className="space-x-2">
                    <Button onClick={startCamera}>
                      <Camera className="h-4 w-4 mr-2" />
                      Start Camera
                    </Button>
                    <Button variant="outline" onClick={() => setShowManualEntry(!showManualEntry)}>
                      <Keyboard className="h-4 w-4 mr-2" />
                      Manual Entry
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Manual Entry */}
          {showManualEntry && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Manual Entry</CardTitle>
                <CardDescription>Enter the code manually if camera scanning is not available</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="manual-code">Code</Label>
                    <Input
                      id="manual-code"
                      value={manualEntry}
                      onChange={(e) => setManualEntry(e.target.value)}
                      placeholder={expectedFormat}
                      className="font-mono"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={!manualEntry.trim()}>
                      Submit Code
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowManualEntry(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Scan History */}
          {scanHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Scans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {scanHistory.map((scan, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <code className="text-sm">{scan.code}</code>
                      <span className="text-xs text-muted-foreground">{scan.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
