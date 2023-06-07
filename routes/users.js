const express= require("express");
//const {auth, authAdmin} = require("../middlewares/auth");
const {UserModel} = require("../models/userModel");
const bcrypt = require("bcrypt");
const {validateUser} = require("../validation/userValidation")
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

module.exports = router;


