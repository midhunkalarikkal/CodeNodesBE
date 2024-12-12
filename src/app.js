const express = require('express');
const connectDB = require('./config/database');
const User = require('./model/user');
const validateSignupData = require('./utils/validate');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const userAuth = require('./middlewares/auth');

const app = express()

app.use(express.json());
app.use(cookieParser());

app.post('/signup',async(req,res) => {
    try{
    validateSignupData(req);
    const { firstName, lastName, emailId, password} = req.body;
    const hashPassword = await bcrypt.hash(password,10)
    const user = new User({
        firstName, lastName, emailId, password : hashPassword
    })
        await user.save();
        res.send("User saved successfully.");
    }catch(err){
        res.send("Something went wrong "+err.message);
    }
})

app.post('/login',async (req,res) => {
    try{
        console.log("/login");
        const { emailId, password } = req.body;
        
        const user = await User.findOne({ emailId : emailId });
        console.log("user : ",user);
        const isPasswordValid = await user.validatePassword(password);
        const token = await user.generateJWT();
        
        if(!user){
            throw new Error("Invalid credentials");
        }
        
        if(isPasswordValid){
            res.cookie("token",token);
            res.send("Login successfull!!!");
        }else{
            throw new Error("Invalid credentials");
        }
    }catch(err){
        res.send("Something went wrong "+err.message);
    }
})

app.get('/profile',userAuth, async (req,res) => {
    try{
        const user = req.user;
        console.log(user.firstName + "Profile");
        res.send(user);
    }catch(err){
        res.send("Something went wrong "+err.message);
    }
})

app.post('/sendConnectionRequest',userAuth,  async (req,res) => {
    try{
        const user = req.user;
        console.log(user.firstName + " send a connection request.");
        res.send(user.firstName + " send a connection request.");
    }catch(err){
        res.send("Something went wrong "+err.message);
    }
})

app.get('/user',async(req,res) => {
    const userEmail = req.body?.emailId;
    try{
        const user = await User.findOne({ emailId : userEmail });
        if(!user){
            throw new Error("User not found.")
        }else{
            res.send(user);
        }
    }catch(err){
        res.send("Something went wrong "+err.message);
    }
})

app.get('/feed',async(req,res) => {
    try{
        const users = await User.find();
        res.send(users);
    }catch(err){
        res.send("Something went wrong "+err.message);
    }
})

app.delete('/user',async (req,res) => {
    const userId = req.body?.userId;
    try{
        await User.findByIdAndDelete(userId);
        res.send("User deleted successfully.");
    }catch(err){
        res.send("Something went wrong "+err.message);
    }
})

app.patch('/user',async (req,res) => {
    const data = req.body;
    const userId = data?.userId;
    const skills = data?.skills;
    try{
        if(skills.length > 5){
            throw new Error("You can add only 5 skills.");
        }
        await User.findByIdAndUpdate(userId, data);
        res.send("User updated successfully.");
    }catch(err){
        res.send("Something went wrong "+err.message);
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





