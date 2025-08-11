import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { Request, Response, NextFunction } from "express";

// Route imports
import { buyerRouter } from "./routes/buyer.route";
import { sellerRouter } from "./routes/seller.route";
import { analyticsRouter } from "./routes/analytics";
import { listingRouter } from "./routes/listing.routes";
import { rfqRouter } from "./routes/rfq.routes";
import { authRouter } from "./routes/adminAuthRouter";
import { adminRouter } from "./routes/admin";
import productRouter from "./routes/product.routes";
import chatRouter from "./routes/chat.route";
import certificationRouter from "./routes/certification.routes";
import multer from "multer";
import errorHandler from "./middlewares/errorHandler";


// Configs
dotenv.config();
const app = express();

app.set('trust proxy', 1);

// Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// // Routes
app.use("/api/v1/buyer", buyerRouter);
app.use("/api/v1/seller", sellerRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/listing", listingRouter);
app.use("/api/v1/rfq", rfqRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/certification", certificationRouter);
console.log("all router called");
// Root route
app.get(
  ["/", "/api/v1", "/api", "/welcome", "/home"],
  (req, res) => {
    res.send({
      status: "success",
      message: "Welcome to the API! 🚀",
      version: "1.0.0",
      path: req.originalUrl,
      timestamp: new Date().toISOString()
    });
  }
);


// Catch-All Error Handler
app.use(errorHandler as ErrorRequestHandler);

// 404 Not Found Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: "Not Found" });
});

// Server start
const port = Number(process.env.PORT) || 3001;
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
  const actualPort = (server.address() as any).port;
  console.log(`✅ Server is running on port ${actualPort}`);
});
