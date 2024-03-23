const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Listing = require("./models/listing")
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

main().then(() => {
  console.log("connected");
}).catch((err) => {
  console.log(err);
})
async function main(){
  await mongoose.connect("mongodb://127.0.0.1:27017/airbnb")
}
app.get("/", (req, res) => {
  res.send("working fine")
})

// index route
app.get("/listing",async(req, res)=> {
  const allListings = await Listing.find({});
  res.render("listing/index.ejs",{allListings})
})


// particular listing show route
app.get("/listing/:id",async (req, res) => {
  let { id } = req.params;
  const listing= await Listing.findById(id);
  console.log(id);
  res.send(`${listing}`)
})


app.listen(5000, () => {
  console.log("server is runnign is at port number 5000");
});



// app.get("/testListing",async (req, res) => {
//   let sampleListing = new Listing({
//     title: "my new villa",
//     description: "in front on bandra beach",
//     price: 10000,
//     location: "Bandra",
//     country: "India"
//   });
//   await sampleListing.save();
//   console.log("saved");
//   res.send("successfull")
// })