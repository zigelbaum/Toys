// getting-started.js
const mongoose = require('mongoose');
const {config}=require('../config/secret')
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`mongodb+srv://{config.userDb}:{config.passDb}@cluster1.mqgr2av.mongodb.net/Toys_Api`);
  // mongodb+srv://elisheva777:eli777me@cluster1.mqgr2av.mongodb.net/
  // await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@cluster1.mqgr2av.mongodb.net/Toys_Api`);
  console.log("mongo connect");

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}