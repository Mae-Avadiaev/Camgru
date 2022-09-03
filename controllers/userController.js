const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const sharp = require('sharp')
const multer = require('multer');
const AppError = require('./../utils/appError')
const fs = require('fs')
const {resolve} = require('path')

const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.deletePreviousAvatar = catchAsync(async (req, res, next) => {

    if (req.user.avatar !== 'defaultUserPhoto.png') {
        await fs.unlink(resolve(`./public/img/${req.user.avatar}`), (err) => {
           if (err) throw err
        })
    }
    next()
})

exports.uploadAvatar = upload.single('avatar')

exports.updateInfo = catchAsync(async (req, res, next) => {

    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        firstName: req.body.firstName || req.user.firstName,
        lastName: req.body.lastName || req.user.lastName,
        login: req.body.login || req.user.login,
        email: req.body.email || req.user.email,
        emailSettings: {
            likes: req.body.likesSettings !== undefined ? req.body.likesSettings * 1 : req.user.emailSettings.likes,
            comments: req.body.commentsSettings !== undefined ? req.body.commentsSettings * 1 : req.user.emailSettings.comments,
            support: req.body.supportSettings !== undefined ? req.body.supportSettings * 1 : req.user.emailSettings.support
        },
        thumbnail: req.file ? req.file.thumbnail : req.user.thumbnail
    },
        {
            new: true,
            runValidators: true
        }
    )

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })
})


exports.resizeAvatar = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);

    next();
});

exports.updateAvatar = catchAsync(async (req, res, next) => {

    const path = req.file ? `users/${req.file.filename}` : 'defaultUserPhoto.png'

    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        avatar: path
    },
    {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })
})