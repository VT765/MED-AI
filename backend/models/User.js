import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        default: null,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    emailVerifiedAt: {
        type: Date,
        default: null,
    },
    emailVerificationOtpHash: {
        type: String,
        default: null,
    },
    emailVerificationOtpExpiresAt: {
        type: Date,
        default: null,
    },
    emailVerificationOtpSentAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;
