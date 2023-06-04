const mongoose = require('mongoose');
//const {config} = require("../config/secret");
main().catch(err => console.log(err));


async function main() {
 // if you want use database locali(localhost-3000)
  await mongoose.connect('mongodb://127.0.0.1:27017/Toys_Api');

//   await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@cluster0.wobuehi.mongodb.net/TOYS`);
  console.log("mongo connected to TOYS")
}