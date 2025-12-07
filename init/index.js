const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust"

main().then(()=>{
    console.log("connected to DB ");
}).catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL)
}

const initDB = async ()=>{
    await Listing.deleteMany({});

    // ObjectId import
    const ObjectId = mongoose.Types.ObjectId;

    initData.data = initData.data.map((obj)=>({
        ...obj,
        owner: new ObjectId("68ed1e0905189d4de5d36975")  
    }));

    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

initDB();
