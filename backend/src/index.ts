import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { config } from "./config/env";
import { connectDatabase } from "./config/database";
import authRoutes from "./routes/auth.route";
import tenantRoutes from "./routes/tenant.route";
import noteRoutes from "./routes/notes.route";


dotenv.config()

const app = express()
const PORT = config.port;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

// Security middleware
app.use(helmet());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  }
});
app.use(limiter);

//api routes
app.use("/api/auth", authRoutes)
app.use("/api/tenants", tenantRoutes)
app.use("/api/notes", noteRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();