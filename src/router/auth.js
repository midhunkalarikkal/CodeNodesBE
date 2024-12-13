const bcrypt = require("bcrypt");
const express = require("express");
const User = require("../model/user");
const { validateSignupData } = require("../utils/validate");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });
    await user.save();
    res.send("User saved successfully.");
  } catch (err) {
    res.send("Something went wrong " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    console.log("/login");
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    console.log("user : ", user);
    const isPasswordValid = await user.validatePassword(password);
    const token = await user.generateJWT();

    if (!user) {
      throw new Error("Invalid credentials");
    }

    if (isPasswordValid) {
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login successfull!!!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.send("Something went wrong " + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  try {
    console.log("logout api");
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("Logout succesfully");
  } catch (err) {
    res.status(500).send("Something went wrong " + err.message);
  }
});

module.exports = authRouter;
