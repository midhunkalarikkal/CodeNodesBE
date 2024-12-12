const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minLength : 4,
        maxLength : 15,
        trim : true,
    },
    lastName : {
        type : String,
        required : true,
        minLength : 4,
        maxLength : 15,
        trim : true,
    },
    emailId : {
        type : String,
        required : true,
        unique : true,
        trim : true,
    },
    password : {
        type : String,
        required : true,
        minLength : 8,
        maxLength : 30,
        trim : true,
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
        }
    },
    photoUrl : {
        type : String,
        default : "https://www.iihm.ac.in/wp-content/uploads/2019/01/Mubeena.jpg",
    },
    about : {
        type : String,
        minLength : 10,
        maxLength: 100,
        trim : true,
    },
    skills : {
        type : [String],
    }
},
{
    timestamps : true,
})

module.exports = mongoose.model("User", userSchema);
