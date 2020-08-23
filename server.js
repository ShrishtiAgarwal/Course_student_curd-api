const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//const router = express.Router()
// Students API routes
app.use(express.json())
app.use("/api/auth",require("./src/auth"));


app.use("/api/courses", require("./src/courses"));


app.use("/api/student", require("./src/student"));
app.listen(3000, () =>
    console.log("Server started")
)
