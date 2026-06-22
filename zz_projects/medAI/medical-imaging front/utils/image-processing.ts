// Image processing utilities

/**
 * Converts an image to the format required by the models
 * @param imageData The image data to convert
 * @returns Processed image data ready for model inference
 */
export async function preprocessImage(imageData: string | Blob): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      // Create a canvas to draw the image
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        reject(new Error("Failed to get canvas context"))
        return
      }

      // Resize to model input dimensions
      canvas.width = 256
      canvas.height = 256

      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Get the image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      resolve(imageData)
    }

    img.onerror = () => {
      reject(new Error("Failed to load image"))
    }

    // Set the source of the image
    if (typeof imageData === "string") {
      img.src = imageData
    } else {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string
        }
      }
      reader.readAsDataURL(imageData)
    }
  })
}

/**
 * Converts a segmentation mask to an overlay image
 * @param maskData The segmentation mask data
 * @param width The width of the mask
 * @param height The height of the mask
 * @param color The color to use for the mask (default: red)
 * @returns A data URL for the overlay image
 */
export function createOverlayFromMask(
  maskData: Uint8Array,
  width = 256,
  height = 256,
  color: { r: number; g: number; b: number; a: number } = { r: 255, g: 0, b: 0, a: 0.5 },
): string {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    throw new Error("Failed to get canvas context")
  }

  // Create an ImageData object
  const imageData = ctx.createImageData(width, height)
  const data = imageData.data

  // Fill the ImageData with the mask
  for (let i = 0; i < maskData.length; i++) {
    const pixelIndex = i * 4
    if (maskData[i] > 0) {
      data[pixelIndex] = color.r // R
      data[pixelIndex + 1] = color.g // G
      data[pixelIndex + 2] = color.b // B
      data[pixelIndex + 3] = Math.floor(color.a * 255) // A
    } else {
      data[pixelIndex + 3] = 0 // Transparent
    }
  }

  // Put the ImageData on the canvas
  ctx.putImageData(imageData, 0, 0)

  // Return the data URL
  return canvas.toDataURL("image/png")
}

