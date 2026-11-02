require("dotenv").config();

const express = require("express");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = 3000;

if (!process.env.GEMINI_API_KEY) {
    console.error("❌ Missing GEMINI_API_KEY in .env");
    process.exit(1);
}

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.use(express.json({ limit: "20kb" }));

// Serve our existing website
app.use(express.static(__dirname));

// Receive questions from the website
app.post("/api/chat", async (req, res) => {
    try {
        const message = req.body.message;

        if (typeof message !== "string" || !message.trim()) {
            return res.status(400).json({
                error: "Please enter a message."
            });
        }

        if (message.length > 4000) {
            return res.status(400).json({
                error: "Your message is too long."
            });
        }
const controller = new AbortController();

const timeout = setTimeout(() => {
    controller.abort();
}, 30000);

let response;

try {
    response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: message.trim(),
        config: {
            abortSignal: controller.signal
        }
    });
} finally {
    clearTimeout(timeout);
}

        res.json({
            reply: response.text || "I couldn't generate a response."
        });
    } catch (error) {
    console.error("GEMINI ERROR DETAILS:");
    console.error("Name:", error.name);
    console.error("Message:", error.message);
    console.error("Status:", error.status || error.statusCode);

    res.status(500).json({
        error: error.message || "Unknown Gemini error"
    });
}
});

app.listen(PORT, "127.0.0.1", () => {
    console.log(`🤖 GENIUS AI server running at http://127.0.0.1:${PORT}`);
});
