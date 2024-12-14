const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const authRouter = require('./router/auth');
const profileRouter = require('./router/profile');
const requestRouter = require('./router/request');
const userRouter = require('./router/user');

const app = express()

app.use(express.json());
app.use(cookieParser());

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
app.use('/',userRouter);

connectDB().then(() => {
    console.log("Databse connection established.");
    app.listen(3000, () => {
        console.log("Server is listening on port 3000");
    });
}).catch((err) => {
    console.log("Databse connecting error.");
})





