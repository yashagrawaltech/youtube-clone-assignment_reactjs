import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config.js';

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        avatar: { type: String },
        channels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }],
    },
    { timestamps: true }
);

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare entered password with hashed one
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT auth token
userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ id: this._id, email: this.email }, config.jwt_secret, {
        expiresIn: '7d',
    });
};

const User = mongoose.model('User', userSchema);

export default User;
