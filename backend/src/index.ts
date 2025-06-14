import express from "express";
import cors from "cors";
import router from "./routes/sellerRoutes/route";

const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Backend is running!');
});
  
app.use('/api/seller', router);