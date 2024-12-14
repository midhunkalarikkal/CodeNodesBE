const express = require("express");
const requestRouter = express.Router();
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../model/connectionRequest");
const User = require("../model/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user?._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      if (fromUserId.equals(toUserId)) {
        throw new Error("Invalid connection request");
      }

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid request");
      }

      const existingToUser = await User.findById(toUserId);
      if (!existingToUser) {
        throw new Error("User not found");
      }

      const existingConnection = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnection) {
        throw new Error("connection request already exist.");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      let message;
      if (status === "interested") {
        message = `Your request has been send to ${existingToUser.firstName}`;
      } else {
        message = `You are ignored ${existingToUser.firstName}`;
      }
      res.send(message);
    } catch (err) {
      res.send("Something went wrong " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const requestId = req.params?.requestId;
      const status = req.params?.status;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid request.");
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        throw new Error("Connection request not found.");
      }

      connectionRequest.status = status;
      await connectionRequest.save();

      res.send("Connection request "+status+".");
    } catch (err) {
      res.send("Something went wrong " + err.message);
    }
  }
);

module.exports = requestRouter;
