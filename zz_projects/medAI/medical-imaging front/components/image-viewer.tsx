"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Maximize2, ZoomIn, ZoomOut, RotateCw, Layers, Download } from "lucide-react"

interface ImageViewerProps {
  originalImage: string
  segmentationImage?: string
  altText?: string
  showControls?: boolean
}

export function ImageViewer({
  originalImage,
  segmentationImage,
  altText = "Medical scan image",
  showControls = true,
}: ImageViewerProps) {
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [overlayOpacity, setOverlayOpacity] = useState(70)
  const [activeTab, setActiveTab] = useState("original")

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50))
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleDownload = () => {
    // In a real app, this would download the current view
    const link = document.createElement("a")
    link.href = activeTab === "original" ? originalImage : segmentationImage || originalImage
    link.download = `medical-image-${activeTab}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-2">
      <div className="relative aspect-square w-full border rounded-md overflow-hidden bg-black/5">
        {activeTab === "original" && (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transition: "transform 0.2s ease-out",
            }}
          >
            <Image src={originalImage || "/placeholder.svg"} alt={altText} fill className="object-contain" />
          </div>
        )}

        {activeTab === "segmentation" && segmentationImage && (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transition: "transform 0.2s ease-out",
            }}
          >
            <Image
              src={segmentationImage || "/placeholder.svg"}
              alt={`Segmentation of ${altText}`}
              fill
              className="object-contain"
            />
          </div>
        )}

        {activeTab === "overlay" && segmentationImage && (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transition: "transform 0.2s ease-out",
            }}
          >
            <div className="relative w-full h-full">
              <Image src={originalImage || "/placeholder.svg"} alt={altText} fill className="object-contain" />
              <Image
                src={segmentationImage || "/placeholder.svg"}
                alt={`Segmentation of ${altText}`}
                fill
                className="object-contain"
                style={{ opacity: overlayOpacity / 100 }}
              />
            </div>
          </div>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl w-full h-[90vh]">
            <DialogHeader>
              <DialogTitle>Image Viewer</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col h-full">
              <Tabs defaultValue="original" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="original">Original</TabsTrigger>
                  {segmentationImage && <TabsTrigger value="segmentation">Segmentation</TabsTrigger>}
                  {segmentationImage && <TabsTrigger value="overlay">Overlay</TabsTrigger>}
                </TabsList>

                <TabsContent value="original" className="flex-1 h-[calc(90vh-10rem)]">
                  <div className="relative w-full h-full flex items-center justify-center bg-black/5 rounded-md">
                    <div
                      style={{
                        transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                        transition: "transform 0.2s ease-out",
                      }}
                    >
                      <Image
                        src={originalImage || "/placeholder.svg"}
                        alt={altText}
                        width={800}
                        height={800}
                        className="object-contain max-h-[calc(90vh-12rem)]"
                      />
                    </div>
                  </div>
                </TabsContent>

                {segmentationImage && (
                  <TabsContent value="segmentation" className="flex-1 h-[calc(90vh-10rem)]">
                    <div className="relative w-full h-full flex items-center justify-center bg-black/5 rounded-md">
                      <div
                        style={{
                          transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                          transition: "transform 0.2s ease-out",
                        }}
                      >
                        <Image
                          src={segmentationImage || "/placeholder.svg"}
                          alt={`Segmentation of ${altText}`}
                          width={800}
                          height={800}
                          className="object-contain max-h-[calc(90vh-12rem)]"
                        />
                      </div>
                    </div>
                  </TabsContent>
                )}

                {segmentationImage && (
                  <TabsContent value="overlay" className="flex-1 h-[calc(90vh-10rem)]">
                    <div className="relative w-full h-full flex items-center justify-center bg-black/5 rounded-md">
                      <div
                        style={{
                          transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                          transition: "transform 0.2s ease-out",
                        }}
                        className="relative"
                      >
                        <Image
                          src={originalImage || "/placeholder.svg"}
                          alt={altText}
                          width={800}
                          height={800}
                          className="object-contain max-h-[calc(90vh-12rem)]"
                        />
                        <div className="absolute inset-0">
                          <Image
                            src={segmentationImage || "/placeholder.svg"}
                            alt={`Segmentation of ${altText}`}
                            width={800}
                            height={800}
                            className="object-contain max-h-[calc(90vh-12rem)]"
                            style={{ opacity: overlayOpacity / 100 }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 px-4">
                      <div className="flex items-center gap-4">
                        <Layers className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium w-32">Overlay Opacity</span>
                        <Slider
                          value={[overlayOpacity]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={(value) => setOverlayOpacity(value[0])}
                          className="flex-1"
                        />
                        <span className="text-sm font-medium w-10">{overlayOpacity}%</span>
                      </div>
                    </div>
                  </TabsContent>
                )}
              </Tabs>

              <div className="flex justify-between items-center mt-4 px-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={handleZoomOut}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <div className="w-20 text-center text-sm">{zoom}%</div>
                  <Button variant="outline" size="icon" onClick={handleZoomIn}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleRotate}>
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </div>

                <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
                  <Download className="h-4 w-4" />
                  Download Image
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {showControls && (
        <div>
          {segmentationImage && (
            <Tabs defaultValue="original" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="original">Original</TabsTrigger>
                <TabsTrigger value="segmentation">Segmentation</TabsTrigger>
                <TabsTrigger value="overlay">Overlay</TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <div className="w-12 text-center text-xs">{zoom}%</div>
              <Button variant="ghost" size="icon" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleRotate}>
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>

            {activeTab === "overlay" && segmentationImage && (
              <div className="flex items-center gap-2 flex-1 max-w-[200px]">
                <Layers className="h-3 w-3 text-muted-foreground" />
                <Slider
                  value={[overlayOpacity]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setOverlayOpacity(value[0])}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

