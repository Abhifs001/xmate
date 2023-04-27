require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const multer = require("multer");
const mysql = require("mysql");
const path = require("path");
const PORT = process.env.PORT || 8000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// create constants for the application.
const constants = {
  matchRequestStatus: {
    pending: 0,
    accepted: 1,
    rejected: -1,
  },
};

// config multers.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}.jpg`);
  },
});

const upload = multer({ storage: storage });

// create datbase connection
const dbConn = mysql.createConnection({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER_NAME || "root",
  password: process.env.DB_USER_PASSWORD || "abhinavPandey@123",
  database: process.env.DB_NAME || "x_mate",
  port: process.env.DB_PORT || "3306",
});

dbConn.connect(function (err) {
  if (err) {
    console.log(err);
    // throw err;
  }
  console.log("Database was connected");
  require("./routes")({ app, dbConn, upload, constants });
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
