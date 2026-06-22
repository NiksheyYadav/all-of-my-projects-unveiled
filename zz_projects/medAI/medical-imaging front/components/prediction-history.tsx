"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, Trash2 } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"

interface PredictionHistoryProps {
  predictions?: any[]
  limit?: number
}

export function PredictionHistory({ predictions = [], limit }: PredictionHistoryProps) {
  const [localPredictions, setLocalPredictions] = useState(predictions)
  const displayPredictions = limit ? localPredictions.slice(0, limit) : localPredictions

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  const handleDelete = (id: string) => {
    // Remove from local state
    const updated = localPredictions.filter((p) => p.id !== id)
    setLocalPredictions(updated)

    // Update localStorage
    localStorage.setItem("predictions", JSON.stringify(updated))

    toast({
      title: "Entry Deleted",
      description: "The prediction has been removed from your history.",
    })
  }

  if (displayPredictions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No prediction history available.</p>
        <p className="text-sm mt-2">Upload and analyze medical images to see your history here.</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Result</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayPredictions.map((prediction) => (
            <TableRow key={prediction.id}>
              <TableCell>{formatDate(prediction.date)}</TableCell>
              <TableCell>{prediction.type}</TableCell>
              <TableCell>{prediction.category}</TableCell>
              <TableCell>
                <Badge variant={getResultBadgeVariant(prediction.result)}>{prediction.result}</Badge>
              </TableCell>
              <TableCell>{(prediction.confidence * 100).toFixed(1)}%</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/analysis/result?id=${prediction.id}`}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete prediction</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this prediction? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(prediction.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

