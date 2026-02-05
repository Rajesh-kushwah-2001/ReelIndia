const Reel = require('../models/Reel');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const uploadBuffer = require('../utils/cloudinaryUpload');

exports.createReel = async (req, res) => {
  const videoUrl = await uploadBuffer(req.file.buffer, 'youplay/reels', 'video');
  const reel = await Reel.create({ author: req.user.id, videoUrl, caption: req.body.caption || '' });
  const populated = await reel.populate('author', 'username profilePhoto');
  req.io.emit('reel:new', populated);
  res.status(201).json(populated);
};

exports.reelsFeed = async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const reels = await Reel.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate('author', 'username profilePhoto');
  res.json(reels);
};

exports.toggleLikeReel = async (req, res) => {
  const reel = await Reel.findById(req.params.id);
  const liked = reel.likes.some((id) => id.equals(req.user.id));
  if (liked) reel.likes.pull(req.user.id);
  else reel.likes.push(req.user.id);
  await reel.save();

  if (!liked && reel.author.toString() !== req.user.id) {
    await Notification.create({ recipient: reel.author, actor: req.user.id, type: 'like_reel', resourceId: reel._id, resourceType: 'reel' });
    req.io.to(reel.author.toString()).emit('notification:new', { type: 'like_reel', resourceId: reel._id, actor: req.user.id });
  }

  req.io.emit('reel:liked', { reelId: reel._id, likes: reel.likes.length });
  res.json({ likes: reel.likes.length, liked: !liked });
};

exports.commentReel = async (req, res) => {
  const reel = await Reel.findById(req.params.id);
  const comment = await Comment.create({ user: req.user.id, reel: reel._id, text: req.body.text });
  reel.commentsCount += 1;
  await reel.save();

  if (reel.author.toString() !== req.user.id) {
    await Notification.create({ recipient: reel.author, actor: req.user.id, type: 'comment_reel', resourceId: reel._id, resourceType: 'reel' });
    req.io.to(reel.author.toString()).emit('notification:new', { type: 'comment_reel', resourceId: reel._id, actor: req.user.id });
  }

  const enriched = await comment.populate('user', 'username profilePhoto');
  req.io.emit('reel:commented', { reelId: reel._id, comment: enriched, commentsCount: reel.commentsCount });
  res.status(201).json(enriched);
};

exports.addView = async (req, res) => {
  const reel = await Reel.findById(req.params.id);
  reel.views += 1;
  await reel.save();
  req.io.emit('reel:viewed', { reelId: reel._id, views: reel.views });
  res.json({ views: reel.views });
};
