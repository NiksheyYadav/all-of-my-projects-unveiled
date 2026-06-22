// Settings Module
document.addEventListener("DOMContentLoaded", () => {
  // Setup tab navigation
  setupTabs()

  // Load settings
  loadSettings()

  // Setup settings forms
  setupSettingsForms()

  // Setup security buttons
  setupSecurityButtons()
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
 * Load settings from local storage
 */
function loadSettings() {
  // Get settings from local storage
  const settings = JSON.parse(localStorage.getItem("medvision_settings") || "{}")

  // Set general settings
  if (settings.general) {
    const { language, timezone, dateFormat } = settings.general

    if (language) {
      document.getElementById("language").value = language
    }

    if (timezone) {
      document.getElementById("timezone").value = timezone
    }

    if (dateFormat) {
      document.getElementById("dateFormat").value = dateFormat
    }
  }

  // Set notification settings
  if (settings.notifications) {
    const { email, sms, phoneNumber } = settings.notifications

    if (email) {
      document.getElementById("emailAppointments").checked = email.appointments
      document.getElementById("emailResults").checked = email.results
      document.getElementById("emailUpdates").checked = email.updates
    }

    if (sms) {
      document.getElementById("smsAppointments").checked = sms.appointments
      document.getElementById("smsResults").checked = sms.results
    }

    if (phoneNumber) {
      document.getElementById("phoneNumber").value = phoneNumber
    }
  }

  // Set privacy settings
  if (settings.privacy) {
    const { shareAnonymousData, shareWithDoctors } = settings.privacy

    document.getElementById("shareAnonymousData").checked = shareAnonymousData !== false
    document.getElementById("shareWithDoctors").checked = shareWithDoctors !== false
  }
}

/**
 * Setup settings forms
 */
function setupSettingsForms() {
  // Setup general settings form
  const generalSettingsForm = document.getElementById("generalSettingsForm")
  if (generalSettingsForm) {
    generalSettingsForm.addEventListener("submit", handleGeneralSettingsSubmit)
  }

  // Setup notification settings form
  const notificationSettingsForm = document.getElementById("notificationSettingsForm")
  if (notificationSettingsForm) {
    notificationSettingsForm.addEventListener("submit", handleNotificationSettingsSubmit)
  }

  // Setup privacy settings form
  const privacySettingsForm = document.getElementById("privacySettingsForm")
  if (privacySettingsForm) {
    privacySettingsForm.addEventListener("submit", handlePrivacySettingsSubmit)
  }
}

/**
 * Setup security buttons
 */
function setupSecurityButtons() {
  // Setup change password button
  const changePasswordBtn = document.getElementById("changePasswordBtn")
  if (changePasswordBtn) {
    changePasswordBtn.addEventListener("click", openChangePasswordModal)
  }

  // Setup enable 2FA button
  const enable2faBtn = document.getElementById("enable2faBtn")
  if (enable2faBtn) {
    enable2faBtn.addEventListener("click", handleEnable2FA)
  }

  // Setup download data button
  const downloadDataBtn = document.getElementById("downloadDataBtn")
  if (downloadDataBtn) {
    downloadDataBtn.addEventListener("click", handleDownloadData)
  }

  // Setup delete account button
  const deleteAccountBtn = document.getElementById("deleteAccountBtn")
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener("click", handleDeleteAccount)
  }

  // Setup change password modal buttons
  const closeModalBtn = document.querySelector(".close-modal")
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeChangePasswordModal)
  }

  const cancelPasswordChangeBtn = document.getElementById("cancelPasswordChange")
  if (cancelPasswordChangeBtn) {
    cancelPasswordChangeBtn.addEventListener("click", closeChangePasswordModal)
  }

  const savePasswordChangeBtn = document.getElementById("savePasswordChange")
  if (savePasswordChangeBtn) {
    savePasswordChangeBtn.addEventListener("click", handleChangePassword)
  }
}

/**
 * Handle general settings form submission
 * @param {Event} e - Form submit event
 */
function handleGeneralSettingsSubmit(e) {
  e.preventDefault()

  // Get form data
  const language = document.getElementById("language").value
  const timezone = document.getElementById("timezone").value
  const dateFormat = document.getElementById("dateFormat").value

  // Get existing settings
  const settings = JSON.parse(localStorage.getItem("medvision_settings") || "{}")

  // Update settings
  settings.general = {
    language,
    timezone,
    dateFormat,
  }

  // Save settings
  localStorage.setItem("medvision_settings", JSON.stringify(settings))

  // Show success message
  alert("General settings saved successfully!")
}

/**
 * Handle notification settings form submission
 * @param {Event} e - Form submit event
 */
function handleNotificationSettingsSubmit(e) {
  e.preventDefault()

  // Get form data
  const emailAppointments = document.getElementById("emailAppointments").checked
  const emailResults = document.getElementById("emailResults").checked
  const emailUpdates = document.getElementById("emailUpdates").checked
  const smsAppointments = document.getElementById("smsAppointments").checked
  const smsResults = document.getElementById("smsResults").checked
  const phoneNumber = document.getElementById("phoneNumber").value

  // Validate phone number if SMS notifications are enabled
  if ((smsAppointments || smsResults) && !phoneNumber) {
    alert("Please enter a phone number for SMS notifications.")
    return
  }

  // Get existing settings
  const settings = JSON.parse(localStorage.getItem("medvision_settings") || "{}")

  // Update settings
  settings.notifications = {
    email: {
      appointments: emailAppointments,
      results: emailResults,
      updates: emailUpdates,
    },
    sms: {
      appointments: smsAppointments,
      results: smsResults,
    },
    phoneNumber,
  }

  // Save settings
  localStorage.setItem("medvision_settings", JSON.stringify(settings))

  // Show success message
  alert("Notification settings saved successfully!")
}

