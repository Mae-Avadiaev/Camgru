const catchAsync = require("./../utils/catchAsync");
const User = require("./../models/userModel");
const Like = require('./../models/likeModel')
const Post = require('./../models/postModel')
const Email = require("./../utils/email");


exports.toggleLike = catchAsync(async (req, res, next) => {
    const like = await Like.findOne({user: req.user.id, post: req.params.postId})

    const statusCode = like ? 200 : 201

    if (like) {
        await like.deleteOne()
    } else {

        await Like.create({
            user: req.user.id,
            post: req.params.postId
        })

        const post = await Post.findOne({_id: req.params.postId})
        const postAuthor = await User.findOne({_id: post.user._id})

        const emailSettingsUrl = `${req.protocol}://${req.get('host')}/email-notifications`
        const rawUrl = `${req.protocol}://${req.get('host')}`

        if (!(req.user.id === post.user._id.toString()) &&
            postAuthor.emailSettings.likes &&
            !postAuthor.testUser
        ) {
            await new Email(postAuthor, emailSettingsUrl, rawUrl).sendLikeNotification(req.user.login);
        }
    }

    res.status(statusCode).json({
        status: 'success'
    })
})