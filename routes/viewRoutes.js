const express = require('express')
const viewsController = require('./../controllers/viewsController')
const authController = require('../controllers/authController')
const postController = require("../controllers/postController");

const router = express.Router();

router.use(authController.isSignedIn)

router.get('/', postController.findNewPage, viewsController.getGallery)
router.get('/posts/:id', authController.protect, viewsController.getPost)
router.get('/sign-in', viewsController.getSignIn)
router.get('/sign-up', viewsController.getSignUp)
router.get('/photo-booth', authController.protect, viewsController.getPhotoBooth)
router.get('/edit-profile', authController.protect, viewsController.getEditProfile)
router.get('/change-password', authController.protect, viewsController.getChangePasword)
router.get('/email-notifications', authController.protect, viewsController.getEmailNotifications)
router.get('/password-reset', viewsController.getPasswordReset)

module.exports = router;