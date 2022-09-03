const catchAsync = require('./../utils/catchAsync')
const Post = require("../models/postModel");
const Comment = require('../models/commentModel')
const path = require('path')
const Like = require('../models/likeModel')
const fs = require('fs');

exports.getGallery = catchAsync(async (req, res, next) => {
    res.status(200).render("gallery", {
        title: 'Gallery',
        posts: res.locals.posts
    })
})

exports.getConfirmEmail = catchAsync(async (req, res) => {
    res.status(200).render("confirmEmail", {
        title: 'Email confirmation',
    })
})

exports.getPost = catchAsync( async (req, res) => {
    const post = await Post.findById(req.params.id)
    const liked = await Like.findOne({user: req.user.id, post: post.id})
    const comments = await Comment.find({post: post._id}).sort({date: -1})

    res.status(200).render("post", {
        title: `Post by ${post.user.name}`,
        post,
        liked,
        comments
    })
})

exports.getSignIn = catchAsync(async (req, res) => {
    res.status(200).render("signIn", {
        title: 'Sign In'
    })
})

exports.getSignUp = catchAsync(async (req, res) => {
    res.status(200).render("signUp", {
        title: 'Sign Up'
    })
})

exports.getPhotoBooth = catchAsync(async (req, res) => {

    const dir = path.join(__dirname, './../public/img/superposable')

    fs.readdir(dir, (err, files) => {

        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }

        res.status(200).render("photoBooth", {
            title: 'Photo Booth',
            user: req.user,
            superposables: files
        })
    })
})

exports.getEditProfile = catchAsync(async (req, res) => {
    res.status(200).render('editProfile', {
        title: 'Edit profile',
        user: req.user
    })
})

exports.getChangePasword = catchAsync(async  (req, res) => {
    res.status(200).render('changePassword', {
        title: 'Change password'
    })
})

exports.getEmailNotifications = catchAsync(async  (req, res) => {
    res.status(200).render('emailNotifications', {
        title: 'Email notifications'
    })
})

exports.getPasswordReset = catchAsync(async  (req, res) => {
    res.status(200).render('passwordReset', {
        title: 'Reset password'
    })
})

exports.getNewPassword = catchAsync(async (req, res) => {
    res.status(200).render('newPassword', {
        title: 'New password'
    })
})
