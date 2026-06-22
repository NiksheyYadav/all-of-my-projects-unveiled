// Theme Module
document.addEventListener("DOMContentLoaded", () => {
  // Get theme toggle button
  const themeToggle = document.getElementById("themeToggle")

  // Apply saved theme
  applyTheme()

  // Add event listener to theme toggle button
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme)
  }
})

/**
 * Toggle between light and dark theme
 */
function toggleTheme() {
  const body = document.body
  const themeToggle = document.getElementById("themeToggle")
  const themeIcon = themeToggle.querySelector("i")
  const imageInput = document.getElementById("imageInput")
  const runner = document.getElementById("runner")

  if (body.classList.contains("dark-mode")) {
    // Switch to light mode
    body.classList.remove("dark-mode")
    themeIcon.classList.remove("fa-sun")
    themeIcon.classList.add("fa-moon")
    localStorage.setItem("medvision_theme", "light")
    imageInput.style.color = "black";
    runner.style.color = "black";
    
  } else {
    // Switch to dark mode
    body.classList.add("dark-mode")
    themeIcon.classList.remove("fa-moon")
    themeIcon.classList.add("fa-sun")
    localStorage.setItem("medvision_theme", "dark")
    imageInput.style.color = "white";
    runner.style.color = "white";
  }
}

/**
 * Apply saved theme from local storage
 */
function applyTheme() {
  const savedTheme = localStorage.getItem("medvision_theme")
  const body = document.body
  const themeToggle = document.getElementById("themeToggle")

  if (themeToggle) {
    const themeIcon = themeToggle.querySelector("i")

    if (savedTheme === "dark") {
      body.classList.add("dark-mode")
      themeIcon.classList.remove("fa-moon")
      themeIcon.classList.add("fa-sun")
    } else {
      body.classList.remove("dark-mode")
      themeIcon.classList.remove("fa-sun")
      themeIcon.classList.add("fa-moon")
    }
  }
}

