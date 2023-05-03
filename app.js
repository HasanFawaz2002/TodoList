const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();


app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB",{useNewUrlParser: true}).then(()=>console.log("MongoDb is connected")).catch(err=>console.log(err));

const itemScehma = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item",itemScehma);

const item1 = new Item({
    name:"welcome to your todolist!"
});

const item2 = new Item({
    name:"Hit the + button to aff a new item."
});

const item3 = new Item({
    name:"<-- Hit this to delete an item."
});


async function getItems(){

    const Items = await Item.find({});
    return Items;
}


const defaultItems = [item1,item2,item3];


app.get("/",(req,res)=>{

    getItems().then(function(FoundItems){

        if (FoundItems.length === 0) {
            Item.insertMany(defaultItems).then(()=>{
                console.log("Items inserted")
            }).catch(err=>console.log(err));
            res.redirect("/");
        }else{
            res.render("list", {kindOfDay: "Today", newListItems:FoundItems});
        }    
    });
});



app.post("/",(req,res)=>{
    let itemName =req.body.newItem;

    const item = new Item({
        name: itemName
    })
    item.save();
    res.redirect("/");
});

app.post("/delete", (req,res)=>{
    const checkedId = req.body.checkbox;
    Item.findByIdAndRemove(checkedId).then(()=>{
        console.log("Deleted");
    }).catch(err=>console.log(err));
    res.redirect("/");
});




app.listen(3000 , ()=>{
    console.log("Server is running on port 3000");
})