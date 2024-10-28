// Import necessary modules
import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer } from "http"; // Import createServer from http
import { initSocket } from "./socket.js"; // Import the socket module

// Set up environment variables
dotenv.config({ path: "./config.env" });

// Connect to the database
await mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
  console.log("DB connection successful!");
});

const PORT = process.env.PORT || 8000; // Define the port

const server = createServer(app); // Create HTTP server using the Express app

const io = initSocket(server); // Initialize Socket.IO with the HTTP server

// Start the server
server.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
  console.log("Mode: " + process.env.NODE_ENV);
});
