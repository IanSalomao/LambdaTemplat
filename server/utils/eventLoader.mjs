import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const eventsDir = path.join(__dirname, "..", "..", "events");

/**
 * Loads a test event file from the events directory
 * @param {string} eventName - Name of the event file to load
 * @returns {Object} The parsed event object
 */
export async function loadTestEvent(eventName) {
  try {
    // If no event name was specified, use example-event.json
    const eventFileName = eventName || "example-event.json";
    const eventPath = path.join(eventsDir, eventFileName);

    // Read the event file
    const eventContent = await fs.readFile(eventPath, "utf8");

    // Parse the content as JSON
    return JSON.parse(eventContent);
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`Event file "${eventName}" not found in events directory`);
    }
    throw new Error(`Failed to load test event "${eventName}": ${error.message}`);
  }
}
