import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import ratingRoutes from "./routes/ratings.js";
import bookingsRoute from "./routes/bookings.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
dotenv.config()

const port = 5000;

const connect = async () => {
try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB!")
} catch (error) {
    throw error;
}
};

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected!")
})
mongoose.connection.on("connected", () => {
    console.log("MongoDB connected!")
})
 
//middleware  
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../client/build')));

// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.send('Hello From Server Side!');
});

// Test route
app.get('/test', (req, res) => {
  console.log('Test route accessed');
  res.send('This is a test route');
});

// Health check route
app.get('/health', (req, res) => {
   res.status(200).send('OK');
});

app.use("/api/auth",authRoute);
app.use("/api/hotels",hotelsRoute);
app.use("/api/rooms",roomsRoute);
app.use("/api/users",usersRoute);
app.use("/api/ratings", ratingRoutes);
app.use("/api/bookings",bookingsRoute);

// Catch-all route for undefined routes
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.url}`);
  res.status(404).send('404 - Not Found');
});

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    });
});

app.listen(port, () => {
    connect();
    console.log(`Server is running on ${port}`);
})
