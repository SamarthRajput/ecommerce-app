import express from "express";
import cors from "cors";
import { buyerRouter } from "./routes/buyer";
import { sellerRouter } from "./routes/seller";
import { analyticsRouter } from "./routes/analytics";
import { listingRouter } from "./routes/listing";
import { authRouter } from "./routes/adminAuthRouter";
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

app.use("/api/v1/auth", authRouter);

app.get("/", (req, res) => {
    res.send("Welcome to the API");
});

app.listen(3001, () => {
    console.log(`Server is running on http://localhost:3001`);
    console.log(`Listening on port ${3001}`)
});