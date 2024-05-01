const mongoose = require("mongoose");

const DB_URL = 'mongodb://127.0.0.1:27017/voting-app';

exports.dbConnect = () => {
    mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {console.log("Database Connection: SUCCESS")})
    .catch((err) => {
        console.log("Database Connection: ERROR");
        console.error(err);
        process.exit(1);
    });
}