const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, "public")));
app.use(cookieParser());

let defaultComment = {
  time: new Date().toLocaleString(),
  avatar: "http://www.gravatar.com/avatar/836875012qq.com.png"
};
let comments = [{ username: "张三", content: "今天下雨", ...defaultComment }];

app.get("/api/comments", function(req, res) {
  res.json({ code: 0, comments });
});

//后台过滤
function htmlEscape(str) {
  return String(str)
    .replace(/>/g, "&gt;")
    .replace(/</g, "&lt;")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

app.post("/api/comments", function(req, res) {
  let session = sessions[req.cookies.sessionId];
  if (session && session.user) {
    let comment = req.body;
    comments.push({
      ...defaultComment,
      username: session.user.username,
      content: htmlEscape(comment.content)
    });
    res.json({ code: 0 });
  } else {
    res.json({ code: 1, error: "用户未登陆,不能发表评论" });
  }
});

let users = [
  { username: "a", password: "a" },
  { username: "b", password: "b" }
];

function getAdmin(user) {
  for (let i = 0; i < users.length; i++) {
    if (
      users[i].username == user.username &&
      users[i].password == user.password
    ) {
      return users[i];
    }
  }
}

let sessions = {};

app.post("/api/login", function(req, res) {
  let body = req.body;
  let user = getAdmin(body);
  if (user) {
    let sessionId = "session-" + Date.now() + Math.random() * 1000;
    res.cookie("sessionId", sessionId, { httpOnly: true });
    sessions[sessionId] = { user };
    res.json({ code: 0, user });
  } else {
    res.json({ code: 1, error: "用户密码错误" });
  }
});

app.listen(3002);
