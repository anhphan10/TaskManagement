const mongoose = require("mongoose");
module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_ULR);
        console.log("Connect success");
    } catch (error) {
        console.log("Connect Error!")
    }
}