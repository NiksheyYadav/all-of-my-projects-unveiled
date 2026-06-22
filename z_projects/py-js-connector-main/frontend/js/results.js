// Results Module
document.addEventListener("DOMContentLoaded", () => {
  // Setup tab navigation
  setupTabs()

  // Load results
  loadResults()

  // Setup modal close button
  const closeModalBtn = document.querySelector(".close-modal")
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeResultDetailModal)
  }

  // Setup SMS button
  const sendSmsBtn = document.getElementById("modalSendSmsBtn")
  if (sendSmsBtn) {
    sendSmsBtn.addEventListener("click", handleSendSms)
  }
})

/**
 * Setup tab navigation
 */
function setupTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      tabContents.forEach((content) => content.classList.remove("active"))

      // Add active class to clicked button and corresponding content
      button.classList.add("active")
      const tabId = button.getAttribute("data-tab")
      document.getElementById(`${tabId}-tab`).classList.add("active")
    })
  })
}

/**
 * Load results from local storage
 */
function loadResults() {
  // Get results from local storage
  const results = JSON.parse(localStorage.getItem("medvision_results") || "[]")

  // Sort results by date (newest first)
  results.sort((a, b) => new Date(b.date) - new Date(a.date))

  // Load all results
  loadResultsList("allResultsList", results)

  // Load MRI results
  const mriResults = results.filter((r) => r.type === "mri")
  loadResultsList("mriResultsList", mriResults)

  // Load CT results
  const ctResults = results.filter((r) => r.type === "ct")
  loadResultsList("ctResultsList", ctResults)

  // Load X-Ray results
  const xrayResults = results.filter((r) => r.type === "xray")
  loadResultsList("xrayResultsList", xrayResults)
}

/**
 * Load results into a list element
 * @param {string} listId - ID of the list element
 * @param {Array} results - Array of results
 */
function loadResultsList(listId, results) {
  const listElement = document.getElementById(listId)
  if (!listElement) return

  listElement.innerHTML = ""

  if (results.length === 0) {
    listElement.innerHTML =
      '<div class="empty-state"><i class="fas fa-file-medical empty-icon"></i><h3>No results found</h3><p>Upload and analyze medical images to see results here.</p></div>'
  } else {
    results.forEach((result) => {
      const resultElement = createResultElement(result)
      listElement.appendChild(resultElement)
    })
  }
}

/**
 * Create result element
 * @param {Object} result - Result data
 * @returns {HTMLElement} Result element
 */
function createResultElement(result) {
  // Clone template
  const template = document.getElementById("resultTemplate")
  const resultElement = template.content.cloneNode(true)

  // Set result image
  const imageElement = resultElement.querySelector(".result-image img")
  imageElement.src = result.image || "images/placeholder-scan.jpg"
  imageElement.alt = result.title

  // Set result details
  resultElement.querySelector(".result-title").textContent = result.title

  // Set result tag if exists
  const tagElement = resultElement.querySelector(".result-tag")
  if (result.tag) {
    tagElement.textContent = result.tag.charAt(0).toUpperCase() + result.tag.slice(1)
    tagElement.style.display = "inline-block"
  } else {
    tagElement.style.display = "none"
  }

  // Set result date
  const resultDate = new Date(result.date)
  const options = { year: "numeric", month: "long", day: "numeric" }
  resultElement.querySelector(".result-date").textContent = resultDate.toLocaleDateString("en-US", options)

  // Set result info
  resultElement.querySelector(".patient-id").textContent = result.patientId
  resultElement.querySelector(".scan-type").textContent = result.scanType
  resultElement.querySelector(".confidence").textContent = `${result.confidence}%`
  resultElement.querySelector(".analysis-type").textContent = result.analysisType

  // Set notes if exists
  const notesRow = resultElement.querySelector(".notes-row")
  const notesElement = resultElement.querySelector(".notes")

  if (result.notes) {
    notesElement.textContent = result.notes
    notesRow.style.display = "flex"
  } else {
    notesRow.style.display = "none"
  }

  // Add event listeners to action buttons
  const viewDetailsBtn = resultElement.querySelector(".view-details-btn")
  const downloadBtn = resultElement.querySelector(".download-btn")
  const reportBtn = resultElement.querySelector(".report-btn")

  viewDetailsBtn.addEventListener("click", () => {
    openResultDetailModal(result)
  })

  downloadBtn.addEventListener("click", () => {
    downloadResult(result)
  })

  reportBtn.addEventListener("click", () => {
    reportResult(result)
  })

  return resultElement.querySelector(".result-item")
}

