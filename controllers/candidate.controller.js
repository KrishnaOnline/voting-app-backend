const Candidate = require("../models/candidate.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model.js");

const JWT_SECRET = "jwtS3cr3t";

const isAdmin = async (userID) => {
    try {
        const user = await User.findById(userID);
        if(user.role === "admin") return true;
    } catch(err) {
        return false;
    }
}

exports.addCandidate = async (req, res) => {
    try {
        const adminID = req.user.id;
        if(!await isAdmin(adminID)) {
            res.status(403).json({
                success: false,
                data: "You're Not an Admin",
            })
        }
        const {name, age, party, candidateID} = req.body;
        const candidate = await Candidate.findOne({candidateID});
        if(candidate) {
            res.status(400).json({
                success: false,
                data: "Candidate Already Exists",
            })
        }
        const newCandidate = await Candidate.create({name, age, party, candidateID});
        res.status(201).json({
            success: true,
            data: newCandidate,
        })
    } catch(err) {
        console.log(err);
        res.status(500).json({
            success: false,
            data: err.message,
        })
    }
}

exports.removeCandidate = async (req, res) => {
    try {
        const candID = req.params.id;
        const adminID = req.user.id;
        if(!await isAdmin(adminID)) {
            res.status(403).json({
                success: false,
                data: "You're Not an Admin",
            })
        }
        const candidate = await Candidate.findById(candID);
        if(!candidate) {
            res.status(404).json({
                success: false,
                data: "Candidate Does not Exist",
            })
        }
        const deletedCand = await Candidate.findByIdAndDelete(candID);
        res.status(200).json({
            success: true,
            data: `Deleted Candidate ${deletedCand.name} with ID: ${deletedCand.candidateID}`,
        })
    } catch(err) {
        console.log(err);
        res.status(500).json({
            success: false,
            data: err.message,
        })
    }
}

exports.updateCandidate = async (req, res) => {
    try {
        const candID = req.params.id;
        const adminID = req.user.id;
        if(!await isAdmin(adminID)) {
            res.status(403).json({
                success: false,
                data: "You're Not an Admin",
            })
        }
        const candidate = await Candidate.findById(candID);
        if(!candidate) {
            res.status(404).json({
                success: false,
                data: "Candidate Does not Exist",
            })
        }
        const data = req.body;
        const updatedCand = await Candidate.findByIdAndUpdate(candID, data, {new: true});
        res.status(201).json({
            success: true,
            data: updatedCand,
        })
    } catch(err) {
        console.log(err);
        res.status(500).json({
            success: false,
            data: err.message,
        })
    } 
}

