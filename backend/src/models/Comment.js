const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    reel: { type: mongoose.Schema.Types.ObjectId, ref: 'Reel' },
    text: { type: String, required: true, maxlength: 500 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
