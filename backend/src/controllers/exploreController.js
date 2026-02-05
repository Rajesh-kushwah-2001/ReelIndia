const Post = require('../models/Post');
const Reel = require('../models/Reel');

exports.trending = async (_req, res) => {
  const [posts, reels] = await Promise.all([
    Post.find({ visibility: 'public' }).sort({ likes: -1, commentsCount: -1, createdAt: -1 }).limit(15).populate('author', 'username profilePhoto'),
    Reel.find().sort({ views: -1, likes: -1, createdAt: -1 }).limit(15).populate('author', 'username profilePhoto')
  ]);

  res.json({ posts, reels });
};
