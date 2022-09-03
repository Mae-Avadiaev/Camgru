const catchAsync = require("./../utils/catchAsync");
const multer = require("multer");
const AppError = require("./../utils/appError");
const sharp = require("sharp");
const path = require("path");
const fs = require('fs')
const {resolve} = require("path");
const Post = require("./../models/postModel");

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
    fileFilter: multerFilter,
})

exports.uploadThumbnail = upload.single('thumbnail')

exports.createFinalImage = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.thumbnail = `user-${req.user.id}-${Date.now()}.jpeg`;

    if (req.body.superposable) {
        await sharp(path.resolve(__dirname, '../public/img/superposable/', req.body.superposable))
            .resize({
                fit: sharp.fill,
                width: req.body.superposableWidth * 1,
                height: req.body.superposableHeight * 1
            })
            .toBuffer({ resolveWithObject: true })
            .then(({data, info}) => {
                sharp(req.file.buffer)
                    .flop()
                    .resize(req.body.videoWidth * 1, req.body.videoHeight * 1)
                    .composite([{
                        input: data,
                        top: req.body.offsetTop * 1,
                        left: req.body.offsetLeft * 1
                    }])
                    .toFormat('jpeg')
                    .jpeg({ quality: 100 })
                    .toFile(`public/img/thumbnails/${req.file.thumbnail}`)
            }).catch(err => { console.log(err) })
    } else {
        await sharp(req.file.buffer)
            .flop()
            .toFormat('jpeg')
            .jpeg({ quality: 100 })
            .toFile(`public/img/thumbnails/${req.file.thumbnail}`)
            .catch(err => { console.log(err) })
    }

    next()
})

exports.deleteThumbnail = async (req, res, next) => {
    fs.unlink(resolve(`./public/img/thumbnails/${req.user.thumbnail}`), (err) => {
        if (err) throw err
    })
    req.user.thumbnail = undefined
    await req.user.save({validateBeforeSave: false})
    next()
}

exports.postThumbnail = async (req, res, next) => {

    // Moving file to post directory
    const currentPath = path.resolve(__dirname,'../public/img/thumbnails/', req.user.thumbnail);
    const destinationPath = path.join(__dirname, '../public/img/posts/', req.user.thumbnail);
    fs.rename(currentPath, destinationPath, function (err) {
        if (err) throw err
    })

    const post = await Post.create({
        user: req.user.id,
        image: `/posts/${req.user.thumbnail}`,
        dateOfPublication: Date.now()
    })

    req.user.thumbnail = undefined
    req.user.save({validateBeforeSave: false})

    res.status(201).json({
        status: 'success',
        data: {
            post
        }
    })
}

exports.uploadSuperposable = upload.single('superposable')

exports.addSuperposable = async (req, res, next) => {

    await sharp(req.file.buffer)
        .toFile(`public/img/superposable/${req.file.originalname.replaceAll(' ', '_')}`)
        .catch(err => { console.log(err) })

    res.status(201).json({
        status: 'success',
    })
}

exports.findNewPage = catchAsync(async (req, res, next) => {
    // 1) Get posts data from collection
    // a) Form query
    let query = Post.find().sort({dateOfPublication: -1})
    const page = req.query.page * 1 || 1
    const limit = 18
    const skip = (page - 1) * limit
    query = query.skip(skip).limit(limit)

    const numPosts = await Post.countDocuments()

    if (skip >= numPosts) {
        res.locals.posts = []
    } else {
        // b) Execute and save query
        res.locals.posts = await query
    }

    next()
})

exports.sendNewPage = catchAsync(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        posts: res.locals.posts
    })
})