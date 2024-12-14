const express = require('express');
const profileRouter = express.Router();
const userAuth = require('../middlewares/auth');
const { validateProfileData } = require('../utils/validate');
const User = require('../model/user');
const validator = require('validator');
const bcrypt = require('bcrypt');

profileRouter.get('/profile',userAuth, async (req,res) => {
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.send("Something went wrong "+err.message);
    }
})

profileRouter.patch('/profile/edit',userAuth, async (req,res) => {
    try{
        const loggedInUser = req.user;
        const isValid = validateProfileData(req);
        if(!isValid){
            throw new Error("Invalid request");
        }
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

        await loggedInUser.save();
        res.send(`${loggedInUser.firstName} profile updated successfully.`)
    }catch(err){
        res.send("Something went wrong "+err.message);
    }
})

profileRouter.patch('/profile/password', userAuth, async(req,res) => {
    try{
        const loggedInUser = req.user;
        const { password, newPassword } = req.body;
        const user = await User.findById(loggedInUser._id);
        const isValidPassword = await user.validatePassword(password);
        if(!isValidPassword){
            throw new Error("Incorrect password.");
        }
        
        if(!validator.isStrongPassword(newPassword)){
            throw new Error("Enter a strong password");
        }
        
        const passwordHash = await bcrypt.hash(newPassword,10);
        user.password = passwordHash;
        await user.save();

        res.send("Password updated successfully.");
    }catch(err) {
        res.send("Something went wrong "+err.message);
    }
})

module.exports = profileRouter;