/**
 * Handle privacy settings form submission
 * @param {Event} e - Form submit event
 */
function handlePrivacySettingsSubmit(e) {
  e.preventDefault()

  // Get form data
  const shareAnonymousData = document.getElementById("shareAnonymousData").checked
  const shareWithDoctors = document.getElementById("shareWithDoctors").checked

  // Get existing settings
  const settings = JSON.parse(localStorage.getItem("medvision_settings") || "{}")

  // Update settings
  settings.privacy = {
    shareAnonymousData,
    shareWithDoctors,
  }

  // Save settings
  localStorage.setItem("medvision_settings", JSON.stringify(settings))

  // Show success message
  alert("Privacy settings saved successfully!")
}

/**
 * Open change password modal
 */
function openChangePasswordModal() {
  const modal = document.getElementById("changePasswordModal")

  // Clear form
  document.getElementById("currentPassword").value = ""
  document.getElementById("newPassword").value = ""
  document.getElementById("confirmNewPassword").value = ""
  document.getElementById("passwordError").textContent = ""

  // Show modal
  modal.style.display = "flex"
}

/**
 * Close change password modal
 */
function closeChangePasswordModal() {
  const modal = document.getElementById("changePasswordModal")
  modal.style.display = "none"
}

/**
 * Handle change password
 */
function handleChangePassword() {
  // Get form data
  const currentPassword = document.getElementById("currentPassword").value
  const newPassword = document.getElementById("newPassword").value
  const confirmNewPassword = document.getElementById("confirmNewPassword").value
  const errorElement = document.getElementById("passwordError")

  // Validate form data
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    errorElement.textContent = "Please fill in all fields."
    return
  }

  if (newPassword !== confirmNewPassword) {
    errorElement.textContent = "New passwords do not match."
    return
  }

  // Get user data
  const user = JSON.parse(localStorage.getItem("medvision_user"))
  if (!user) {
    errorElement.textContent = "User not found. Please log in again."
    return
  }

  // Get users from local storage
  const users = JSON.parse(localStorage.getItem("medvision_users") || "[]")
  const userIndex = users.findIndex((u) => u.id === user.id)

  if (userIndex === -1) {
    errorElement.textContent = "User not found. Please log in again."
    return
  }

  // Check current password
  if (users[userIndex].password !== currentPassword) {
    errorElement.textContent = "Current password is incorrect."
    return
  }

  // Update password
  users[userIndex].password = newPassword

  // Save users
  localStorage.setItem("medvision_users", JSON.stringify(users))

  // Close modal
  closeChangePasswordModal()

  // Show success message
  alert("Password changed successfully!")
}

/**
 * Handle enable 2FA
 */
function handleEnable2FA() {
  alert("Two-factor authentication is not implemented in this demo.")
}

/**
 * Handle download data
 */
function handleDownloadData() {
  // Get user data
  const user = JSON.parse(localStorage.getItem("medvision_user"))
  if (!user) {
    alert("User not found. Please log in again.")
    return
  }

  // Get user's data
  const appointments = JSON.parse(localStorage.getItem("medvision_appointments") || "[]")
  const results = JSON.parse(localStorage.getItem("medvision_results") || "[]")
  const activities = JSON.parse(localStorage.getItem("medvision_activities") || "[]")
  const settings = JSON.parse(localStorage.getItem("medvision_settings") || "{}")

  // Create data object
  const data = {
    user,
    appointments,
    results,
    activities,
    settings,
    exportDate: new Date().toISOString(),
  }

  // Convert to JSON
  const jsonData = JSON.stringify(data, null, 2)

  // Create download link
  const blob = new Blob([jsonData], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `medvision_data_${new Date().toISOString().split("T")[0]}.json`

  // Trigger download
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Handle delete account
 */
function handleDeleteAccount() {
  if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
    return
  }

  if (!confirm("All your data will be permanently deleted. Are you absolutely sure?")) {
    return
  }

  // Get user data
  const user = JSON.parse(localStorage.getItem("medvision_user"))
  if (!user) {
    alert("User not found. Please log in again.")
    return
  }

  // Get users from local storage
  const users = JSON.parse(localStorage.getItem("medvision_users") || "[]")
  const userIndex = users.findIndex((u) => u.id === user.id)

  if (userIndex === -1) {
    alert("User not found. Please log in again.")
    return
  }

  // Remove user
  users.splice(userIndex, 1)

  // Save users
  localStorage.setItem("medvision_users", JSON.stringify(users))

  // Clear user data
  localStorage.removeItem("medvision_user")
  localStorage.removeItem("medvision_appointments")
  localStorage.removeItem("medvision_results")
  localStorage.removeItem("medvision_activities")
  localStorage.removeItem("medvision_settings")

  // Redirect to login page
  window.location.href = "login.html"
}

// Initialize default settings if none exist
function initializeDefaultSettings() {
  const settings = JSON.parse(localStorage.getItem("medvision_settings") || "{}")

  // Initialize general settings
  if (!settings.general) {
    settings.general = {
      language: "en",
      timezone: "utc-5",
      dateFormat: "MM/DD/YYYY",
    }
  }

  // Initialize notification settings
  if (!settings.notifications) {
    settings.notifications = {
      email: {
        appointments: true,
        results: true,
        updates: false,
      },
      sms: {
        appointments: true,
        results: false,
      },
      phoneNumber: "",
    }
  }

  // Initialize privacy settings
  if (!settings.privacy) {
    settings.privacy = {
      shareAnonymousData: true,
      shareWithDoctors: true,
    }
  }

  // Save settings
  localStorage.setItem("medvision_settings", JSON.stringify(settings))
}

// Initialize default settings
initializeDefaultSettings()

