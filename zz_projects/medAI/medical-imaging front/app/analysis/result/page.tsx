"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft } from "lucide-react"
import { ImageViewer } from "@/components/image-viewer"
import { ReportGenerator } from "@/components/report-generator"

export default function AnalysisResultPage() {
  const searchParams = useSearchParams()
  const resultId = searchParams.get("id")
  const [activeTab, setActiveTab] = useState("overview")
  const [resultData, setResultData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load result data from localStorage
    const loadResult = () => {
      setLoading(true)

      try {
        const storedPredictions = localStorage.getItem("predictions")
        if (storedPredictions) {
          const predictions = JSON.parse(storedPredictions)
          const result = predictions.find((p: any) => p.id === resultId)

          if (result) {
            // Enhance the result with additional data for display
            setResultData({
              ...result,
              segmentationImage: "/placeholder.svg?height=400&width=400",
              classDistribution: [
                { class: result.result, probability: result.confidence },
                { class: "Normal", probability: (1 - result.confidence) * 0.8 },
                { class: "Other", probability: (1 - result.confidence) * 0.2 },
              ],
              segmentationMetrics: {
                diceCoefficient: 0.92,
                sensitivity: 0.94,
                specificity: 0.98,
              },
            })
          }
        }
      } catch (error) {
        console.error("Error loading result data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (resultId) {
      loadResult()
    }
  }, [resultId])

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading analysis results...</p>
        </div>
      </div>
    )
  }

  if (!resultData) {
    return (
      <div className="container py-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Result Not Found</h1>
          <p className="text-muted-foreground">The analysis result you're looking for could not be found.</p>
          <Button className="mt-6" asChild>
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analysis Result</h1>
            <p className="text-muted-foreground">{new Date(resultData.date).toLocaleString()}</p>
          </div>
          <ReportGenerator resultId={resultData.id} resultData={resultData} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Prediction</CardTitle>
              <CardDescription>
                {resultData.type} scan of {resultData.category}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Result</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="destructive" className="text-lg py-1 px-3">
                        {resultData.result}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-muted-foreground">Confidence</p>
                    <p className="text-2xl font-bold">{(resultData.confidence * 100).toFixed(1)}%</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Class Distribution</p>
                  {resultData.classDistribution.map((item: any, index: number) => (
                    <div key={index} className="mb-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{item.class}</span>
                        <span className="text-sm font-medium">{(item.probability * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={item.probability * 100} className="h-2" />
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Patient Information</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Patient ID:</span>
                      <span className="ml-2 font-medium">{resultData.patientId || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Scan Type:</span>
                      <span className="ml-2 font-medium">{resultData.scanType || "Standard"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Image Analysis</CardTitle>
              <CardDescription>Uploaded medical scan</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageViewer
                originalImage={resultData.imageUrl || "/placeholder.svg?height=400&width=400"}
                segmentationImage={resultData.segmentationUrl}
                altText={`${resultData.type} scan of ${resultData.category}`}
              />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="segmentation">Segmentation</TabsTrigger>
            <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Summary</CardTitle>
                <CardDescription>Key findings and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Key Findings</h3>
                    <ul className="mt-2 space-y-2 list-disc pl-5">
                      <li>
                        Detected abnormal tissue consistent with {resultData.result.toLowerCase()} characteristics
                      </li>
                      <li>Located in the {resultData.category.toLowerCase()} region</li>
                      <li>Approximate size: 2.3 cm x 1.8 cm</li>
                      <li>Well-defined borders with heterogeneous enhancement</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Recommendations</h3>
                    <ul className="mt-2 space-y-2 list-disc pl-5">
                      <li>Clinical correlation recommended</li>
                      <li>Consider follow-up with contrast-enhanced {resultData.type}</li>
                      <li>Specialist consultation advised</li>
                      <li>Additional histopathological confirmation may be necessary</li>
                    </ul>
                  </div>

                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm font-medium">Note</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      This analysis is provided as a diagnostic aid and should be reviewed by a qualified healthcare
                      professional. The results should be interpreted in the context of the patient's clinical
                      presentation and medical history.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="segmentation" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Segmentation Results</CardTitle>
                <CardDescription>Visualization of detected regions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium mb-2">Segmentation Overlay</p>
                    <ImageViewer
                      originalImage={resultData.imageUrl || "/placeholder.svg?height=400&width=400"}
                      segmentationImage={resultData.segmentationUrl}
                      altText={`Segmentation of ${resultData.type} scan`}
                      showControls={false}
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-4">Segmentation Metrics</p>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Dice Coefficient</span>
                          <span className="text-sm font-medium">
                            {resultData.segmentationMetrics.diceCoefficient.toFixed(2)}
                          </span>
                        </div>
                        <Progress value={resultData.segmentationMetrics.diceCoefficient * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Sensitivity</span>
                          <span className="text-sm font-medium">
                            {resultData.segmentationMetrics.sensitivity.toFixed(2)}
                          </span>
                        </div>
                        <Progress value={resultData.segmentationMetrics.sensitivity * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Specificity</span>
                          <span className="text-sm font-medium">
                            {resultData.segmentationMetrics.specificity.toFixed(2)}
                          </span>
                        </div>
                        <Progress value={resultData.segmentationMetrics.specificity * 100} className="h-2" />
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-2">Region Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        The segmentation model has identified an area of abnormal tissue with high confidence. The
                        region shows clear boundaries and characteristic features consistent with the predicted
                        classification.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Analysis</CardTitle>
                <CardDescription>Comprehensive analysis results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Technical Details</h3>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Model</p>
                        <p className="text-sm text-muted-foreground">ResNet50 + U-Net</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Analysis Type</p>
                        <p className="text-sm text-muted-foreground">
                          {resultData.analysisType || "Classification + Segmentation"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Processing Time</p>
                        <p className="text-sm text-muted-foreground">3.2 seconds</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Image Resolution</p>
                        <p className="text-sm text-muted-foreground">512 x 512 px</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Radiological Features</h3>
                    <table className="w-full mt-2">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 font-medium text-sm">Feature</th>
                          <th className="text-left py-2 font-medium text-sm">Description</th>
                          <th className="text-left py-2 font-medium text-sm">Significance</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 text-sm">Density</td>
                          <td className="py-2 text-sm">Heterogeneous</td>
                          <td className="py-2 text-sm">High</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 text-sm">Margins</td>
                          <td className="py-2 text-sm">Well-defined</td>
                          <td className="py-2 text-sm">Medium</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 text-sm">Enhancement</td>
                          <td className="py-2 text-sm">Ring-like</td>
                          <td className="py-2 text-sm">High</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 text-sm">Surrounding Edema</td>
                          <td className="py-2 text-sm">Present</td>
                          <td className="py-2 text-sm">High</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-sm">Mass Effect</td>
                          <td className="py-2 text-sm">Mild</td>
                          <td className="py-2 text-sm">Medium</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Differential Diagnosis</h3>
                    <ul className="mt-2 space-y-2 list-disc pl-5">
                      <li>
                        <span className="font-medium">{resultData.result}</span>
                        <span className="text-sm text-muted-foreground ml-2">Probability: High</span>
                      </li>
                      <li>
                        <span className="font-medium">Secondary Finding</span>
                        <span className="text-sm text-muted-foreground ml-2">Probability: Medium</span>
                      </li>
                      <li>
                        <span className="font-medium">Alternative Diagnosis</span>
                        <span className="text-sm text-muted-foreground ml-2">Probability: Low</span>
                      </li>
                      <li>
                        <span className="font-medium">Benign Variant</span>
                        <span className="text-sm text-muted-foreground ml-2">Probability: Very Low</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

