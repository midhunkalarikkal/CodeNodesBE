const mongoose = require('mongoose');

const connectDB = async () => {
        await mongoose.connect("mongodb+srv://midhunkpaniker:acpaVOaNX2Hje1i8@cluster0.bvv3j.mongodb.net/codeNodes")
}

module.exports = connectDB;