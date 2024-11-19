const express = require("express");
const database = require("./config/database");
require("dotenv").config();
const routeApiVer1 = require("./api/v1/routes/index.route");
const app = express();
const port = process.env.PORT;
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
//parser application/json
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
database.connect();

routeApiVer1(app);



app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});