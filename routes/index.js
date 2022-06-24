var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var mongodb = require('mongodb')
require("dotenv").config();
const pin = require("../models/pin");
const user = require("../models/user");
const { hashing, hashCompare, createjwt, auth } = require("../library/auth");

mongoose
  .connect(process.env.URL)
  .then(() => console.log("db connected successfully"))
  .catch((error) => console.log(error));
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// create a pin

router.post("/pins", async (req, res) => {
  try {
    let pins = new pin(req.body);

    pins.save((err, data) => {
      if (err) {
        console.log(err);
        res.json({ statuscode: 400, message: "Email Already Exist" });
      } else {
        res.json({
          statuscode: 200,
          data: data,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

// get all pins
router.get("/getpins", async (req, res) => {
  try {
    const result = await pin.find();

    res.json({
      statuscode: 200,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

// register
router.post("/register", async (req, res) => {
  try {
    let hash = await hashing(req.body.password);
    req.body.password = hash;
    let register = new user(req.body);
    register.save((err, data) => {
      if (err) {
        console.log(err);
        res.json({ statuscode: 400, message: err});
      } else {
        res.json({
          statuscode: 200,
          data: data._id,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    let result = await user.findOne({ username: req.body.username });
    if (result) {
      let result2 = await hashCompare(req.body.password, result.password);
      if (result2) {
        res.json({
          statuscode: 200,
          id:result._id,
          username:result.username
        });
      } else {
        res.json({
          statuscode: 400,
          message:'wrong password'
        })
       
      }
    } else {
      res.json({
        statuscode:400,
        message:'user does not exist'
      })
     
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});
// Delete the pin
router.delete("/delete/:id",async(req,res)=>{
  try{
    console.log(req.params.id)
   await pin.deleteOne({_id: mongodb.ObjectId(req.params.id)})
   res.json('deleted')
  }catch(error){
  console.log(error)
  }
})

module.exports = router;
