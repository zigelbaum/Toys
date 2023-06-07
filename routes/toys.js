const express = require("express");
const { validateToy } = require("../validation/toyValidation");
const { ToyModel } = require("../models/toyModel");
const { auth, authAdmin } = require("../middlewares/auth");
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


router.get("/prices", async (req, res) => { //works
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  let sort = req.query.sort || "price"
  let reverse = req.query.reverse == "yes" ? -1 : 1;
  try {
    let min = req.query.min;
    let max = req.query.max;
    if (min && max) {
      let data = await ToyModel.find({ $and: [{ price: { $gte: min } }, { price: { $lte: max } }] })

        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse })
      res.json(data);
    }
    else if (max) {
      let data = await ToyModel.find({ price: { $lte: max } })
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse })
      res.json(data);
    } else if (min) {
      let data = await ToyModel.find({ price: { $gte: min } })
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse })
      res.json(data);
    } else {
      let data = await ToyModel.find({})
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse })
      res.json(data);
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "couldnt retrieve data due to an error", err })
  }
})


router.get("/category/:cat", async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;

  try {
    let catName = req.params.cat;
    let catReg = new RegExp(catName, "i");
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


router.get("/single/:id", async (req, res) => { //works
  let id = req.params.id;
  let singleToy = await ToyModel.find({ _id: id });
  if (!singleToy) {
    return res.json({ msg: "toy not found" })
  }
  res.json(singleToy)
})


//authentication to validate it's a user and not a guest
router.post("/", auth, async (req, res) => {
  let validateBody = validateToy(req.body);
  if (validateBody.error) {
    return res.status(400).json(validateBody.error.details);
  }
  try {
    let toy = new ToyModel(req.body);
    toy.user_id = req.tokenData._id;
    await toy.save();
    res.status(201).json(toy);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err failed to add toy to db", err });
  }
})


router.put("/:idEdit", auth, async (req, res) => {
  let valdiateBody = validateToy(req.body);
  if (valdiateBody.error) {
    return res.status(400).json(valdiateBody.error.details);
  }
  try {
    let idEdit = req.params.idEdit;
    let data;
    if (req.tokenData.role == "admin") {
      data = await ToyModel.updateOne({ _id: idEdit }, req.body);
    } else { 
      data = await ToyModel.updateOne({ _id: idEdit, user_id: req.tokenData._id }, req.body); 
    }
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err couldn't update toy", err })
  }
})


router.delete("/:idDel", auth, async (req, res) => {
  try {
    let idDel = req.params.idDel;
    let data;
    if (req.tokenData.role == "admin") {
      data = await ToyModel.deleteOne({ _id: idDel })
    }
    else {
      data = await ToyModel.deleteOne({ _id: idDel, user_id: req.tokenData._id })
    }
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err, couldn't delete the item from db", err })
  }
})


module.exports = router;