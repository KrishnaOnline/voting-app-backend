const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        // required: true,
    },
    // mobile: {
    //     type: String,
    //     // required: true,
    // },
    // address: {
    //     type: String,
    //     required: true,
    // },
    voterID: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["voter", "admin"],
        default: "voter",
    },
    isVoted: {
        type: Boolean,
        default: false,
    }
})

const User = mongoose.model("User", userSchema);
module.exports = User;