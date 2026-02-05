const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    videoUrl: { type: String, required: true },
    caption: { type: String, default: '', maxlength: 300 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    commentsCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    tags: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reel', reelSchema);
