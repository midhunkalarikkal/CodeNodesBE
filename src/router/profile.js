const express = require('express');
const profileRouter = express.Router();
const userAuth = require('../middlewares/auth');

profileRouter.get('/profile',userAuth, async (req,res) => {
    try{
        const user = req.user;
        console.log(user.firstName + "Profile");
        res.send(user);
    }catch(err){
        res.send("Something went wrong "+err.message);
    }
})

module.exports = profileRouter;