// Upload Module
document.addEventListener("DOMContentLoaded", () => {
  // Setup image type selector
  setupImageTypeSelector()

  // Setup upload dropzone
  setupUploadDropzone()

  // Setup upload form
  const uploadForm = document.getElementById("uploadForm")
  if (uploadForm) {
    uploadForm.addEventListener("submit", handleUpload)
  }

  // Setup select file button
  const selectFileBtn = document.getElementById("selectFileBtn")
  if (selectFileBtn) {
    selectFileBtn.addEventListener("click", () => {
      document.getElementById("imageInput").click()
    })
  }

  // Setup remove file button
  const removeFileBtn = document.getElementById("removeFileBtn")
  if (removeFileBtn) {
    removeFileBtn.addEventListener("click", removeSelectedFile)
  }
})

/**
 * Setup image type selector
 */
function setupImageTypeSelector() {
  const imageTypeButtons = document.querySelectorAll(".image-type-btn")

  imageTypeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      imageTypeButtons.forEach((btn) => btn.classList.remove("active"))

      // Add active class to clicked button
      button.classList.add("active")

      // Update form based on selected image type
      updateFormForImageType(button.getAttribute("data-type"))
    })
  })
}

/**
 * Update form fields based on selected image type
 * @param {string} imageType - Selected image type (mri, ct, xray)
 */
function updateFormForImageType(imageType) {
  const scanTypeSelect = document.getElementById("scanType")
  const bodyPartSelect = document.getElementById("bodyPart")

  // Clear existing options
  scanTypeSelect.innerHTML = '<option value="">Select scan type</option>'

  // Add scan type options based on image type
  if (imageType === "mri") {
    addOption(scanTypeSelect, "t1", "T1")
    addOption(scanTypeSelect, "t2", "T2")
    addOption(scanTypeSelect, "flair", "FLAIR")
    addOption(scanTypeSelect, "dwi", "DWI")
  } else if (imageType === "ct") {
    addOption(scanTypeSelect, "non-contrast", "Non-contrast")
    addOption(scanTypeSelect, "contrast", "Contrast-enhanced")
    addOption(scanTypeSelect, "angiography", "CT Angiography")
    addOption(scanTypeSelect, "perfusion", "CT Perfusion")
  } else if (imageType === "xray") {
    addOption(scanTypeSelect, "ap", "Anteroposterior (AP)")
    addOption(scanTypeSelect, "lateral", "Lateral")
    addOption(scanTypeSelect, "oblique", "Oblique")
    addOption(scanTypeSelect, "panoramic", "Panoramic")
  }
}

/**
 * Add option to select element
 * @param {HTMLSelectElement} selectElement - Select element
 * @param {string} value - Option value
 * @param {string} text - Option text
 */
function addOption(selectElement, value, text) {
  const option = document.createElement("option")
  option.value = value
  option.textContent = text
  selectElement.appendChild(option)
}

/**
 * Setup upload dropzone
 */
function setupUploadDropzone() {
  const dropzone = document.getElementById("uploadDropzone")
  const fileInput = document.getElementById("imageInput")

  if (!dropzone || !fileInput) return

  // Handle click on dropzone
  dropzone.addEventListener("click", () => {
    fileInput.click()
  })

  // Handle drag and drop
  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault()
    dropzone.classList.add("dragover")
  })

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover")
  })

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault()
    dropzone.classList.remove("dragover")

    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files
      handleFileSelect(e)
    }
  })

  // Handle file selection
  fileInput.addEventListener("change", handleFileSelect)
}

/**
 * Handle file selection
 * @param {Event} e - Change event
 */
function handleFileSelect(e) {
  const fileInput = document.getElementById("imageInput")
  const file = fileInput.files[0]

  if (!file) return

  // Check file type
  const validTypes = ["image/jpeg", "image/png", "image/dicom", "application/octet-stream"]
  if (
    !validTypes.includes(file.type) &&
    !file.name.endsWith(".dcm") &&
    !file.name.endsWith(".nii") &&
    !file.name.endsWith(".nii.gz")
  ) {
    alert("Please select a valid medical image file (DICOM, NIFTI, PNG, or JPG).")
    fileInput.value = ""
    return
  }

  // Show preview
  showFilePreview(file)
}

/**
 * Show file preview
 * @param {File} file - Selected file
 */
