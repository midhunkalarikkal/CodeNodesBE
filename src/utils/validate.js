const validator = require('validator');

const validateSignupData = (req) => {
    const { firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName){
        throw new Error("First name and last name are required.");
    }
    else if(firstName.length < 4 && firstName.length > 15){
        throw new Error("Firstname length should be between 4 and 15 characters.");
    }
    else if(lastName.length < 4 && lastName.length > 15){
        throw new Error("Lastname length should be between 4 and 15 characters.");
    }
    else if(!emailId || !validator.isEmail(emailId)){
        throw new Error("Enter a valid email address.");
    }
    else if(!password || !validator.isStrongPassword(password)){
        throw new Error("Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.");
    }
}

module.exports = validateSignupData;