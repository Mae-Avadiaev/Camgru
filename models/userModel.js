const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: [true, 'Please provide a login']
    },
    firstName: {
        type: String,
        required: [true, 'Please tell us your first name!']
    },
    lastName: {
        type: String,
        required: [true, 'Please tell us your last name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    avatar: {
        type: String,
        default: 'defaultUserPhoto.png'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
    testUser: {
        type: Boolean,
        default: false
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailConfirmationToken: String,
    emailConfirmed: Boolean,
    emailSettings : {
        likes: {
            type: Boolean,
            default: true
        },
        comments: {
            type: Boolean,
            default: true
        },
        support: {
            type: Boolean,
            default: true
        }
    },
    thumbnail: String
});

userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
})

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
}

userSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

userSchema.methods.createEmailConfirmationToken = function () {
    const emailConfirmationToken = crypto.randomBytes(32).toString('hex');

    this.emailConfirmationToken = crypto
            .createHash('sha256')
            .update(emailConfirmationToken)
            .digest('hex');

    return emailConfirmationToken
}

const User = mongoose.model('User', userSchema)

module.exports = User;