function showFilePreview(file) {
  const previewContainer = document.getElementById("uploadPreview")
  const previewImg = document.getElementById("previewImg")
  const previewFileName = document.getElementById("previewFileName")
  const previewFileSize = document.getElementById("previewFileSize")
  const previewFileType = document.getElementById("previewFileType")

  // Set file details
  previewFileName.textContent = file.name
  previewFileSize.textContent = formatFileSize(file.size)
  previewFileType.textContent = getFileTypeDisplay(file)

  // Show preview image if it's a regular image
  if (file.type.startsWith("image/")) {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImg.src = e.target.result
    }
    reader.readAsDataURL(file)
  } else {
    // Show placeholder for DICOM or NIFTI
    previewImg.src = "images/placeholder-scan.jpg"
  }

  // Show preview container
  previewContainer.style.display = "block"
}

/**
 * Remove selected file
 */
function removeSelectedFile() {
  const fileInput = document.getElementById("imageInput")
  const previewContainer = document.getElementById("uploadPreview")

  fileInput.value = ""
  previewContainer.style.display = "none"
}

/**
 * Handle form submission
 * @param {Event} e - Submit event
 */
function handleUpload(e) {
  e.preventDefault()

  // Get form data
  const patientId = document.getElementById("patientId").value
  const patientName = document.getElementById("patientName").value
  const scanType = document.getElementById("scanType").value
  const bodyPart = document.getElementById("bodyPart").value
  const analysisType = document.querySelector('input[name="analysisType"]:checked').value
  const notes = document.getElementById("notes").value
  const fileInput = document.getElementById("imageInput")

  // Validate form data
  if (!patientId || !patientName || !scanType || !bodyPart || !fileInput.files[0]) {
    alert("Please fill in all required fields and select an image file.")
    return
  }

  // Show upload progress modal
  showUploadProgressModal()

  // Simulate upload and analysis process
  simulateUploadAndAnalysis()
    .then(() => {
      // Create result object
      const imageType = document.querySelector(".image-type-btn.active").getAttribute("data-type")
      const result = createResultObject(patientId, patientName, imageType, scanType, bodyPart, analysisType, notes)

      // Save result to local storage
      saveResult(result)

      // Add activity
      addActivity({
        type: imageType,
        title: `${imageType.toUpperCase()} Scan Uploaded`,
        date: new Date().toISOString(),
      })

      // Reset form
      e.target.reset()
      removeSelectedFile()

      // Close modal and show success message
      setTimeout(() => {
        closeUploadProgressModal()
        alert("Image uploaded and analyzed successfully!")

        // Ask if user wants to view results
        if (confirm("Would you like to view your results now?")) {
          window.location.href = "results.html"
        }
      }, 1000)
    })
    .catch((error) => {
      console.error("Upload error:", error)
      closeUploadProgressModal()
      alert("An error occurred during upload. Please try again.")
    })
}

/**
 * Show upload progress modal
 */
function showUploadProgressModal() {
  const modal = document.getElementById("uploadProgressModal")
  const progressBar = document.getElementById("uploadProgressBar").querySelector(".progress-fill")
  const progressText = document.getElementById("uploadProgressText")
  const progressMessage = document.getElementById("progressMessage")

  // Reset progress
  progressBar.style.width = "0%"
  progressText.textContent = "0%"
  progressMessage.textContent = "Uploading your image..."

  // Reset steps
  document.querySelectorAll(".progress-step").forEach((step) => {
    step.classList.remove("active")
  })
  document.getElementById("stepUpload").classList.add("active")

  // Show modal
  modal.style.display = "flex"
}

/**
 * Close upload progress modal
 */
function closeUploadProgressModal() {
  const modal = document.getElementById("uploadProgressModal")
  modal.style.display = "none"
}

/**
 * Simulate upload and analysis process
 * @returns {Promise} Promise that resolves when the process is complete
 */
function simulateUploadAndAnalysis() {
  return new Promise((resolve, reject) => {
    const progressBar = document.getElementById("uploadProgressBar").querySelector(".progress-fill")
    const progressText = document.getElementById("uploadProgressText")
    const progressMessage = document.getElementById("progressMessage")

    // Simulate upload (0-30%)
    simulateProgress(0, 30, 1000, (progress) => {
      progressBar.style.width = `${progress}%`
      progressText.textContent = `${Math.round(progress)}%`
    })
      .then(() => {
        // Update step
        document.getElementById("stepUpload").classList.add("completed")
        document.getElementById("stepProcess").classList.add("active")
        progressMessage.textContent = "Processing your image..."

        // Simulate processing (30-60%)
        return simulateProgress(30, 60, 1500, (progress) => {
          progressBar.style.width = `${progress}%`
          progressText.textContent = `${Math.round(progress)}%`
        })
      })
      .then(() => {
        // Update step
        document.getElementById("stepProcess").classList.add("completed")
        document.getElementById("stepAnalyze").classList.add("active")
        progressMessage.textContent = "Analyzing with AI..."

        // Simulate analysis (60-90%)
        return simulateProgress(60, 90, 2000, (progress) => {
          progressBar.style.width = `${progress}%`
          progressText.textContent = `${Math.round(progress)}%`
        })
      })
      .then(() => {
        // Update step
        document.getElementById("stepAnalyze").classList.add("completed")
        document.getElementById("stepComplete").classList.add("active")
        progressMessage.textContent = "Analysis complete!"

        // Simulate completion (90-100%)
        return simulateProgress(90, 100, 500, (progress) => {
          progressBar.style.width = `${progress}%`
          progressText.textContent = `${Math.round(progress)}%`
        })
      })
      .then(resolve)
      .catch(reject)
  })
}

