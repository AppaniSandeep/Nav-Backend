const express = require("express")
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const AuthRouter = require("./Routes/AuthRouter")
require("dotenv").config();
require("./Models/db");


app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}
));
app.use("/auth",AuthRouter)

const PORT = process.env.PORT || 8080;



app.listen(PORT,() => {
    console.log(`Server running at ${PORT}`)
})
