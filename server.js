const express = require('express')
const app = express()
const bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//const router = express.Router()

app.use("/api/courses", require("./src/courses"));

// Students API routes
app.use("/api/student", require("./src/student"));
app.listen(3000, () =>
    console.log("Server started")
)
