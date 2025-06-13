import express from "express";
import cors from "cors";
import { buyerRouter } from "./routes/buyer";
import { sellerRouter } from "./routes/seller";
import { analyticsRouter } from "./routes/analytics";
const app = express();
app.use(cors());


app.use(express.json());
// buyer route
app.use("/api/v1/buyer", buyerRouter);

// seller route
app.use("/api/v1/seller", sellerRouter);

// analytics route
app.use("/api/v1/analytics", analyticsRouter);

app.listen(3001, () => {
    console.log(`Listening on port ${3001}`)
});