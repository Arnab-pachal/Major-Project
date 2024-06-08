const mongoose = require("mongoose");
const initData = require("../init/data");
const Listing = require("../models/listing");

main().then(()=>{
    console.log("mongoose have been started ");
})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDb = async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"6655d86383e573536c2ddf2a"}))
    await Listing.insertMany(initData.data);
    console.log("data base was initialized");
}
initDb();