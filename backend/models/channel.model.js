import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema(
    {
        channelName: { type: String, required: true },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        description: { type: String },
        channelBanner: { type: String },
        subscribers: { type: Number, default: 0 },
        videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
    },
    { timestamps: true }
);

const Channel = mongoose.model('Channel', channelSchema);

export default Channel;
