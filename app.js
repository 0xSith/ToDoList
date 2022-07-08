const express = require("express");
const bodyParser = require("body-parser");
let items = [];
let workItems = [];
const app = express();
const date = require(__dirname + "/date.js");


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));

app.get("/", (req, res) => {

  date.getDate();

  res.render("list", {
    listTitle: day,
    newItems: items,
  });
})

app.get("/work",(req,res) => {
  res.render("list", {listTitle: "Work", newItems: workItems});
})

app.get("/about", (req,res) => {
  res.render("about");
})

app.post("/", (req, res) => {
  let item = req.body.newItem;
  if(req.body.button === "Work"){
    workItems.push(item);
    res.redirect("/work");
  }
  else{
    items.push(item);
    res.redirect("/");
  }
})


app.listen(3000, (req, res) => {
  console.log("Server is up and running on port 3000");
})