/**
 * Open result detail modal
 * @param {Object} result - Result data
 */
function openResultDetailModal(result) {
  // Get modal elements
  const modal = document.getElementById("resultDetailModal")
  const modalTitle = document.getElementById("modalResultTitle")
  const modalImage = document.getElementById("modalResultImage")
  const modalPatientId = document.getElementById("modalPatientId")
  const modalPatientName = document.getElementById("modalPatientName")
  const modalResultDate = document.getElementById("modalResultDate")
  const modalScanType = document.getElementById("modalScanType")
  const modalBodyPart = document.getElementById("modalBodyPart")
  const modalAnalysisType = document.getElementById("modalAnalysisType")
  const modalConfidence = document.getElementById("modalConfidence")
  const modalNotes = document.getElementById("modalNotes")

  // Set modal content
  modalTitle.textContent = result.title
  modalImage.src = result.image || "images/placeholder-scan.jpg"
  modalImage.alt = result.title
  modalPatientId.textContent = result.patientId

  // Get user data for patient name
  const user = JSON.parse(localStorage.getItem("medvision_user"))
  modalPatientName.textContent = user ? `${user.firstName} ${user.lastName}` : "John Doe"

  // Set result date
  const resultDate = new Date(result.date)
  const options = { year: "numeric", month: "long", day: "numeric" }
  modalResultDate.textContent = resultDate.toLocaleDateString("en-US", options)

  // Set scan details
  modalScanType.textContent = result.scanType.toUpperCase()
  modalBodyPart.textContent = getBodyPartFromTitle(result.title)
  modalAnalysisType.textContent = result.analysisType.charAt(0).toUpperCase() + result.analysisType.slice(1)
  modalConfidence.textContent = `${result.confidence}%`

  // Set notes
  modalNotes.textContent = result.notes || "No additional notes available."

  // Setup modal action buttons
  const modalDownloadBtn = document.getElementById("modalDownloadBtn")
  const modalReportBtn = document.getElementById("modalReportBtn")

  modalDownloadBtn.onclick = () => downloadResult(result)
  modalReportBtn.onclick = () => reportResult(result)

  // Store current result ID in modal
  modal.dataset.resultId = result.id

  // Show modal
  modal.style.display = "flex"
}

/**
 * Close result detail modal
 */
function closeResultDetailModal() {
  const modal = document.getElementById("resultDetailModal")
  modal.style.display = "none"
}

/**
 * Download result
 * @param {Object} result - Result data
 */
function downloadResult(result) {
  alert(`Downloading ${result.title} (ID: ${result.id})...\n\nThis feature is not fully implemented yet.`)
}

/**
 * Report result
 * @param {Object} result - Result data
 */
function reportResult(result) {
  alert(`Generating report for ${result.title} (ID: ${result.id})...\n\nThis feature is not fully implemented yet.`)
}

/**
 * Handle sending result via SMS
 */
function handleSendSms() {
  const modal = document.getElementById("resultDetailModal")
  const resultId = modal.dataset.resultId

  // Get result data
  const results = JSON.parse(localStorage.getItem("medvision_results") || "[]")
  const result = results.find((r) => r.id === resultId)

  if (!result) {
    alert("Result not found.")
    return
  }

  // Prompt for phone number
  const phoneNumber = prompt("Enter phone number to send result via SMS:")

  if (!phoneNumber) return

  // Validate phone number (simple validation)
  if (!/^\+?[0-9]{10,15}$/.test(phoneNumber)) {
    alert("Please enter a valid phone number.")
    return
  }

  // Send SMS (mock implementation)
  sendSmsWithTwilio(phoneNumber, result)
}

/**
 * Send SMS with Twilio API
 * @param {string} phoneNumber - Recipient phone number
 * @param {Object} result - Result data
 */
function sendSmsWithTwilio(phoneNumber, result) {
  // This is a mock implementation
  // In a real application, this would make an API call to a server endpoint
  // that uses the Twilio API to send an SMS
}

/**
 * Get body part from title
 * @param {string} title - Result title
 * @returns {string} Body part
 */
function getBodyPartFromTitle(title) {
  // Basic implementation - improve as needed
  if (title.toLowerCase().includes("head")) return "Head"
  if (title.toLowerCase().includes("brain")) return "Brain"
  if (title.toLowerCase().includes("knee")) return "Knee"
  if (title.toLowerCase().includes("spine")) return "Spine"
  if (title.toLowerCase().includes("chest")) return "Chest"
  return "Unknown"
}

