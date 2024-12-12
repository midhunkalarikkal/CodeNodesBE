const User = require("../model/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if(!token){
        return res.status(401).send({ error: "Unauthorized: Token is missing." });
    }

    const decodeToekn = await jwt.verify(token, "codeNodes@8157");
    const { _id } = decodeToekn;

    const user = await User.findById(_id);
    if (!user) {
        return res.status(404).send({ error: "User not found." });
    }
    
    req.user = user;
    next();
  } catch(err) {
    res.status(403).send({ error: "Authentication failed: " + err.message });
  }
};

module.exports = userAuth;
