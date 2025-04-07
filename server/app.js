import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoSanitze from "express-mongo-sanitize";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import seasonRoutes from "./routes/seasonRoutes.js";
import gameHistoryRoutes from "./routes/gameHistoryRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import friendRequestRoutes from "./routes/friendRequestRoutes.js";
import gameStatsRoutes from "./routes/gameStatsRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import errorController from "./controllers/errorController.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = new express();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Caro League API Project for MongoDB",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8000/", // Local development server
      },
      {
        url: "https://caro-league-backend.onrender.com/", // Production server
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Logging
app.use(morgan("dev"));

//Parsing body
app.use(express.json());

//Sanitize SQL injection
app.use(mongoSanitze());

// Use CORS Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_BASE_URL,
    credentials: true,
  })
);

//Serving static files
app.use(express.static("public"));

//View engine
app.set("view engine", "ejs");

//Cookie
app.use(cookieParser());

//Assign routes
app.use("/", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/seasons", seasonRoutes);
app.use("/api/v1/games", gameHistoryRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/friend-requests", friendRequestRoutes);
app.use("/api/v1/game-stats", gameStatsRoutes);
app.use("/api/v1/conversations", conversationRoutes);
app.use("/api/v1/payments", paymentRoutes);

//Handle undefined route
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

//Handle error global
app.use(errorController);

export default app;
