const express = require("express");
const authController = require('./../controllers/authController')
const commentController = require('./../controllers/commentController')
const multer = require("multer");

const router = express.Router();

const upload = multer()

router.post('/:postId', upload.fields([]), authController.protect, commentController.postComment)

module.exports = router;