const express = require("express");
const router = express.Router();

const {userSignUp, userLogin, getProfile, updatePassword, vote, countVotes, getResults} = require("../controllers/user.controller.js");
const { authMiddleware } = require("../middlewares/auth.middleware.js");

router.post('/signup', userSignUp);
router.post('/login', userLogin);
router.get('/profile', authMiddleware, getProfile);
router.put('/update-password/:id', authMiddleware, updatePassword);
router.post('/vote/:id', authMiddleware, vote);
router.get('/count-votes', countVotes);
router.get('/get-results', getResults);

module.exports = router;