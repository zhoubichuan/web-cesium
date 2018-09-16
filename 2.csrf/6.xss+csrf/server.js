const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, "public")));

let defaultComment = {
  time: new Date().toLocaleString(),
  avatar: "http://www.gravatar.com/avatar/836875012qq.com.png"
};
let comments = [
  { username: "张三", content: "今天下雨没带伞", ...defaultComment },
  { username: "李四", content: "今天没带伞", ...defaultComment }
];
app.get("/api/comments", function(req, res) {
  res.json({ code: 0, comments });
});

app.post("/api/comments", function(req, res) {
  let comment = req.body;
  comments.push({
    ...defaultComment,
    username: comment.username,
    content: comment.content
  });
  res.json({ code: 0 });
});
app.listen(3001);
