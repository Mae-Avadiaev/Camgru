const mongoose = require('mongoose');
const Post = require("./postModel");

const commentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'A comment must have an author']
        },
        post: {
            type: mongoose.Schema.ObjectId,
            ref: 'Post',
            required: [true, 'A comment must have a related post']
        },
        body: {
          type: String,
          required: [true, 'A comment must have a body']
        },
        date: {
            type: Date,
            required: [true, 'A comment must have a date of publication']
        },
    }
)

commentSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'login avatar'
    });

    next();
});

commentSchema.statics.calculateCommentsQuantity = async function (postId) {
    const stats = await this.aggregate([
        {
            $match: { post: postId }
        },
        {
            $group: {
                _id: '$post',
                nComments: {$sum: 1}
            }
        }
    ])

    if (stats.length > 0) {
        await Post.findByIdAndUpdate(postId, {
            commentsQuantity: stats[0].nComments
        });
    } else {
        await Post.findByIdAndUpdate(postId, {
            commentsQuantity: 0
        });
    }
};

// DOCUMENT MIDDLEWARE
// update post after a comment is saved
commentSchema.post('save', function() {
    this.constructor.calculateCommentsQuantity(this.post);
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;