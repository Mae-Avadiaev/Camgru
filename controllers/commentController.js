const catchAsync = require("./../utils/catchAsync");
const Comment = require('./../models/commentModel')
const Post = require("./../models/postModel");
const User = require("./../models/userModel");
const Email = require("./../utils/email");


exports.postComment = catchAsync(async (req, res, next) => {

    const comment = await Comment.create({
        user: req.user.id,
        post: req.params.postId,
        body: req.body.comment,
        date: Date.now()
    })

    const post = await Post.findOne({_id: req.params.postId})
    const postAuthor = await User.findOne({_id: post.user._id})

    const emailSettingsUrl = `${req.protocol}://${req.get('host')}/email-notifications`
    const rawUrl = `${req.protocol}://${req.get('host')}`

    if (!(req.user.id === post.user._id.toString()) &&
        postAuthor.emailSettings.comments &&
        !postAuthor.testUser
    ) {
        await new Email(postAuthor, emailSettingsUrl, rawUrl).sendCommentNotification(req.user.login);
    }

    res.status(201).json({
        status: 'success',
        data: {
            comment: comment
        }
    })
})