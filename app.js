//Globals

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const date = require(__dirname + "/date.js");
const _ = require("lodash");

// Express-EJS preliminary's

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));

//Database code
//Initatilization

mongoose.connect('mongodb+srv://<APPROVEDUSER>:<PASSWORD>@<CLUSTERNAME>.rlegb.mongodb.net/<DB>');


const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model('Item', itemsSchema);
const item1 = new Item({
  name: "Welcome to your To-Do List!"
});
const item2 = new Item({
  name: "Click the '+' below to add an item"
});
const item3 = new Item({
  name: "<--- Click this to delete an item"
});
let defaultItems = [item1, item2, item3];

const listsSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
});
const List = mongoose.model('List', listsSchema);


//Get responses

app.get("/", (req, res) => {
  Item.find((err, foundItems) => {
    date.getDate();
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (!err) {
          console.log("Successfully initiated default items into 'Item' collection.");
        }
      })
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: day,
        newItems: foundItems
      });
    }
  });
});



app.get("/:newListName", (req, res) => {
  const reqName = _.capitalize(req.params.newListName);
  List.findOne({
    name: reqName
  }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: reqName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + reqName);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newItems: foundList.items
        })
      }
    }
  })
})



app.get("/about", (req, res) => {
  res.render("about");
})





//Post requests


app.post("/", (req, res) => {
  const listName = req.body.list;
  const addedItem = new Item({
    name: req.body.newItem
  });

  if (listName === date.getDate()) {
    Item.deleteMany({
      name: {
        $in: [item1.name, item2.name, item3.name]
      }
    }, (err) => {
      if (!err) {
        console.log("Sucessfully deleted default items.");
      }
    });

    addedItem.save();
    res.redirect('/');
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {name:{$in:[item1.name,item2.name,item3.name]} }}}, (err,foundList) => {
      if(!err){
        console.log("Success deleted all default items from user generated list.");
      }
    });

    List.findOne({
      name: listName
    }, (err, foundList) => {
      foundList.items.push(addedItem);
      foundList.save();
      res.redirect('/' + listName);
    });
  }
})



app.post("/delete", (req, res) => {
  const deleteReq = req.body.deleteBox;
  const listName = req.body.listName;

  if (listName === date.getDate()) {
    Item.findByIdAndDelete(deleteReq, (err) => {
      if (!err) {
        console.log("Successfully deleted request item.");
      }
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: deleteReq
        }
      }
    }, (err, foundList) => {
      if (!err) {
        res.redirect("/" + listName);
      }
    })
  }
})





// Server up and running prompt

app.listen(3000, (req, res) => {
  console.log("Server is up and running on port 3000");
})