/**
 * Simulate progress over time
 * @param {number} start - Start percentage
 * @param {number} end - End percentage
 * @param {number} duration - Duration in milliseconds
 * @param {Function} callback - Progress callback
 * @returns {Promise} Promise that resolves when the progress is complete
 */
function simulateProgress(start, end, duration, callback) {
  return new Promise((resolve) => {
    const startTime = Date.now()

    function updateProgress() {
      const elapsed = Date.now() - startTime
      const progress = start + (end - start) * (elapsed / duration)

      if (progress >= end) {
        callback(end)
        resolve()
      } else {
        callback(progress)
        requestAnimationFrame(updateProgress)
      }
    }

    updateProgress()
  })
}

/**
 * Create result object
 * @param {string} patientId - Patient ID
 * @param {string} patientName - Patient name
 * @param {string} imageType - Image type (mri, ct, xray)
 * @param {string} scanType - Scan type
 * @param {string} bodyPart - Body part
 * @param {string} analysisType - Analysis type
 * @param {string} notes - Notes
 * @returns {Object} Result object
 */
function createResultObject(patientId, patientName, imageType, scanType, bodyPart, analysisType, notes) {
  // Generate random confidence score between 90 and 99.9
  const confidence = (90 + Math.random() * 9.9).toFixed(1)

  // Create result object
  return {
    id: "result_" + Date.now(),
    title: `${imageType.toUpperCase()} - ${bodyPart}`,
    type: imageType,
    date: new Date().toISOString(),
    patientId: patientId,
    patientName: patientName,
    scanType: scanType,
    bodyPart: bodyPart,
    confidence: Number.parseFloat(confidence),
    analysisType: analysisType,
    notes: notes,
    image: getPlaceholderImage(imageType, bodyPart),
    tag: Math.random() > 0.5 ? "tumor" : null, // Randomly add tumor tag for demo
  }
}

/**
 * Save result to local storage
 * @param {Object} result - Result object
 */
function saveResult(result) {
  const results = JSON.parse(localStorage.getItem("medvision_results") || "[]")
  results.push(result)
  localStorage.setItem("medvision_results", JSON.stringify(results))
}

/**
 * Add activity to local storage
 * @param {Object} activity - Activity data
 */
function addActivity(activity) {
  const activities = JSON.parse(localStorage.getItem("medvision_activities") || "[]")

  // Add ID and save
  activity.id = "activity_" + Date.now()
  activities.push(activity)

  localStorage.setItem("medvision_activities", JSON.stringify(activities))
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
function formatFileSize(bytes) {
  if (bytes < 1024) {
    return bytes + " bytes"
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + " KB"
  } else {
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }
}

/**
 * Get file type display text
 * @param {File} file - File object
 * @returns {string} File type display text
 */
function getFileTypeDisplay(file) {
  if (file.name.endsWith(".dcm")) {
    return "DICOM Image"
  } else if (file.name.endsWith(".nii") || file.name.endsWith(".nii.gz")) {
    return "NIFTI Image"
  } else if (file.type === "image/jpeg") {
    return "JPEG Image"
  } else if (file.type === "image/png") {
    return "PNG Image"
  } else {
    return file.type
  }
}

/**
 * Get placeholder image based on image type and body part
 * @param {string} imageType - Image type (mri, ct, xray)
 * @param {string} bodyPart - Body part
 * @returns {string} Image URL
 */
function getPlaceholderImage(imageType, bodyPart) {
  // In a real application, this would return different images based on type and body part
  // For this demo, we'll use placeholder images
  if (imageType === "mri" && bodyPart === "brain") {
    return "images/mri-brain-placeholder.jpg"
  } else if (imageType === "ct") {
    return "images/ct-placeholder.jpg"
  } else if (imageType === "xray") {
    return "images/xray-placeholder.jpg"
  } else {
    return "images/placeholder-scan.jpg"
  }
}

// Add CSS for dragover state
document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style")
  style.textContent = `
    .upload-dropzone.dragover {
      border-color: var(--primary-color);
      background-color: rgba(59, 130, 246, 0.05);
    }
  `

  document.head.appendChild(style)
})

