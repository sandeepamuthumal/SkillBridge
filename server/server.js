import "./src/config/envLoader.js";
import { app } from "./src/app.js";
import {
    connectDB
} from "./src/config/database.js";

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`
 SkillBridge Server is running!
 Mode: ${process.env.NODE_ENV}
 Port: ${PORT}
 URL: http://localhost:${PORT}
  `);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log("Unhandled Rejection:", err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception:", err.message);
    process.exit(1);
});