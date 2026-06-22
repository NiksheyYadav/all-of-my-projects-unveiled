// History Module
document.addEventListener("DOMContentLoaded", () => {
  // Setup tab navigation
  setupTabs()

  // Load history data
  loadHistoryData()
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
 * Load history data from local storage
 */
function loadHistoryData() {
  // Load imaging history
  loadImagingHistory()

  // Load lab results history
  loadLabHistory()

  // Load medications history
  loadMedicationsHistory()

  // Load past appointments
  loadPastAppointmentsHistory()
}

/**
 * Load imaging history
 */
async function loadImagingHistory() {
  const imagingHistoryContent = document.getElementById("imagingHistoryContent");
  if (!imagingHistoryContent) return;

  const response = await fetch("http://localhost:3000/get-records");
  const results = await response.json();

  if (results.length === 0) {
    imagingHistoryContent.innerHTML = "<p>No records found.</p>";
    return;
  }

  imagingHistoryContent.innerHTML = "";

  const historyTable = document.createElement("table");
  historyTable.className = "history-table";

  const tableHeader = document.createElement("thead");
  tableHeader.innerHTML = `
    <tr>
      <th>ID</th>
      <th>User</th>
      <th>Message</th>
      <th>Confidence</th>
      </tr>
      `;
      // <th>Actions</th>
      
  historyTable.appendChild(tableHeader);

  const tableBody = document.createElement("tbody");

  results.reverse().forEach((result) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${result.id}</td>
      <td>${result.user}</td>
      <td>${result.message}</td>
      <td>${result.confidence}%</td>
      `;
      // <td>
      //   <button class="secondary-btn view-btn" data-img="${result.segmentationImage}">
      //     <i class="fas fa-eye"></i>
      //     <span>View</span>
      //   </button>
      // </td>

    tableBody.appendChild(row);
  });

  historyTable.appendChild(tableBody);
  imagingHistoryContent.appendChild(historyTable);

  // View image button logic
  const viewButtons = imagingHistoryContent.querySelectorAll(".view-btn");
  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const imgData = button.getAttribute("data-img");
      if (imgData) {
        const imgWindow = window.open();
        imgWindow.document.write(`<img src="${imgData}" style="max-width:100%">`);
      }
    });
  });
}


/**
 * Load lab results history
 */
function loadLabHistory() {
  // This is a placeholder function
  // In a real application, this would load lab results from an API or local storage
}

/**
 * Load medications history
 */
function loadMedicationsHistory() {
  // This is a placeholder function
  // In a real application, this would load medications from an API or local storage
}

/**
 * Load past appointments history
 */
function loadPastAppointmentsHistory() {
  const pastAppointmentsContent = document.getElementById("pastAppointmentsContent")
  if (!pastAppointmentsContent) return

  // Get appointments from local storage
  const appointments = JSON.parse(localStorage.getItem("medvision_appointments") || "[]")

  // Filter past appointments
  const now = new Date()
  const pastAppointments = appointments.filter((a) => new Date(a.date) < now)

  // Check if there are any past appointments
  if (pastAppointments.length === 0) {
    // Keep the empty state message
    return
  }

  // Clear content
  pastAppointmentsContent.innerHTML = ""

  // Create history table
  const historyTable = document.createElement("table")
  historyTable.className = "history-table"

  // Create table header
  const tableHeader = document.createElement("thead")
  tableHeader.innerHTML = `
    <tr>
      <th>Date</th>
      <th>Time</th>
      <th>Type</th>
      <th>Doctor</th>
      <th>Location</th>
      <th>Duration</th>
      <th>Actions</th>
    </tr>
  `
  historyTable.appendChild(tableHeader)

  // Create table body
  const tableBody = document.createElement("tbody")

  // Sort appointments by date (newest first)
  pastAppointments.sort((a, b) => new Date(b.date) - new Date(a.date))

  // Add appointments to table
  pastAppointments.forEach((appointment) => {
    const row = document.createElement("tr")

    // Parse appointment date
    const appointmentDate = new Date(appointment.date)

    // Format date and time
    const formattedDate = appointmentDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

    const formattedTime = formatTime(appointmentDate)

    // Create row content
    row.innerHTML = `
      <td>${formattedDate}</td>
      <td>${formattedTime}</td>
      <td>${appointment.type}</td>
      <td>${appointment.doctor}</td>
      <td>${appointment.location}</td>
      <td>${appointment.duration} minutes</td>
      <td>
        <button class="secondary-btn summary-btn" data-id="${appointment.id}">
          <i class="fas fa-file-alt"></i>
          <span>Summary</span>
        </button>
      </td>
    `

    tableBody.appendChild(row)
  })

  historyTable.appendChild(tableBody)
  pastAppointmentsContent.appendChild(historyTable)

  // Add event listeners to summary buttons
  const summaryButtons = pastAppointmentsContent.querySelectorAll(".summary-btn")
  summaryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const appointmentId = button.getAttribute("data-id")
      viewAppointmentSummary(appointmentId)
    })
  })
}

/**
 * View result details
 * @param {string} resultId - Result ID
 */
function viewResult(resultId) {
  // Get results from local storage
  const results = JSON.parse(localStorage.getItem("medvision_results") || "[]")

  // Find result by ID
  const result = results.find((r) => r.id === resultId)

  if (!result) {
    alert("Result not found.")
    return
  }

  // Redirect to results page
  window.location.href = `results.html?id=${resultId}`
}

/**
 * View appointment summary
 * @param {string} appointmentId - Appointment ID
 */
function viewAppointmentSummary(appointmentId) {
  // Get appointments from local storage
  const appointments = JSON.parse(localStorage.getItem("medvision_appointments") || "[]")

  // Find appointment by ID
  const appointment = appointments.find((a) => a.id === appointmentId)

  if (!appointment) {
    alert("Appointment not found.")
    return
  }

  // Show appointment summary (mock implementation)
  alert(
    `Summary for ${appointment.type} appointment on ${new Date(appointment.date).toLocaleDateString()} is not available yet.`,
  )
}

/**
 * Get body part from result title
 * @param {string} title - Result title
 * @returns {string} Body part
 */
function getBodyPartFromTitle(title) {
  // Extract body part from title (e.g., "MRI - brain" -> "Brain")
  const parts = title.split("-")

  if (parts.length > 1) {
    return parts[1].trim().charAt(0).toUpperCase() + parts[1].trim().slice(1)
  }

  return "Unknown"
}

/**
 * Format time for display
 * @param {Date} date - Date object
 * @returns {string} Formatted time
 */
function formatTime(date) {
  let hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? "PM" : "AM"

  hours = hours % 12
  hours = hours ? hours : 12

  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes

  return `${hours}:${formattedMinutes} ${ampm}`
}

// Add CSS for history table
document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style")
  style.textContent = `
    .history-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: var(--spacing-lg);
    }
    
    .history-table th,
    .history-table td {
      padding: var(--spacing-md);
      text-align: left;
      border-bottom: 1px solid var(--light-border);
    }
    
    .dark-mode .history-table th,
    .dark-mode .history-table td {
      border-color: var(--dark-border);
    }
    
    .history-table th {
      font-weight: 600;
      background-color: var(--light-bg-secondary);
    }
    
    .dark-mode .history-table th {
      background-color: var(--dark-bg-secondary);
    }
    
    .history-table tr:hover {
      background-color: var(--light-hover-bg);
    }
    
    .dark-mode .history-table tr:hover {
      background-color: var(--dark-hover-bg);
    }
    
    .history-table .view-btn,
    .history-table .summary-btn {
      padding: var(--spacing-xs) var(--spacing-sm);
      font-size: var(--font-sm);
    }
  `

  document.head.appendChild(style)
})

