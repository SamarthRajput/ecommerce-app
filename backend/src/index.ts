import express from "express";
import cors from "cors";
import { buyerRouter } from "./routes/buyer";
import { sellerRouter } from "./routes/seller";
import { analyticsRouter } from "./routes/analytics";
import { listingRouter } from "./routes/listing";
import { authRouter } from "./routes/adminAuthRouter";
import { adminRouter } from "./routes/admin";
import productRouter from "./routes/product.routes";
import { rfqRouter } from "./routes/rfq.routes";

const app = express();
app.use(cors());


app.use(express.json());
// buyer route
app.use("/api/v1/buyer", buyerRouter);

// seller route
app.use("/api/v1/seller", sellerRouter);

// analytics route
app.use("/api/v1/analytics", analyticsRouter);

// Listing from manager route
app.use("/api/v1/listing", listingRouter);

// rfq router
app.use("/api/v1/rfq", rfqRouter)


app.use("/api/v1/auth", authRouter);

app.use("/api/v1/admin", adminRouter);

app.get("/", (req, res) => {
    res.send("Welcome to the API");
});

// Product Router to fetch products (all , by id, by seller id, similar products)
app.use("/api/v1/products", productRouter);

app.listen(3001, () => {
    console.log(`Server is running on http://localhost:3001`);
    console.log(`Listening on port ${3001}`)
});