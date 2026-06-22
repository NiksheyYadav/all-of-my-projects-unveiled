"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, FileX, Upload, Loader2, X, Scan } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth/auth-provider"

export default function UploadPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("mri")
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    scanType: "",
    bodyPart: "",
    analysisType: "classification",
    notes: "",
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // Create a preview URL
    const reader = new FileReader()
    reader.onload = () => {
      setUploadedImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return

    // Create a preview URL
    const reader = new FileReader()
    reader.onload = () => {
      setUploadedImage(reader.result as string)
    }
    reader.readAsDataURL(file)

    setIsUploading(true)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleRemoveImage = () => {
    setUploadedImage(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, analysisType: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadedImage) {
      toast({
        title: "Image Required",
        description: "Please upload an image to analyze.",
        variant: "destructive",
      })
      return
    }

    if (!formData.patientId || !formData.scanType || !formData.bodyPart) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Create a mock result
      const result = {
        id: `result_${Date.now()}`,
        date: new Date().toISOString(),
        type: activeTab.toUpperCase(),
        category: formData.bodyPart,
        result: activeTab === "mri" ? "Tumor" : activeTab === "ct" ? "Mass" : "Fracture",
        confidence: 0.95 + Math.random() * 0.04,
        imageUrl: uploadedImage,
        segmentationUrl: "/placeholder.svg?height=400&width=400",
        patientId: formData.patientId,
        patientName: formData.patientName,
        scanType: formData.scanType,
        analysisType: formData.analysisType,
        notes: formData.notes,
        uploadedBy: user?.id,
        uploadedByName: user?.name,
      }

      // Save to localStorage
      const storedPredictions = localStorage.getItem("predictions") || "[]"
      const predictions = JSON.parse(storedPredictions)
      predictions.unshift(result)
      localStorage.setItem("predictions", JSON.stringify(predictions))

      // Reset form
      setUploadedImage(null)
      setUploadProgress(0)
      setFormData({
        patientId: "",
        patientName: "",
        scanType: "",
        bodyPart: "",
        analysisType: "classification",
        notes: "",
      })

      // Show success message
      toast({
        title: "Analysis Complete",
        description: "Your image has been analyzed successfully.",
      })

      // Redirect to results page
      router.push(`/analysis/result?id=${result.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during analysis. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Medical Image</h1>
        <p className="text-muted-foreground">Upload and analyze medical images using our AI-powered platform</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Image Upload</CardTitle>
          <CardDescription>Upload MRI, CT, or X-Ray images for analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="mri" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                MRI
              </TabsTrigger>
              <TabsTrigger value="ct" className="flex items-center gap-2">
                <Scan className="h-4 w-4" />
                CT Scan
              </TabsTrigger>
              <TabsTrigger value="xray" className="flex items-center gap-2">
                <FileX className="h-4 w-4" />
                X-Ray
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input
                    id="patientId"
                    name="patientId"
                    placeholder="Enter patient ID"
                    value={formData.patientId}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    name="patientName"
                    placeholder="Enter patient name"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scanType">Scan Type</Label>
                  <Select value={formData.scanType} onValueChange={(value) => handleSelectChange("scanType", value)}>
                    <SelectTrigger id="scanType">
                      <SelectValue placeholder="Select scan type" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeTab === "mri" ? (
                        <>
                          <SelectItem value="t1">T1-weighted</SelectItem>
                          <SelectItem value="t2">T2-weighted</SelectItem>
                          <SelectItem value="flair">FLAIR</SelectItem>
                          <SelectItem value="dwi">Diffusion-weighted</SelectItem>
                        </>
                      ) : activeTab === "ct" ? (
                        <>
                          <SelectItem value="noncontrast">Non-contrast</SelectItem>
                          <SelectItem value="contrast">Contrast-enhanced</SelectItem>
                          <SelectItem value="angiography">CT Angiography</SelectItem>
                          <SelectItem value="highres">High Resolution CT</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="contrast">Contrast-enhanced</SelectItem>
                          <SelectItem value="digital">Digital Radiography</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bodyPart">Body Part</Label>
                  <Select value={formData.bodyPart} onValueChange={(value) => handleSelectChange("bodyPart", value)}>
                    <SelectTrigger id="bodyPart">
                      <SelectValue placeholder="Select body part" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeTab === "mri" ? (
                        <>
                          <SelectItem value="brain">Brain</SelectItem>
                          <SelectItem value="spine">Spine</SelectItem>
                          <SelectItem value="knee">Knee</SelectItem>
                          <SelectItem value="shoulder">Shoulder</SelectItem>
                          <SelectItem value="abdomen">Abdomen</SelectItem>
                        </>
                      ) : activeTab === "ct" ? (
                        <>
                          <SelectItem value="head">Head</SelectItem>
                          <SelectItem value="chest">Chest</SelectItem>
                          <SelectItem value="abdomen">Abdomen</SelectItem>
                          <SelectItem value="pelvis">Pelvis</SelectItem>
                          <SelectItem value="spine">Spine</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="chest">Chest</SelectItem>
                          <SelectItem value="hand">Hand</SelectItem>
                          <SelectItem value="wrist">Wrist</SelectItem>
                          <SelectItem value="ankle">Ankle</SelectItem>
                          <SelectItem value="foot">Foot</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Analysis Type</Label>
                  <RadioGroup
                    value={formData.analysisType}
                    onValueChange={handleRadioChange}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="classification" id="classification" />
                      <Label htmlFor="classification">Classification</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="segmentation" id="segmentation" />
                      <Label htmlFor="segmentation">Segmentation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="both" id="both" />
                      <Label htmlFor="both">Both</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <textarea
                    id="notes"
                    name="notes"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Add any additional notes or observations"
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <Label className="block mb-2">Upload Image</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 text-center ${
                    uploadedImage ? "border-primary" : "border-muted-foreground/25"
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {!uploadedImage ? (
                    <div className="py-8">
                      <div className="flex flex-col items-center">
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activeTab === "mri"
                            ? "DICOM, NIfTI, or PNG/JPG"
                            : activeTab === "ct"
                              ? "DICOM, NIfTI, or PNG/JPG"
                              : "DICOM, PNG, or JPG"}
                        </p>
                        <Input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          accept=".dcm,.nii,.nii.gz,.png,.jpg,.jpeg"
                          onChange={handleFileChange}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Select File
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-0 right-0 rounded-full bg-background"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <div className="flex justify-center py-2">
                        <div className="relative w-48 h-48">
                          <Image
                            src={uploadedImage || "/placeholder.svg"}
                            alt="Uploaded medical image"
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                      {isUploading && (
                        <div className="w-full bg-muted rounded-full h-2.5 mt-2">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={!uploadedImage || isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Analyze Image"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

