async function runPython() {
    const name = document.getElementById("patientName").value || "User";
    const imageInput = document.getElementById("imageInput");
    const outputDiv = document.getElementById("output");

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    let imageData = "";
    if (imageInput.files && imageInput.files[0]) {
        try {
            imageData = await toBase64(imageInput.files[0]);
        } catch (error) {
            console.error("Error converting file to base64:", error);
            outputDiv.innerHTML = `<p>Error reading image file.</p>`;
            return;
        }
    }

    const imageType = window.selectedImageType ? window.selectedImageType.toLowerCase() : "mri";

    // Log the data being sent to the backend
    console.log("Sending data to backend:", { name, imageData, imageType });

    try {
        const response = await fetch("http://localhost:3000/run-python", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, imageData, imageType }),
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error("Error from backend:", response.status, response.statusText, errText);
            outputDiv.innerHTML = `<p>Error: ${response.status} ${response.statusText}: ${errText}</p>`;
            return;
        }

        const data = await response.json();
        console.log("Response from backend:", data);
        
        if (data.message) {
            outputDiv.innerHTML = `<p>${data.message}</p>`;
            // const loader = document.getElementById("loader");
            // loader.style.display = "none";
        } else {
            outputDiv.innerHTML = `<p>Unexpected response format from backend.</p>`;
        }

        if (data.segmentationImage && imageType === "mri") {
            outputDiv.innerHTML += `<img src="${data.segmentationImage}" alt="Segmentation Mask" style="max-width:300px;">`;
        }
    } catch (error) {
        console.error("Fetch error:", error);
        outputDiv.innerHTML = `<p>Fetch error: ${error.message}</p>`;
    }
}

const navLinks = document.querySelector('.nav-links');

window.runPython = runPython;