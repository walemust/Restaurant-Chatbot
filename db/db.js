const mongoose = require('mongoose');
const CONFIG = require('../config/config');

function dbConnect() {
    mongoose.connect(CONFIG.MONGO_URL)

    mongoose.connection.on("connected", () => {
        console.log("Mongodb connected successfully");
    })

    mongoose.connection.on("error", (err) => {
        console.log("An error occured");
        console.log(err);
    })
}

module.exports = { dbConnect };