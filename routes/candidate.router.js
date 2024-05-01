const express = require("express");
const router = express.Router();

const {addCandidate, removeCandidate, updateCandidate} = require("../controllers/candidate.controller.js");
const { authMiddleware } = require("../middlewares/auth.middleware.js");

router.post('/add-candidate', authMiddleware, addCandidate);
router.delete('/remove-candidate/:id', authMiddleware, removeCandidate);
router.put('/update-candidate', authMiddleware, updateCandidate);

module.exports = router;