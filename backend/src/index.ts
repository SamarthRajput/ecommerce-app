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
app.use(cors({
    origin: ['http://localhost:3000', 'http://192.168.74.60:3000'],
    credentials: true,
}));

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
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});