// Appointments Module
document.addEventListener("DOMContentLoaded", () => {
  // Setup tab navigation
  setupTabs()

  // Load appointments
  loadAppointments()

  // Setup appointment form
  const bookAppointmentForm = document.getElementById("bookAppointmentForm")
  if (bookAppointmentForm) {
    bookAppointmentForm.addEventListener("submit", handleBookAppointment)
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
 * Load appointments from local storage
 */
function loadAppointments() {
  // Get appointments from local storage
  const appointments = JSON.parse(localStorage.getItem("medvision_appointments") || "[]")

  // Sort appointments by date
  appointments.sort((a, b) => new Date(a.date) - new Date(b.date))

  // Split into upcoming and past appointments
  const now = new Date()
  const upcomingAppointments = appointments.filter((a) => new Date(a.date) > now)
  const pastAppointments = appointments.filter((a) => new Date(a.date) <= now)

  // Load upcoming appointments
  const upcomingList = document.getElementById("upcomingAppointmentsList")
  if (upcomingList) {
    upcomingList.innerHTML = ""

    if (upcomingAppointments.length === 0) {
      upcomingList.innerHTML =
        '<div class="empty-state"><i class="fas fa-calendar empty-icon"></i><h3>No upcoming appointments</h3><p>Book a new appointment to see it here.</p></div>'
    } else {
      upcomingAppointments.forEach((appointment) => {
        const appointmentElement = createAppointmentElement(appointment)
        upcomingList.appendChild(appointmentElement)
      })
    }
  }

  // Load past appointments
  const pastList = document.getElementById("pastAppointmentsList")
  if (pastList) {
    pastList.innerHTML = ""

    if (pastAppointments.length === 0) {
      pastList.innerHTML =
        '<div class="empty-state"><i class="fas fa-calendar-check empty-icon"></i><h3>No past appointments</h3><p>Your appointment history will appear here.</p></div>'
    } else {
      pastAppointments.forEach((appointment) => {
        const appointmentElement = createAppointmentElement(appointment, true)
        pastList.appendChild(appointmentElement)
      })
    }
  }
}

/**
 * Create appointment element
 * @param {Object} appointment - Appointment data
 * @param {boolean} isPast - Whether the appointment is in the past
 * @returns {HTMLElement} Appointment element
 */
function createAppointmentElement(appointment, isPast = false) {
  // Clone template
  const template = document.getElementById("appointmentTemplate")
  const appointmentElement = template.content.cloneNode(true)

  // Parse appointment date
  const appointmentDate = new Date(appointment.date)

  // Set date and time
  appointmentElement.querySelector(".date-number").textContent = appointmentDate.getDate()
  appointmentElement.querySelector(".date-month").textContent = appointmentDate.toLocaleString("default", {
    month: "short",
  })
  appointmentElement.querySelector(".date-time").textContent = formatTime(appointmentDate)

  // Set appointment details
  appointmentElement.querySelector(".appointment-type").textContent = appointment.type
  appointmentElement.querySelector(".appointment-description").textContent = appointment.description
  appointmentElement.querySelector(".doctor-name").textContent = appointment.doctor
  appointmentElement.querySelector(".location").textContent = appointment.location
  appointmentElement.querySelector(".duration").textContent = `Duration: ${appointment.duration} minutes`

  // Handle past appointments
  if (isPast) {
    const actionsContainer = appointmentElement.querySelector(".appointment-actions")
    actionsContainer.innerHTML = '<button class="secondary-btn view-summary-btn">View Summary</button>'

    // Add event listener to view summary button
    const viewSummaryBtn = actionsContainer.querySelector(".view-summary-btn")
    viewSummaryBtn.addEventListener("click", () => {
      alert(
        `Summary for ${appointment.type} appointment on ${appointmentDate.toLocaleDateString()} is not available yet.`,
      )
    })
  } else {
    // Add event listeners to action buttons
    const rescheduleBtn = appointmentElement.querySelector(".reschedule-btn")
    const cancelBtn = appointmentElement.querySelector(".cancel-btn")

    rescheduleBtn.addEventListener("click", () => {
      alert(`Reschedule functionality for appointment ID ${appointment.id} is not implemented yet.`)
    })

    cancelBtn.addEventListener("click", () => {
      if (
        confirm(
          `Are you sure you want to cancel your ${appointment.type} appointment on ${appointmentDate.toLocaleDateString()}?`,
        )
      ) {
        cancelAppointment(appointment.id)
      }
    })
  }

  return appointmentElement.querySelector(".appointment-item")
}

/**
 * Handle booking a new appointment
 * @param {Event} e - Form submit event
 */
function handleBookAppointment(e) {
  e.preventDefault()

  // Get form data
  const appointmentType = document.getElementById("appointmentType").value
  const doctor = document.getElementById("doctor").value
  const appointmentDate = document.getElementById("appointmentDate").value
  const appointmentTime = document.getElementById("appointmentTime").value
  const notes = document.getElementById("notes").value

  // Validate form data
  if (!appointmentType || !doctor || !appointmentDate || !appointmentTime) {
    alert("Please fill in all required fields.")
    return
  }

  // Create appointment object
  const appointment = {
    id: "appt_" + Date.now(),
    type: appointmentType,
    description: getDoctorSpecialty(doctor),
    date: new Date(`${appointmentDate}T${appointmentTime}`).toISOString(),
    doctor: getDoctorName(doctor),
    location: getDoctorLocation(doctor),
    duration: 30,
    notes: notes,
  }

  // Save appointment to local storage
  const appointments = JSON.parse(localStorage.getItem("medvision_appointments") || "[]")
  appointments.push(appointment)
  localStorage.setItem("medvision_appointments", JSON.stringify(appointments))

  // Add activity
  addActivity({
    type: "appointment",
    title: "Appointment Scheduled",
    date: new Date().toISOString(),
  })

  // Reload appointments
  loadAppointments()

  // Reset form
  e.target.reset()

  // Show success message
  alert("Appointment booked successfully!")

  // Switch to upcoming tab
  document.querySelector('.tab-btn[data-tab="upcoming"]').click()
}

/**
 * Cancel an appointment
 * @param {string} appointmentId - Appointment ID
 */
function cancelAppointment(appointmentId) {
  // Get appointments from local storage
  const appointments = JSON.parse(localStorage.getItem("medvision_appointments") || "[]")

  // Find appointment index
  const appointmentIndex = appointments.findIndex((a) => a.id === appointmentId)

  if (appointmentIndex === -1) {
    alert("Appointment not found.")
    return
  }

  // Remove appointment
  appointments.splice(appointmentIndex, 1)

  // Save updated appointments
  localStorage.setItem("medvision_appointments", JSON.stringify(appointments))

  // Add activity
  addActivity({
    type: "appointment",
    title: "Appointment Cancelled",
    date: new Date().toISOString(),
  })

  // Reload appointments
  loadAppointments()

  // Show success message
  alert("Appointment cancelled successfully.")
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
 * Get doctor name from ID
 * @param {string} doctorId - Doctor ID
 * @returns {string} Doctor name
 */
function getDoctorName(doctorId) {
  const doctors = {
    "dr-jane-smith": "Dr. Jane Smith",
    "dr-john-doe": "Dr. John Doe",
    "dr-sarah-johnson": "Dr. Sarah Johnson",
  }

  return doctors[doctorId] || "Unknown Doctor"
}

/**
 * Get doctor specialty from ID
 * @param {string} doctorId - Doctor ID
 * @returns {string} Doctor specialty
 */
function getDoctorSpecialty(doctorId) {
  const specialties = {
    "dr-jane-smith": "Follow-up consultation",
    "dr-john-doe": "Annual checkup",
    "dr-sarah-johnson": "Initial consultation",
  }

  return specialties[doctorId] || "Consultation"
}

/**
 * Get doctor location from ID
 * @param {string} doctorId - Doctor ID
 * @returns {string} Doctor location
 */
function getDoctorLocation(doctorId) {
  const locations = {
    "dr-jane-smith": "Main Hospital, Floor 3, Room 302",
    "dr-john-doe": "Medical Center, Floor 2, Room 215",
    "dr-sarah-johnson": "Outpatient Clinic, Floor 1, Room 105",
  }

  return locations[doctorId] || "Main Hospital"
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

