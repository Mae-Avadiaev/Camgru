const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'A post must have an author']
        },
        image: {
            type: String,
            required: [true, 'A post must have an image']
        },
        dateOfPublication: {
            type: Date,
            required: [true, 'A post must have a date of publication']
        },
        commentsQuantity: {
            type: Number,
            default: 0,
        },
        likesQuantity: {
            type: Number,
            default: 0
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

postSchema.virtual('comments', {
    ref: 'Comment',
    foreignField: 'post',
    localField: '_id'
});

//QUERY MIDDLEWARE
//populate post with a user
postSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'login avatar'
    });

    next();
});

const Post = mongoose.model('Post', postSchema)

module.exports = Post