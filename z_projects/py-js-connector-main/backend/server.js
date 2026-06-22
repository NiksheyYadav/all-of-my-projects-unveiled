const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const fs = require("fs");
const csv = require("csv-parser");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "50mb" })); // increased payload limit

// Root route placed at the top
app.get("/", (req, res) => {
    const status = {
        status: "running",
        timestamp: new Date().toISOString()
    };
    console.log("Status route hit:", status);
    res.json(status);
});

// Endpoint to return record.csv as JSON
app.get("/get-records", (req, res) => {
    const results = [];
    const filePath = "record.csv";
  
    if (!fs.existsSync(filePath)) {
      return res.json([]);
    }
  
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        // Add optional IDs
        const dataWithId = results.map((row, index) => ({ id: index + 1, ...row }));
        res.json(dataWithId);
      });
  });

app.post("/run-python", (req, res) => {
    console.log("Received request body:", req.body); // Log incoming request
    const { name, imageData, imageType } = req.body;

    if (!name || !imageData || !imageType) {
        console.error("Missing required fields in request body");
        res.status(400).json({ error: "Missing required fields: name, imageData, or imageType" });
        return;
    }

    const args = [name, imageType];
    const pythonProcess = spawn("python", ["script.py", ...args]);

    // Write imageData to Python process via stdin
    pythonProcess.stdin.write(imageData);
    pythonProcess.stdin.end();

    let pythonData = "";

    pythonProcess.stdout.on("data", (data) => {
        pythonData += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error(`Python STDERR: ${data.toString()}`);
    });

    pythonProcess.on("error", (err) => {
        console.error("Failed to spawn python process:", err);
        res.status(500).json({ error: "Failed to start python process." });
    });

    pythonProcess.on("close", (code) => {
        console.log(`Python script exited with code ${code}`);
        const lines = pythonData.split(/\r?\n/).filter(line => line.trim() !== "");
        console.log("Python output lines:", lines);
        const jsonLine = lines[lines.length - 1];
        console.log("JSON line from Python:", jsonLine);
        try {
            const result = JSON.parse(jsonLine);
            console.log("Parsed result:", result);
            res.json(result); // Return the parsed result to the frontend
        } catch (error) {
            console.error("JSON parse error:", error, "Original data:", pythonData);
            res.status(500).json({ error: "Failed to parse Python response" });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
