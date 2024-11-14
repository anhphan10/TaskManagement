const express = require("express");
const database = require("./config/database");
require("dotenv").config();
const routeApiVer1 = require("./api/v1/routes/index.route");
const app = express();
const port = process.env.PORT;
const bodyParser = require("body-parser")

//parser application/json
app.use(bodyParser.json());

database.connect();
routeApiVer1(app);



app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});