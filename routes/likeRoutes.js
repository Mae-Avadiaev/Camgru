const express = require("express");
const likeController = require('./../controllers/likeController')
const authController = require('./../controllers/authController')

const router = express.Router();

router.post('/toggle-like/:postId', authController.protect, likeController.toggleLike)

module.exports = router;