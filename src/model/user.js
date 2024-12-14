const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minLength : 4,
        maxLength : 15,
        trim : true,
        validate(value) {
            if(!validator.isAlpha(value)){
                throw new Error("Enter only alphabets.");
            }
        }
    },
    lastName : {
        type : String,
        required : true,
        minLength : 4,
        maxLength : 15,
        trim : true,
        validate(value) {
            if(!validator.isAlpha(value)){
                throw new Error("Enter only alphabets.");
            }
        }
    },
    emailId : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid.");
            }
        }
    },
    password : {
        type : String,
        required : true,
        minLength : 8,
        trim : true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password");
            }
        }
    },
    age : {
        type : Number,
        min : 18,
        trim : true,
    },
    gender : {
        type : String,
        validate(value){
            if(!["Male","Female","Others"].includes(value)){
                throw new Error("Gender data is not valid.");
            }
        },
        default : "Male",
    },
    photoUrl : {
        type : String,
        default : "https://www.iihm.ac.in/wp-content/uploads/2019/01/Mubeena.jpg",
    },
    about : {
        type : String,
        default : "This is a sample text, you can update.",
        minLength : 10,
        maxLength: 100,
        trim : true,
    },
    skills : {
        type : [String],
        default : ["no skills added"],
    }
},
{
    timestamps : true,
});

userSchema.methods.generateJWT = async function() {
    const user = this;
    const token = await jwt.sign({_id : user._id},"codeNodes@8157",{ expiresIn : "1d" });
    return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const validatePassword = await bcrypt.compare(passwordInputByUser, passwordHash);
    return validatePassword;
};

module.exports = mongoose.model("User", userSchema);
