import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import morgan from "morgan";
import { config } from "dotenv";

// Import custom modules
import { loadTestEvent } from "./utils/eventLoader.mjs";
import { createMockContext } from "./utils/lambdaContext.mjs";
import { reqToEvent } from "./utils/requestTransformer.mjs";
import { processLambdaResponse } from "./utils/processLambdaResponse.mjs";
import { handler } from "../src/index.mjs";

// Initialize environment variables
config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.SERVER_PORT || 3000;
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // HTTP request logging

// Handler for direct Lambda invocation with static events
app.get("/invoke/:eventName?", async (req, res) => {
  try {
    const eventName = req.params.eventName;
    const mockContext = createMockContext();
    const event = await loadTestEvent(eventName);

    console.log(`Invoking Lambda with event "${eventName || "example-event.json"}"`);
    const result = await handler(event, mockContext);

    processLambdaResponse(result, res);
  } catch (error) {
    console.error("Error invoking Lambda handler:", error);
    res.status(500).json({
      error: "Error invoking Lambda handler",
      message: error.message,
      stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
    });
  }
});

// Help endpoint
app.get("/help", (req, res) => {
  res.json({
    message: "Local Lambda Server",
    endpoints: {
      "/invoke": "Invokes the Lambda handler with example-event.json",
      "/invoke/:eventName": "Invokes the Lambda handler with the specified event file",
      "/*": "Invokes the Lambda with an event created from the incoming request",
    },
    examples: {
      "GET /invoke": "Uses events/example-event.json",
      "GET /invoke/custom-event.json": "Uses events/custom-event.json",
      "POST /api/users": "Creates a Lambda event from this HTTP request",
    },
  });
});

// Handle all other routes by transforming the request into a Lambda event
app.all("*", async (req, res) => {
  try {
    const mockContext = createMockContext();
    const event = await reqToEvent(req);

    console.log("Invoking Lambda with event from request");
    const result = await handler(event, mockContext);

    processLambdaResponse(result, res);
  } catch (error) {
    console.error("Error invoking Lambda handler:", error);
    res.status(500).json({
      error: "Error invoking Lambda handler",
      message: error.message,
      stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Local Lambda server started at http://localhost:${PORT}`);
  console.log("Available endpoints:");
  console.log(`  - http://localhost:${PORT}/invoke`);
  console.log(`  - http://localhost:${PORT}/invoke/{eventName}`);
  console.log(`  - http://localhost:${PORT}/help`);
  console.log(`  - Any other path will create an event from the request`);
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down server...");
  process.exit(0);
});
