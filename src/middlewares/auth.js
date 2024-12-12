const User = require("../model/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const decodeToekn = await jwt.verify(token, "codeNodes@8157");
    const { _id } = decodeToekn;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found.");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(404).send("Error : ", err.message);
  }
};

module.exports = userAuth;
