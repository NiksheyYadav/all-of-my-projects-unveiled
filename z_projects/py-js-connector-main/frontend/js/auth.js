// Authentication Module
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const isLoggedIn = checkLoginStatus()

  // Get current page path
  const currentPath = window.location.pathname
  const isAuthPage = currentPath.includes("login.html") || currentPath.includes("signup.html")

  // Redirect if needed
  if (!isLoggedIn && !isAuthPage && !currentPath.includes("index.html")) {
    window.location.href = "login.html"
  } else if (isLoggedIn && isAuthPage) {
    window.location.href = "index.html"
  }

  // Setup login form
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  // Setup signup form
  const signupForm = document.getElementById("signupForm")
  if (signupForm) {
    signupForm.addEventListener("submit", handleSignup)
  }

  // Setup logout button
  const logoutBtn = document.getElementById("logoutBtn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout)
  }

  // Setup password toggle buttons
  const togglePasswordBtns = document.querySelectorAll(".toggle-password")
  togglePasswordBtns.forEach((btn) => {
    btn.addEventListener("click", togglePasswordVisibility)
  })

  // Update user info if logged in
  if (isLoggedIn) {
    updateUserInfo()
  }
})

/**
 * Check if user is logged in
 * @returns {boolean} Login status
 */
function checkLoginStatus() {
  const user = localStorage.getItem("medvision_user")
  return !!user
}

/**
 * Handle login form submission
 * @param {Event} e - Form submit event
 */
function handleLogin(e) {
  e.preventDefault()

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  const remember = document.getElementById("remember")?.checked || false
  const errorElement = document.getElementById("loginError")

  // Simple validation
  if (!email || !password) {
    errorElement.textContent = "Please enter both email and password."
    return
  }

  // Check if user exists in local storage
  const users = JSON.parse(localStorage.getItem("medvision_users") || "[]")
  const user = users.find((u) => u.email === email)

  if (!user || user.password !== password) {
    errorElement.textContent = "Invalid email or password."
    return
  }

  // Login successful
  const userData = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    lastLogin: new Date().toISOString(),
  }

  localStorage.setItem("medvision_user", JSON.stringify(userData))

  // Redirect to dashboard
  window.location.href = "index.html"
}

/**
 * Handle signup form submission
 * @param {Event} e - Form submit event
 */
function handleSignup(e) {
  e.preventDefault()

  const firstName = document.getElementById("firstName").value
  const lastName = document.getElementById("lastName").value
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  const confirmPassword = document.getElementById("confirmPassword").value
  const terms = document.getElementById("terms").checked
  const errorElement = document.getElementById("signupError")

  // Simple validation
  if (!firstName || !lastName || !email || !password) {
    errorElement.textContent = "Please fill in all required fields."
    return
  }

  if (password !== confirmPassword) {
    errorElement.textContent = "Passwords do not match."
    return
  }

  if (!terms) {
    errorElement.textContent = "You must agree to the Terms of Service."
    return
  }

  // Check if email already exists
  const users = JSON.parse(localStorage.getItem("medvision_users") || "[]")
  if (users.some((u) => u.email === email)) {
    errorElement.textContent = "Email already in use."
    return
  }

  // Create new user
  const newUser = {
    id: generateUserId(),
    firstName,
    lastName,
    email,
    password,
    createdAt: new Date().toISOString(),
  }

  // Save user
  users.push(newUser)
  localStorage.setItem("medvision_users", JSON.stringify(users))

  // Auto login
  const userData = {
    id: newUser.id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    lastLogin: new Date().toISOString(),
  }

  localStorage.setItem("medvision_user", JSON.stringify(userData))

  // Redirect to dashboard
  window.location.href = "index.html"
}

/**
 * Handle logout
 */
function handleLogout() {
  localStorage.removeItem("medvision_user")
  window.location.href = "login.html"
}

/**
 * Toggle password visibility
 * @param {Event} e - Click event
 */
function togglePasswordVisibility(e) {
  const button = e.currentTarget
  const passwordInput = button.previousElementSibling
  const icon = button.querySelector("i")

  if (passwordInput.type === "password") {
    passwordInput.type = "text"
    icon.classList.remove("fa-eye")
    icon.classList.add("fa-eye-slash")
  } else {
    passwordInput.type = "password"
    icon.classList.remove("fa-eye-slash")
    icon.classList.add("fa-eye")
  }
}

/**
 * Update user info in the UI
 */
function updateUserInfo() {
  const user = JSON.parse(localStorage.getItem("medvision_user"))
  if (!user) return

  // Update user name
  const userNameElements = document.querySelectorAll(".user-name")
  userNameElements.forEach((el) => {
    el.textContent = `${user.firstName} ${user.lastName}`
  })

  // Update user email
  const userEmailElements = document.querySelectorAll(".user-email")
  userEmailElements.forEach((el) => {
    el.textContent = user.email
  })

  // Update user avatar
  const userAvatarElements = document.querySelectorAll(".user-avatar")
  userAvatarElements.forEach((el) => {
    el.textContent = user.firstName.charAt(0)
  })

  // Update welcome message
  const userNameSpan = document.getElementById("userName")
  if (userNameSpan) {
    userNameSpan.textContent = `${user.firstName} ${user.lastName}`
  }
}

/**
 * Generate a unique user ID
 * @returns {string} Unique ID
 */
function generateUserId() {
  return "user_" + Math.random().toString(36).substr(2, 9)
}

// Initialize default users if none exist
function initializeDefaultUsers() {
  const users = JSON.parse(localStorage.getItem("medvision_users") || "[]")

  if (users.length === 0) {
    const defaultUser = {
      id: "user_default",
      firstName: "John",
      lastName: "Doe",
      email: "patient@example.com",
      password: "password123",
      createdAt: new Date().toISOString(),
    }

    users.push(defaultUser)
    localStorage.setItem("medvision_users", JSON.stringify(users))
  }
}

// Initialize default data
initializeDefaultUsers()

