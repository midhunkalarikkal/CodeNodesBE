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
        res.send("Error saving user in to database."+err.message);
    }
})

app.get('/user',async(req,res) => {
    const userEmail = req.body?.emailId;
    try{
        const user = await User.findOne({ emailId : userEmail });
        if(!user){
            res.send("User not found.");
        }else{
            res.send(user);
        }
    }catch(err){
        res.send("Something went wrong.");
    }
})

app.get('/feed',async(req,res) => {
    try{
        const users = await User.find();
        res.send(users);
    }catch(err){
        res.send("Something went wrong.");
    }
})

app.delete('/user',async (req,res) => {
    const userId = req.body?.userId;
    try{
        await User.findByIdAndDelete(userId);
        res.send("User deleted successfully.");
    }catch(err){
        res.send("User deletion error.")
    }
})

app.patch('/user',async (req,res) => {
    const data = req.body;
    const userId = data?.userId;
    try{
        await User.findByIdAndUpdate(userId, data);
        res.send("User updated successfully.");
    }catch(err){
        res.send("User updation error.");
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





