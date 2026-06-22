// Twilio Integration Module

/**
 * Send SMS with Twilio API
 * @param {string} phoneNumber - Recipient phone number
 * @param {Object} result - Result data
 */
function sendSmsWithTwilio(phoneNumber, result) {
  // Check if Twilio environment variables are set
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
    alert("Twilio environment variables are not set. SMS cannot be sent.")
    return
  }

  // In a real application, this would make an API call to a server endpoint
  // that uses the Twilio API to send an SMS

  // For this demo, we'll simulate a successful SMS send
  setTimeout(() => {
    alert(`SMS sent to ${phoneNumber} with result information for ${result.title}.`)

    // Add activity
    addActivity({
      type: "sms",
      title: "Result Sent via SMS",
      date: new Date().toISOString(),
    })
  }, 1500)
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

