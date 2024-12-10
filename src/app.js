const express = require('express');
const connectDB = require('./config/database');
const User = require('./model/user');

const app = express()

app.use(express.json());

app.post('/signup',async(req,res) => {
    const user = new User(req.body);
    try{
        await user.save();
        res.send("User saved successfully.");
    }catch(err){
        res.send("Error saving user in to database.");
    }
})

connectDB().then(() => {
    console.log("Databse connection established.");
    app.listen(3000, () => {
        console.log("Server is listening on port 3000");
    });
}).catch((err) => {
    console.log("Databse connecting error.");
})





