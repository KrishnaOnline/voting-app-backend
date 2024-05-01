const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Candidate = require("../models/candidate.model.js");

const JWT_SECRET = "jwtS3cr3t";

const isAdmin = async (userID) => {
    try {
        const user = await User.findById(userID);
        if(user.role === "admin") return true;
    } catch(err) {
        return false;
    }
}

exports.userSignUp = async (req, res) => {
    try {
        const {name, age, voterID, password, role} = req.body;
        const user = await User.findOne({voterID: voterID});
        if(user) {
            res.status(400).json({
                success: false,
                data: "User already Exists",
            })
        }
        const hashed = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name: name,
            age: age,
            voterID: voterID,
            password: hashed,
            role: role,
        });
        res.status(201).json({
            success: true,
            data: newUser,
        })
    } catch(err) {
        console.log(err);
        res.status(500).json({
            success: false,
            data: err.message,
        })
    }
}

exports.userLogin = async (req, res) => {
    try {
        const { voterID, password } = req.body;
        if(!voterID || !password) {
            res.status(400).json({
                success: false,
                data: "Please provide required Details",
            })
        }
        const user = await User.findOne({voterID: voterID});
        if(!user) {
            res.status(404).json({
                success: false,
                data: "User Do not Exists, PLease Register"
            })
        }
        if(await bcrypt.compare(password, user.password)) {
            const payload = {
                voterID: user.voterID,
                id: user._id,
            }
            const token = jwt.sign(payload, JWT_SECRET);
            user.token = token;
            res.header("Authorization", "Bearer "+token)
               .status(200)
               .json({
                    success: true,
                    token,
                    user,
                    data: "Logged in Successfully",
               })
        } else {
            res.status(403).json({
                success: false,
                data: "Incorrect Password",
            })
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({
            success: false,
            data: err.message,
        })
    }
}

exports.getProfile = async (req, res) => {
    try {
        const userData = req.user;
        console.log(userData);
        const userID = userData.id;
        const user = await User.findById(userID);
        res.status(200).json({
            success: true,
            data: user,
        })
    } catch(err) {
        console.log(err);
        res.status(500).json({
            success: false,
            data: err.message,
        })
    }
}

exports.updatePassword = async (req, res) => {
    try {
        const userID = req.params.id;
        const {oldPassword, newPassword} = req.body;
        const user = await User.findById(userID);
        if(!user) {
            res.status(200).json({
                success: false,
                data: "User Do Not Exist",
            })
        }
        if(oldPassword===newPassword) {
            res.status(400).json({
                success: false,
                data: "Old and New Passwords are Same",
            })
        }
        console.log(user);
        if(!await bcrypt.compare(oldPassword, user.password)) {
            res.status(403).json({
                success: false,
                data: "Incorrect Old Password",
            })
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(userID, {
            password: hashedNewPassword,
        })
        res.status(201).json({
            success: true,
            data: "Password Updated",
        })
    } catch(err) {
        console.log(err);
        res.status(500).json({
            success: false,
            data: err.message,
        })
    }
}

exports.vote = async (req, res) => {
    try {
        const userID = req.user.id;
        const candID = req.params.id;
        if(await isAdmin(userID)) {
            res.status(403).json({
                success: false,
                data: "Admin Cannot Vote",
            })
        }
        const candidate = await Candidate.findById(candID);
        const user = await User.findById(userID);
        if(!user) {
            res.status(404).json({
                success: false,
                data: "User Do not Exisit",
            })
        }
        if(user.isVoted) {
            res.status(400).json({
                success: false,
                data: "Already Voted",
            })
        }
        candidate.votes.push({user: userID});
        candidate.voteCount++;
        await candidate.save();
        user.isVoted = true;
        await user.save();
        res.status(201).json({
            success: true,
            data: "Voted Successfully",
        })
    } catch(err) {
        console.log(err);
        res.status(500).json({
            success: false,
            data: err.message,
        })
    }
}

exports.countVotes = async (req, res) => {
    try {
        const candidates = await Candidate.find().sort({voteCount: 'desc'});
        const voteRecord = candidates.map(data => {
            return {
                party: data.party,
                count: data.voteCount,
            }
        })
        res.status(200).json({
            success: true,
            data: voteRecord,
        })
    } catch(err) {
        console.log(err);
        res.status(500).json({
            success: false,
            data: err.message,
        })
    }
}

exports.getResults = async (req, res) => {
    try {
        const candidates = await Candidate.find({}, 'name party -_id');
        res.status(200).json({
            success: true,
            data: candidates,
        })
    } catch(err) {
        console.log(err);
        res.status(500).json({
            success: false,
            data: err.message,
        })
    }
}