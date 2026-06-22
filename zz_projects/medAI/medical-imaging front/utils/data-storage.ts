// Data storage utilities

export interface PredictionResult {
  id: string
  date: string
  type: string
  category: string
  result: string
  confidence: number
  imageUrl: string
  segmentationUrl?: string
  patientId: string
  patientName?: string
  scanType: string
  analysisType: string
  notes?: string
  uploadedBy: string
  uploadedByName?: string
}

/**
 * Saves a prediction result to localStorage
 * @param result The prediction result to save
 */
export function savePrediction(result: PredictionResult): void {
  try {
    // Get existing predictions
    const storedPredictions = localStorage.getItem("predictions") || "[]"
    const predictions = JSON.parse(storedPredictions)

    // Add new prediction at the beginning
    predictions.unshift(result)

    // Save back to localStorage
    localStorage.setItem("predictions", JSON.stringify(predictions))
  } catch (error) {
    console.error("Failed to save prediction:", error)
    throw error
  }
}

/**
 * Gets all predictions from localStorage
 * @param userId Optional user ID to filter by
 * @param patientId Optional patient ID to filter by
 * @returns Array of prediction results
 */
export function getPredictions(userId?: string, patientId?: string): PredictionResult[] {
  try {
    // Get predictions from localStorage
    const storedPredictions = localStorage.getItem("predictions") || "[]"
    const predictions = JSON.parse(storedPredictions)

    // Apply filters if provided
    let filteredPredictions = predictions

    if (userId) {
      filteredPredictions = filteredPredictions.filter((p: PredictionResult) => p.uploadedBy === userId)
    }

    if (patientId) {
      filteredPredictions = filteredPredictions.filter((p: PredictionResult) => p.patientId === patientId)
    }

    return filteredPredictions
  } catch (error) {
    console.error("Failed to get predictions:", error)
    return []
  }
}

/**
 * Gets a single prediction by ID
 * @param id The prediction ID
 * @returns The prediction result or null if not found
 */
export function getPredictionById(id: string): PredictionResult | null {
  try {
    // Get predictions from localStorage
    const storedPredictions = localStorage.getItem("predictions") || "[]"
    const predictions = JSON.parse(storedPredictions)

    // Find prediction by ID
    const prediction = predictions.find((p: PredictionResult) => p.id === id)

    return prediction || null
  } catch (error) {
    console.error("Failed to get prediction:", error)
    return null
  }
}

/**
 * Deletes a prediction by ID
 * @param id The prediction ID
 * @returns True if successful, false otherwise
 */
export function deletePrediction(id: string): boolean {
  try {
    // Get predictions from localStorage
    const storedPredictions = localStorage.getItem("predictions") || "[]"
    const predictions = JSON.parse(storedPredictions)

    // Filter out the prediction to delete
    const updatedPredictions = predictions.filter((p: PredictionResult) => p.id !== id)

    // Save back to localStorage
    localStorage.setItem("predictions", JSON.stringify(updatedPredictions))

    return true
  } catch (error) {
    console.error("Failed to delete prediction:", error)
    return false
  }
}

