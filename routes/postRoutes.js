const express = require('express')
const authController = require('./../controllers/authController')
const userController = require('./../controllers/userController')
const postController = require('./../controllers/postController')
const multer = require('multer');

const router = express.Router();

// create application/json parser
const upload = multer()

router.post('/thumbnail',
    authController.protect,
    postController.uploadThumbnail,
    postController.createFinalImage,
    userController.updateInfo,
)

router.post('/delete-thumbnail',
    authController.protect,
    postController.deleteThumbnail,
    userController.updateInfo
)

router.post('/post-thumbnail',
    authController.protect,
    postController.postThumbnail
)

router.post('/upload-superposable',
    authController.protect,
    postController.uploadSuperposable,
    postController.addSuperposable)

router.get('/', postController.findNewPage, postController.sendNewPage)

module.exports = router;