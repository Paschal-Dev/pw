import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const PORT = 3001;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Webhook endpoint
app.post("/pay/webhook", async (req, res) => {
  try {
    // Access POST data
    const postData = req.body;

    console.log("Received POST data:", postData);

    // Forward the data to another URL
    const response = await axios.post("https://another-url.com/endpoint", postData);

    // Send a success response back to the sender
    res.status(200).json({ message: "Data forwarded successfully", response: response.data });
  } catch (error) {
    console.error("Error forwarding data:", error.message);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
