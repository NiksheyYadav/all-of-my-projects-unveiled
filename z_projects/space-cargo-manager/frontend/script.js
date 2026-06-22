async function searchItem() {
    const itemId = document.getElementById("itemId").value;
    console.log("Searching for item:", itemId);  // Debug log
    
    try {
        const response = await fetch(`/api/search?itemId=${itemId}`);
        const data = await response.json();
        console.log("Search response:", data);  // Debug log
        
        const resultDiv = document.getElementById("result");
        if (data.found) {
            const item = data.item;
            resultDiv.innerHTML = `
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>Item ID: ${item.itemId}</p>
                    <p>Location: Container ${item.containerId}</p>
                    <p>Position: ${JSON.stringify(item.position)}</p>
                </div>`;
        } else {
            resultDiv.innerHTML = "<p class='not-found'>Item not found</p>";
        }
    } catch (error) {
        console.error("Search error:", error);
        document.getElementById("result").innerHTML = 
            "<p class='error'>Error searching for item</p>";
    }
}

async function viewLogs() {
    const response = await fetch("/api/logs");
    const data = await response.json();
    const logsDiv = document.getElementById("logs");
    if (data.logs.length === 0) {
        logsDiv.innerHTML = "No logs found";
        return;
    }
    let html = "<table border='1'><tr><th>Timestamp</th><th>User</th><th>Action</th><th>Item</th><th>Details</th></tr>";
    data.logs.forEach(log => {
        html += `<tr>
            <td>${log.timestamp}</td>
            <td>${log.userId}</td>
            <td>${log.actionType}</td>
            <td>${log.itemId}</td>
            <td>${JSON.stringify(log.details)}</td>
        </tr>`;
    });
    html += "</table>";
    logsDiv.innerHTML = html;
}

async function retrieveItem() {
    const itemId = document.getElementById("retrieveItemId").value;
    const userId = document.getElementById("retrieveUserId").value;
    const timestamp = document.getElementById("retrieveTimestamp").value;
    const response = await fetch("/api/retrieve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, userId, timestamp })
    });
    const data = await response.json();
    const resultDiv = document.getElementById("retrieveResult");
    if (data.success) {
        resultDiv.innerHTML = `Item ${itemId} retrieved successfully`;
    } else {
        resultDiv.innerHTML = "Failed to retrieve item";
    }
}

async function identifyWaste() {
    const currentDate = document.getElementById("wasteDate").value;
    try {
        const response = await fetch(`/api/waste/identify?currentDate=${currentDate}`);
        const data = await response.json();
        const resultDiv = document.getElementById("wasteResult");
        
        if (data.wasteItems.length === 0) {
            resultDiv.innerHTML = "<p class='not-found'>No waste items found</p>";
            return;
        }
        
        let html = `<table>
            <tr><th>Item ID</th><th>Container</th><th>Reason</th></tr>`;
        data.wasteItems.forEach(item => {
            html += `<tr>
                <td>${item.itemId}</td>
                <td>${item.containerId}</td>
                <td>${item.reason.join(", ")}</td>
            </tr>`;
        });
        html += "</table>";
        resultDiv.innerHTML = html;
    } catch (error) {
        console.error("Waste identification error:", error);
        document.getElementById("wasteResult").innerHTML = 
            "<p class='error'>Error identifying waste items</p>";
    }
}

async function generateReturnPlan() {
    const maxWeight = document.getElementById("maxWeight").value;
    const weightUnit = document.getElementById("weightUnit").value;
    const containerId = document.getElementById("undockingContainer").value;

    let maxWeightInKg = parseFloat(maxWeight);
    if (weightUnit === "lbs") {
        maxWeightInKg = maxWeightInKg * 0.453592;  // Convert lbs to kg
    }

    try {
        const response = await fetch("/api/waste/return-plan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                maxWeight: maxWeightInKg,
                undockingContainerId: containerId
            })
        });
        const data = await response.json();
        const resultDiv = document.getElementById("returnPlanResult");
        resultDiv.innerHTML = `
            <div class="plan-details">
                <p>Total Weight: ${data.totalWeight} kg</p>
                <p>Items to Move: ${data.items.join(", ")}</p>
            </div>`;
    } catch (error) {
        console.error("Return plan error:", error);
        document.getElementById("returnPlanResult").innerHTML = 
            "<p class='error'>Error generating return plan</p>";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const getStartedButton = document.querySelector(".cta-button");
    getStartedButton.addEventListener("click", function(event) {
        event.preventDefault();
        const mainContent = document.getElementById("main-content");
        mainContent.scrollIntoView({ behavior: "smooth" });
    });

    const infoButtons = document.querySelectorAll(".info-button");
    infoButtons.forEach(button => {
        button.addEventListener("mouseover", function() {
            const tooltip = button.nextElementSibling;
            tooltip.style.display = "block";
        });
        button.addEventListener("mouseout", function() {
            const tooltip = button.nextElementSibling;
            tooltip.style.display = "none";
        });
    });
});