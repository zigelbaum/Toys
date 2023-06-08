// getting-started.js
const mongoose = require('mongoose');
const {config}=require('../config/secret')
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://elishevaronstam:eli777me@cluster0.q9ao7bf.mongodb.net/Toys_Api')

  console.log("mongo connect");

}