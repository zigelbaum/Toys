const express= require("express");
//const {auth, authAdmin} = require("../middlewares/auth");
const {UserModel} = require("../models/userModel");
const bcrypt = require("bcrypt");
const {validateUser,validateLogin} = require("../validation/userValidation")
const{createToken}=require("../helperFunctions/userHelper")
const router = express.Router();


// router.get("/myEmail", auth, async (req, res) => {
router.get("/myEmail",  async (req, res) => {
  try {
    let user = await UserModel.findOne({ _id: req.tokenData._id }, { email: 1 });
    res.json(user);
  }
  catch (err) {
    console.log(error);
    res.status(500).json({ msg: "err", err })
  }
})


//user sign up to db
router.post("/",async (req, res) => {
  let validBody = validateUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = new UserModel(req.body);
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    user.password = "***";
    res.status(201).json(user);
  }
  catch (err) {
    if (err.code == 11000) {
      return res.status(500).json({ msg: "Email already exists in the system, go to log in", code: 11000 })

    }
    console.log(err);
    res.status(500).json({ msg: "err in user sign up", err })
  }
});

//user login to db
router.post("/login",async (req, res) => {
    let validBody = validateLogin(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      //check if the email exists in the db
      let user = await UserModel.findOne({ email: req.body.email })
      if (!user) {
        return res.status(401).json({ msg: "Password or email is incorrect ,code:1" })
      }
      // check if the password entered matches the encrypted password in the db
      let isPassword = await bcrypt.compare(req.body.password, user.password);
      if (!isPassword) {
        return res.status(401).json({ msg: "Password or email is incorrect ,code:2" });
      }
      //Generate a token with the user's ID
      let token = createToken(user._id, user.role);
      res.json({ token });
    }
    catch (err) {
      console.log(err)
      res.status(500).json({ msg: "error in user login", err })
    }
  });

module.exports = router;
