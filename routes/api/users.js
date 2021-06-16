const express = require("express");
let router = express.Router();
let { User } = require("../../models/user");
var bcrypt = require("bcryptjs");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");
//get products
router.get("/allusers",async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let users = await User.find().skip(skipRecords).limit(perPage);
  return res.send(users);
});
//get single products
router.get("/allusers/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user)
      return res.status(400).send("Product With given ID is not present"); //when id is not present id db
    return res.send(user); //everything is ok
  } catch (err) {
    return res.status(400).send("Invalid ID"); // format of id is not correct
  }
});
router.post("/register", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User with given Email already exist");
  user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  let salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  return res.send(_.pick(user, ["name", "email"]));
});
router.post("/login", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("User Not Registered");
  let isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid) return res.status(401).send("Invalid Password");
  let token = jwt.sign(
    { _id: user._id, name: user.name },
    config.get("jwtPrivateKey")
  );
  res.send(token);
});
module.exports = router;