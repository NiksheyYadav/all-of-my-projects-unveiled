// Dashboard Module
document.addEventListener("DOMContentLoaded", () => {
  // Load dashboard data
  loadDashboardData()

  // Load recent activity
  loadRecentActivity()
})

/**
 * Load dashboard data from local storage
 */
function loadDashboardData() {
  // Get user data
  const user = JSON.parse(localStorage.getItem("medvision_user"))
  if (!user) return

  // Get appointments
  const appointments = JSON.parse(localStorage.getItem("medvision_appointments") || "[]")
  const upcomingAppointments = appointments
    .filter((a) => new Date(a.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  // Get results
  const results = JSON.parse(localStorage.getItem("medvision_results") || "[]")

  // Update next appointment
  if (upcomingAppointments.length > 0) {
    const nextAppointment = upcomingAppointments[0]
    const appointmentDate = new Date(nextAppointment.date)

    const dateElement = document.getElementById("nextAppointmentDate")
    const doctorElement = document.getElementById("nextAppointmentDoctor")

    if (dateElement) {
      const options = { year: "numeric", month: "long", day: "numeric" }
      dateElement.textContent = appointmentDate.toLocaleDateString("en-US", options)
    }

    if (doctorElement) {
      doctorElement.textContent = `${nextAppointment.doctor} - ${formatTime(appointmentDate)}`
    }
  }

  // Update results count
  const recentResultsCount = document.getElementById("recentResultsCount")
  if (recentResultsCount) {
    recentResultsCount.textContent = results.length
  }

  // Update total analyses
  const totalAnalysesCount = document.getElementById("totalAnalysesCount")
  if (totalAnalysesCount) {
    totalAnalysesCount.textContent = results.length
  }

  // Update scan counts
  updateScanCounts(results)
}

/**
 * Update scan counts on dashboard
 * @param {Array} results - Array of results
 */
function updateScanCounts(results) {
  const mriScans = results.filter((r) => r.type === "mri").length
  const ctScans = results.filter((r) => r.type === "ct").length
  const xrayScans = results.filter((r) => r.type === "xray").length

  const mriScansCount = document.getElementById("mriScansCount")
  const ctScansCount = document.getElementById("ctScansCount")
  const xrayScansCount = document.getElementById("xrayScansCount")

  if (mriScansCount) mriScansCount.textContent = mriScans
  if (ctScansCount) ctScansCount.textContent = ctScans
  if (xrayScansCount) xrayScansCount.textContent = xrayScans
}

/**
 * Load recent activity from local storage
 */
function loadRecentActivity() {
  // Get activity list element
  const activityList = document.getElementById("activityList")
  if (!activityList) return

  // Get activities from local storage
  const activities = JSON.parse(localStorage.getItem("medvision_activities") || "[]")

  // Sort activities by date (newest first)
  activities.sort((a, b) => new Date(b.date) - new Date(a.date))

  // Clear activity list
  activityList.innerHTML = ""

  // Add activities to list
  const recentActivities = activities.slice(0, 3)

  if (recentActivities.length === 0) {
    // Show placeholder if no activities
    const emptyActivity = createActivityItem({
      type: "info",
      title: "No recent activity",
      date: new Date().toISOString(),
    })
    activityList.appendChild(emptyActivity)
  } else {
    // Add recent activities
    recentActivities.forEach((activity) => {
      const activityItem = createActivityItem(activity)
      activityList.appendChild(activityItem)
    })
  }
}

/**
 * Create activity item element
 * @param {Object} activity - Activity data
 * @returns {HTMLElement} Activity item element
 */
function createActivityItem(activity) {
  const activityItem = document.createElement("div")
  activityItem.className = "activity-item"

  const icon = document.createElement("i")
  icon.className = `fas ${getActivityIcon(activity.type)} activity-icon`

  const details = document.createElement("div")
  details.className = "activity-details"

  const title = document.createElement("h4")
  title.textContent = activity.title

  const date = document.createElement("p")
  date.textContent = formatActivityDate(activity.date)

  details.appendChild(title)
  details.appendChild(date)

  activityItem.appendChild(icon)
  activityItem.appendChild(details)

  return activityItem
}

/**
 * Get icon class for activity type
 * @param {string} type - Activity type
 * @returns {string} Icon class
 */
function getActivityIcon(type) {
  switch (type) {
    case "appointment":
      return "fa-calendar-check"
    case "upload":
      return "fa-upload"
    case "result":
      return "fa-file-medical"
    case "mri":
      return "fa-brain"
    case "ct":
      return "fa-x-ray"
    case "xray":
      return "fa-radiation"
    default:
      return "fa-info-circle"
  }
}

/**
 * Format activity date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatActivityDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === now.toDateString()) {
    return `Today at ${formatTime(date)}`
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${formatTime(date)}`
  } else {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return `${date.toLocaleDateString("en-US", options)} at ${formatTime(date)}`
  }
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

// Initialize default dashboard data if none exists
function initializeDashboardData() {
  // Initialize appointments
  if (!localStorage.getItem("medvision_appointments")) {
    const today = new Date()
    const nextMonth = new Date(today)
    nextMonth.setMonth(today.getMonth() + 1)

    const defaultAppointments = [
      {
        id: "appt_1",
        type: "Radiology",
        description: "Follow-up consultation",
        date: new Date(today.getFullYear(), today.getMonth(), 18, 10, 30).toISOString(),
        doctor: "Dr. Jane Smith",
        location: "Main Hospital, Floor 3, Room 302",
        duration: 30,
      },
      {
        id: "appt_2",
        type: "Cardiology",
        description: "Annual checkup",
        date: new Date(today.getFullYear(), today.getMonth() + 1, 10, 14, 0).toISOString(),
        doctor: "Dr. John Doe",
        location: "Medical Center, Floor 2, Room 215",
        duration: 30,
      },
    ]

    localStorage.setItem("medvision_appointments", JSON.stringify(defaultAppointments))
  }

  // Initialize results
  if (!localStorage.getItem("medvision_results")) {
    const today = new Date()
    const lastMonth = new Date(today)
    lastMonth.setMonth(today.getMonth() - 1)

    const defaultResults = [
      {
        id: "result_1",
        title: "MRI - brain",
        type: "mri",
        date: new Date(today.getFullYear(), today.getMonth(), 4).toISOString(),
        patientId: "p1",
        scanType: "t2",
        confidence: 95.1,
        analysisType: "both",
        notes: "MRI Scan",
        image: "images/mri-brain-1.jpg",
        tag: "tumor",
      },
      {
        id: "result_2",
        title: "MRI - brain",
        type: "mri",
        date: new Date(today.getFullYear(), today.getMonth() - 1, 18).toISOString(),
        patientId: "p8",
        scanType: "t1",
        confidence: 95.7,
        analysisType: "both",
        notes: "MRI Scan",
        image: "images/mri-brain-2.jpg",
        tag: "tumor",
      },
    ]

    localStorage.setItem("medvision_results", JSON.stringify(defaultResults))
  }

  // Initialize activities
  if (!localStorage.getItem("medvision_activities")) {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    const lastWeek = new Date(today)
    lastWeek.setDate(today.getDate() - 7)

    const defaultActivities = [
      {
        id: "activity_1",
        type: "xray",
        title: "X-Ray Analysis Completed",
        date: new Date(today.setHours(10, 30, 0, 0)).toISOString(),
      },
      {
        id: "activity_2",
        type: "mri",
        title: "MRI Scan Uploaded",
        date: new Date(yesterday.setHours(14, 15, 0, 0)).toISOString(),
      },
      {
        id: "activity_3",
        type: "appointment",
        title: "Appointment Scheduled",
        date: new Date(lastWeek.setHours(9, 0, 0, 0)).toISOString(),
      },
    ]

    localStorage.setItem("medvision_activities", JSON.stringify(defaultActivities))
  }
}

// Initialize default data
initializeDashboardData()

