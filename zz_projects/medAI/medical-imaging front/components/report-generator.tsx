"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Download, FileText, Share2, Copy, Mail } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ReportGeneratorProps {
  resultId: string
  resultData: any
}

export function ReportGenerator({ resultId, resultData }: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [shareEmail, setShareEmail] = useState("")
  const [includeImages, setIncludeImages] = useState(true)
  const [includeMetrics, setIncludeMetrics] = useState(true)

  const handleGeneratePDF = async () => {
    setIsGenerating(true)

    try {
      // In a real app, this would call an API to generate a PDF
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate download
      const link = document.createElement("a")
      link.href = "#"
      link.download = `medical-report-${resultId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Report Generated",
        description: "Your PDF report has been downloaded successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateCSV = async () => {
    setIsGenerating(true)

    try {
      // In a real app, this would call an API to generate a CSV
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate download
      const link = document.createElement("a")
      link.href = "#"
      link.download = `medical-data-${resultId}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Data Exported",
        description: "Your CSV data has been downloaded successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export CSV data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyLink = () => {
    // In a real app, this would generate a shareable link
    const shareableLink = `https://medvision.ai/shared/result/${resultId}`
    navigator.clipboard.writeText(shareableLink)

    toast({
      title: "Link Copied",
      description: "Shareable link has been copied to clipboard.",
    })
  }

  const handleShareViaEmail = async () => {
    if (!shareEmail) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to share the report.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // In a real app, this would call an API to send the email
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Report Shared",
        description: `Report has been shared with ${shareEmail} successfully.`,
      })

      setShareDialogOpen(false)
      setShareEmail("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleGeneratePDF} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
            Download as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleGenerateCSV} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
            Export Data as CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Analysis Report</DialogTitle>
            <DialogDescription>Share this analysis report with colleagues or patients</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="shareLink">Shareable Link</Label>
              <div className="flex gap-2">
                <Input
                  id="shareLink"
                  value={`https://medvision.ai/shared/result/${resultId}`}
                  readOnly
                  className="flex-1"
                />
                <Button variant="outline" size="icon" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="shareEmail">Share via Email</Label>
              <Input
                id="shareEmail"
                type="email"
                placeholder="colleague@hospital.com"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Report Options</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeImages"
                  checked={includeImages}
                  onCheckedChange={(checked) => setIncludeImages(!!checked)}
                />
                <label
                  htmlFor="includeImages"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Include images
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeMetrics"
                  checked={includeMetrics}
                  onCheckedChange={(checked) => setIncludeMetrics(!!checked)}
                />
                <label
                  htmlFor="includeMetrics"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Include detailed metrics
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleShareViaEmail} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

