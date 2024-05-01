const jwt = require("jsonwebtoken");

const JWT_SECRET = "jwtS3cr3t";

exports.authMiddleware = async (req, res, next) => {
    try {
        console.log(req.headers);
        const token = req.headers.authorization.split(' ')[1];
        console.log(token);
        if(!token) {
            res.status(404).json({
                success: false,
                data: "Token Not Found",
            })
        }
        try {
            const decoded = await jwt.verify(token, JWT_SECRET);
            console.log(decoded);
            req.user = decoded;
            next();
        } catch(err) {
            res.status(403).json({
                success: false,
                data: "Invalid Token",
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

exports.isAdmin = async (req, res, next) => {

}

exports.isVoter = async (req, res, next) => {

}