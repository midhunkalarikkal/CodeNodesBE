const express = require('express');
const requestRouter = express.Router();
const userAuth = require('../middlewares/auth');

requestRouter.post('/sendConnectionRequest',userAuth,  async (req,res) => {
    try{
        const user = req.user;
        console.log(user.firstName + " send a connection request.");
        res.send(user.firstName + " send a connection request.");
    }catch(err){
        res.send("Something went wrong "+err.message);
    }
})

module.exports = requestRouter;