const mongoose = require('mongoose');
const Post = require("./postModel");

const likeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'A like must have an author']
        },
        post: {
            type: mongoose.Schema.ObjectId,
            ref: 'Post',
            required: [true, 'A like must have a related post']
        }
    }
)

likeSchema.statics.calculateLikesQuantity = async function (postId, method) {

    const subtract = method === 'delete' ? 1 : 0

    const stats = await this.aggregate([
        {
            $match: { post: postId }
        },
        {
            $group: {
                _id: '$post',
                nLikes: {$sum: 1}
            }
        }
    ])

    if (stats.length > 0) {
        await Post.findByIdAndUpdate(postId, {
            likesQuantity: stats[0].nLikes - subtract
        });
    } else {
        await Post.findByIdAndUpdate(postId, {
            likesQuantity: 0
        });
    }
};

// DOCUMENT MIDDLEWARE
// update post before a like is deleted
likeSchema.pre('deleteOne', { document: true }, function() {
    this.constructor.calculateLikesQuantity(this.post, 'delete');
})

// update post after a like is saved
likeSchema.post('save', function() {
    this.constructor.calculateLikesQuantity(this.post, 'save');
});



const Like = mongoose.model('Like', likeSchema);

module.exports = Like;