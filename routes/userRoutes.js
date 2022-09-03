const express = require('express')
const authController = require('./../controllers/authController')
const userController = require('./../controllers/userController')
const viewController = require('./../controllers/viewsController')
const bodyParser = require('body-parser')
const multer = require('multer');

const router = express.Router();

// create application/json parser
const jsonParser = bodyParser.json()
const upload = multer()

router.post('/sign-up', upload.fields([]), authController.signup)
router.post('/sign-in', jsonParser, authController.signin)
router.get('/sign-out', jsonParser, authController.signout)

router.post('/forgot-password', upload.fields([]), authController.forgotPassword)
router.get('/reset-password/:token', authController.checkResetToken, viewController.getNewPassword)
router.patch('/reset-password/:token',
    authController.checkResetToken,
    upload.fields([]),
    authController.resetPassword)

router.get('/confirm-email-page/:token', viewController.getConfirmEmail)
router.get('/confirm-email/:token', authController.checkEmailConfirmationToken)

router.patch('/update-email-settings',
    authController.protect,
    upload.fields([]),
    userController.updateInfo)

router.patch('/update-info',
    authController.protect,
    upload.fields([]),
    userController.updateInfo)

router.patch('/update-password',
    authController.protect,
    upload.fields([]),
    authController.updatePassword)

router.patch('/update-avatar',
    authController.protect,
    userController.uploadAvatar,
    userController.resizeAvatar,
    userController.deletePreviousAvatar,
    userController.updateAvatar)

router.patch('/delete-avatar',
    authController.protect,
    userController.deletePreviousAvatar,
    userController.updateAvatar)

module.exports = router;