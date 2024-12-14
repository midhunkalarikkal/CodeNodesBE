const express = require("express");
const userAuth = require("../middlewares/auth");
const connectionRequest = require("../model/connectionRequest");
const user = require("../model/user");
const userRouter = express.Router();

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await connectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status : "accepted" }, 
        { toUserId: loggedInUser._id, status : "accepted" }
    ],
    }).populate("fromUserId", ["firstName", "photoUrl"]).populate("toUserId", ["firstName", "photoUrl"]);

    if(connections.length === 0 || !connections){
        throw new Error("No coonections found.")
    }

    const data = connections.map((conn) => {
        if(conn.fromUserId._id.equals(loggedInUser._id)){
            return conn.toUserId;
        }else{
            return conn.fromUserId;
        }
    });
    console.log("connections : ",data);
    res.send("Connections");
  } catch (err) {
    res.send("Something went wrong " + err.message);
  }
});

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await connectionRequest
      .find({ toUserId: loggedInUser._id, status: "interested" })
      .populate("fromUserId", ["firstName", "photoUrl"]);
    if (connections.length === 0) {
      throw new Error("No requests found.");
    }
    console.log("connections : ", connections);
    res.send("conections");
  } catch (err) {
    res.send("Something went wrong " + err.message);
}
});

userRouter.get('/user/feed', userAuth, async (req,res) => {
    try{
        const loggedInUser = req.user;
        const hideUsersFromFeed = new Set();

        const connections = await connectionRequest.find({
            $or : [
                { fromUserId : loggedInUser._id}, {toUserId : loggedInUser._id}
            ]
        }).select("fromUserId toUserId");
        
        connections.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const showInFeed = await user.find({ _id : {$nin : Array.from(hideUsersFromFeed)}}).select("firstName lastName photoUrl about");

        console.log(showInFeed);

        res.send("Showing feed");

    }catch(err){
        res.send("Something went wrong " + err.message);
    }
})

module.exports = userRouter;
