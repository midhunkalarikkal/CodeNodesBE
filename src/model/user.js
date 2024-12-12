const mongoose = require('mongoose');
const validator = require('validator');

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
        maxLength : 30,
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
})

module.exports = mongoose.model("User", userSchema);
