const express = require("express");
const app = express();
const database = require("./config/db.js");
require("dotenv").config();

const PORT = 8000;
database.dbConnect();

const userRoutes = require("./routes/user.route.js");
const candidateRoutes = require("./routes/candidate.router.js");


app.get('/', (req, res) => {
    res.send(`Server is Up and Running...`);
})

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/v1/user/', userRoutes);
app.use('/api/v1/candidate', candidateRoutes);

const logReqs = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] Request made to route: ${req.originalUrl}`);
    next();
}
app.use(logReqs);

app.listen(PORT, () => {
    console.log(`Server is Running at: ${PORT}`);
})