const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, "public")));

const goods = {
  book: [{ name: "变形计" }, { name: "双城记" }],
  electronic: [{ name: "ipad", name: "iphone" }]
};

app.get("/goods", function(req, res) {
  let { category } = req.query;
  res.header("Content-Type", "text/html;charset=utf-8");
  let currentGoods = goods[category];
  let detail = "";
  if (currentGoods) {
    detail = currentGoods.map(item => `<li>${item.name}</li>`).join();
  } else {
    detail = "此分类下面没有商品";
  }
  res.send(`
  <h1>你选择的商品分类是：${category}</h1>
  <ul>${detail}</ul>
  `);
});
app.listen(3000, () => {
  console.log("The server is starting at port 3000");
});

//访问如下链接
//http://localhost:3000/goods?category=book%3Cscript%3Ealert(1)%3C/script%3E
