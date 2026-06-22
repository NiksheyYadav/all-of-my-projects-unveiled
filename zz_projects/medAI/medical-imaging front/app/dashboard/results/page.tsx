"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, FileText } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/components/auth/auth-provider"

export default function ResultsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("all")
  const [predictions, setPredictions] = useState<any[]>([])

  // Load predictions from localStorage on mount
  useEffect(() => {
    const storedPredictions = localStorage.getItem("predictions")
    if (storedPredictions) {
      const parsedPredictions = JSON.parse(storedPredictions)
      setPredictions(parsedPredictions)
    }
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const getResultBadgeVariant = (result: string) => {
    switch (result.toLowerCase()) {
      case "normal":
        return "outline"
      case "abnormal":
        return "secondary"
      case "tumor":
      case "mass":
      case "fracture":
        return "destructive"
      default:
        return "default"
    }
  }

  const filteredPredictions = (type: string) => {
    if (type === "all") return predictions
    return predictions.filter((p) => p.type.toLowerCase() === type.toLowerCase())
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Results</h1>
        <p className="text-muted-foreground">View and manage your medical imaging results</p>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Results</TabsTrigger>
          <TabsTrigger value="mri">MRI</TabsTrigger>
          <TabsTrigger value="ct">CT Scan</TabsTrigger>
          <TabsTrigger value="xray">X-Ray</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{activeTab === "all" ? "All Results" : `${activeTab.toUpperCase()} Results`}</CardTitle>
              <CardDescription>
                {activeTab === "all"
                  ? "All your medical imaging results"
                  : `Your ${activeTab.toUpperCase()} scan results`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredPredictions(activeTab).length > 0 ? (
                <div className="space-y-6">
                  {filteredPredictions(activeTab).map((result) => (
                    <div
                      key={result.id}
                      className="flex flex-col md:flex-row gap-4 border-b pb-6 last:border-0 last:pb-0"
                    >
                      <div className="md:w-1/4">
                        <div className="relative w-full aspect-square rounded-md overflow-hidden border">
                          <Image
                            src={result.imageUrl || "/placeholder.svg?height=200&width=200"}
                            alt={`${result.type} scan`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div className="md:w-3/4 space-y-4">
                        <div>
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <h3 className="text-lg font-medium">
                              {result.type} - {result.category}
                            </h3>
                            <Badge variant={getResultBadgeVariant(result.result)} className="md:ml-2 w-fit">
                              {result.result}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{formatDate(result.date)}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Patient ID:</span>
                            <span className="ml-2 font-medium">{result.patientId || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Scan Type:</span>
                            <span className="ml-2 font-medium">{result.scanType || "Standard"}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Confidence:</span>
                            <span className="ml-2 font-medium">{(result.confidence * 100).toFixed(1)}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Analysis Type:</span>
                            <span className="ml-2 font-medium capitalize">
                              {result.analysisType || "Classification"}
                            </span>
                          </div>
                        </div>

                        {result.notes && (
                          <div>
                            <p className="text-sm font-medium">Notes:</p>
                            <p className="text-sm text-muted-foreground">{result.notes}</p>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          <Button asChild>
                            <Link href={`/dashboard/analysis/result?id=${result.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </Button>
                          <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                          <Button variant="outline">
                            <FileText className="mr-2 h-4 w-4" />
                            Report
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No results found.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activeTab === "all"
                      ? "Upload and analyze medical images to see your results here."
                      : `Upload and analyze ${activeTab.toUpperCase()} scans to see your results here.`}
                  </p>

                  <Button asChild className="mt-4">
                    <Link href="/dashboard/upload">Upload Image</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

