const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, "public")));
app.use(cookieParser());

app.get("/cookie", function(req, res) {
  res.send(req.query.cookie);
});

app.listen(3001);
