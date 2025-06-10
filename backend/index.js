const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());

app.listen(3001);