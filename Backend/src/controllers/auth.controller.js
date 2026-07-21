const userModel = require("../models/user.model")
const blacklistModel = require("../models/blacklist.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


async function registerUserController(req,res) {
    try {
        const {username , email , password} = req.body
        if(!username || !email || !password) {
            return res.status(400).json({
                message : "Please provide username , email and password"
            })
        }

        const isUserAlreadyExists = await userModel.findOne({
            $or : [{username},{email}]
        })

        if(isUserAlreadyExists) { 
           // const user_name = isUserAlreadyExists.userName 
            return res.status(400).json({
                message : "User with this email id or username already exists"
            })
        }    

        const hash = await bcrypt.hash(password,10)

        const user = await userModel.create({
            username,
            email,
            password : hash
        })

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token",token)

        res.status(201).json({
            message : "User registered succesfully",
            user : {
                id : user._id,
                username : user.username,
                email : user.email,
            }
        })
    } catch(error) {
        console.error("Register error:", error)
        res.status(500).json({
            message : error.message || "Internal server error"
        })
    }
}

async function loginUserController(req,res) {
    try {
        const {email,password} = req.body
        const user = await userModel.findOne({email})
        if(!user) {
            return res.status(400).json({
                message : "Invalid email or password"
            })
        }

        const isPswdValid = await bcrypt.compare(password,user.password)

        if(!isPswdValid) {
            return res.status(400).json({
                message : "Invalid email or password"
            })
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message : "User logged in successfully",
            user : {
                id : user._id,
                username : user.username,
                email : user.email,
            }
        })
    } catch(error) {
        console.error("Login error:", error)
        res.status(500).json({
            message : error.message || "Internal server error"
        })
    }
}

async function logoutUserController(req,res) {
    try {
        const token = req.cookies.token

        if(token) {
            await blacklistModel.create({token})
        }

        res.clearCookie("token")

        res.status(200).json({
            message : "User logged out successfully"
        })
    } catch(error) {
        console.error("Logout error:", error)
        res.status(500).json({
            message : error.message || "Internal server error"
        })
    }
}

async function getMeController(req,res) {
    try {
        const user = await userModel.findById(req.user.id);

        if(!user) {
            return res.status(404).json({
                message : "User not found"
            })
        }

        res.status(200).json({
            message : "User details fetched successfully",
            user : {
                id : user._id,
                username : user.username,
                email : user.email
            }
        })
    } catch(error) {
        console.error("GetMe error:", error)
        res.status(500).json({
            message : error.message || "Internal server error"
        })
    }
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}
