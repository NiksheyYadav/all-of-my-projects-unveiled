let professional = null;
const professionalData = localStorage.getItem("professional");
if (professionalData) {
    try {
        professional = JSON.parse(professionalData);
    } catch (e) {
        console.error("Failed to parse 'professional' from local storage", e);
        localStorage.removeItem("professional"); // Remove invalid entry
    }
}