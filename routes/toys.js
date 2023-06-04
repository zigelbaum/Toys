const express = require("express");
const { validateToy } = require("../validation/toyValidation");
const { ToyModel } = require("../models/toyModel");
const router = express.Router();


router.get("/", async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? -1 : 1;

  try {
    let data = await ToyModel
      .find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err couldn't load toys", err });
  }
})


router.get("/search", async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  try {
    let queryS = req.query.s;
    let searchReg = new RegExp(queryS, "i")
    // {$or:[{name:searchReg}, {manufacturer:searchReg},{info:searchReg}]}
    let data = await ToyModel.find({ $or: [{ name: searchReg }, { info: searchReg }] })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ _id: -1 })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error in serch get query, try again later", err })
  }
})



router.get("/category/:cat", async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;

  try {
    let catName = req.params.cat;
    let catReg = new RegExp(catName, "i")
    let data = await ToyModel.find({ category: catReg })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ _id: -1 })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error get toys by category, try again later", err })
  }
})


router.post("/", async (req, res) => {
  let validateBody = validateToy(req.body);
  if (validateBody.error) {
    return res.status(400).json(validateBody.error.details);
  }
  try {
    let toy = new ToyModel(req.body);
    // toy.user_id = req.tokenData._id;
    await toy.save();
    res.status(201).json(toy);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err failed to add toy to db", err });
  }
})




module.exports = router;