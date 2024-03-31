const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Listing = require("./models/listing")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));


main()
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}
app.get("/", (req, res) => {
  res.send("working fine");
});



// index route
app.get("/listing", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listing/index.ejs", { allListings });
});


// New route


app.get("/listing/new", (req, res) => {
  res.render("listing/new.ejs");
});

// create route

app.post("/listing", async (req, res, next) => {
  try {
    const newList = new Listing(req.body.listing);
  await newList.save();
  res.redirect("/listing");
  } catch (err) {
    next(err);
  }
});


// particular listing show route
app.get("/listing/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listing/show.ejs", { listing });
});

// edit page route

app.get("/listing/:id/edit", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(`${id}`);
  res.render("listing/edit.ejs", { listing });
});

//update route

app.put("/listing/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  let listing = await Listing.findById(`${id}`);
  res.render("listing/show.ejs", { listing });
});


// Delete Route

app.delete("/listing/:id", async (req, res) => {
  let { id } = req.params;
  let dleteted = await Listing.findByIdAndDelete(id);
  console.log(dleteted);
  res.redirect("/listing");
});

app.use((err,req,res,next)=>{
  res.send("Something went wrong");
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

// function wrapAsync(fn){
//   return function (req, res, next) {
//     fn(req, res, next).catch((err)=> next(err));
//   }
// }