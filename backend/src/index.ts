import express from "express";
import cors from "cors";
import { buyerRouter } from "./routes/buyer";
const app = express();
app.use(cors());


app.use(express.json());
// All requests that will come to /api/v1/buyer will go to
app.use("/api/v1/buyer", buyerRouter);


app.listen(3001, () => {
    console.log(`Listening on port ${3001}`)
});