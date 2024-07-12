const express = require('express');
const app = express();
const {DBconnection} = require("./database/db");
const User = require("./models/Users");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require("dotenv");
dotenv.config();

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//connect to database
DBconnection();

app.get("/", (req, res)=>{
    res.send("welcome to todays class");
});

app.post("/register", async (req, res)=>{
    try{
        //get all data from request body
        const {firstname, lastname, email, password} = req.body;

        //check if all data exist
        if(!(firstname&&lastname&&email&&password)){
            return res.status(400).send("please enter all the required fields");
        }

        //check if user already exists or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            res.status(400).send("User already exists");
        }

        //encrypt password
        const hashPassword = bcrypt.hashSync(password, 10);
        console.log(hashPassword);

        //save the user to database
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashPassword,
        });

        //generate a token for user and send it
        const token = jwt.sign({id:user._id, email}, process.env.SECRET_KEY, {
            expiresIn: "1h"
        });
        
        user.password = undefined;
        res.status(201).json({
            message: "you have succesfully registered",
            user,
            token
        });

    } catch(error){
        console.error(error);
    }
})

app.listen(8000, ()=>{
    console.log("server is listening on port 8000");
});