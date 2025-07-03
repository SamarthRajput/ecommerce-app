import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

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


// Configs
dotenv.config();
const app = express();

// Middlewares
// app.use(cors({
//     origin: ['http://localhost:3000', 'http://10.109.51.60:3000','https://ecommerce-app-production-2f67.up.railway.app'],
//     credentials: true,
// }));

// Middlewares
const corsOptions = {
  origin: 'https://ecommerce-app-rho-five.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/v1/buyer", buyerRouter);
app.use("/api/v1/seller", sellerRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/listing", listingRouter);
app.use("/api/v1/rfq", rfqRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/chat", chatRouter);

// Root route
app.get("/", (req, res) => {
    res.send("Welcome to the API");
});

// Server start
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    const actualPort = (server.address() as any).port;
    console.log(`✅ Server is running on port ${actualPort}`);
});