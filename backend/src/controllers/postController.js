const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Notification = require('../models/Notification');
const uploadBuffer = require('../utils/cloudinaryUpload');

exports.createPost = async (req, res) => {
  const mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
  const mediaUrl = await uploadBuffer(req.file.buffer, 'youplay/posts', mediaType === 'video' ? 'video' : 'image');
  const post = await Post.create({ author: req.user.id, mediaUrl, mediaType, caption: req.body.caption || '' });
  const populated = await post.populate('author', 'username profilePhoto');
  req.io.emit('post:new', populated);
  res.status(201).json(populated);
};

exports.feed = async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const me = await User.findById(req.user.id);
  const ids = [req.user.id, ...me.following];
  const posts = await Post.find({ author: { $in: ids } })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('author', 'username profilePhoto');
  res.json(posts);
};

exports.toggleLikePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  const liked = post.likes.some((id) => id.equals(req.user.id));
  if (liked) post.likes.pull(req.user.id);
  else post.likes.push(req.user.id);
  await post.save();

  if (!liked && post.author.toString() !== req.user.id) {
    await Notification.create({ recipient: post.author, actor: req.user.id, type: 'like_post', resourceId: post._id, resourceType: 'post' });
    req.io.to(post.author.toString()).emit('notification:new', { type: 'like_post', resourceId: post._id, actor: req.user.id });
  }

  req.io.emit('post:liked', { postId: post._id, likes: post.likes.length });
  res.json({ likes: post.likes.length, liked: !liked });
};

exports.commentPost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  const comment = await Comment.create({ user: req.user.id, post: post._id, text: req.body.text });
  post.commentsCount += 1;
  await post.save();

  if (post.author.toString() !== req.user.id) {
    await Notification.create({ recipient: post.author, actor: req.user.id, type: 'comment_post', resourceId: post._id, resourceType: 'post' });
    req.io.to(post.author.toString()).emit('notification:new', { type: 'comment_post', resourceId: post._id, actor: req.user.id });
  }

  const enriched = await comment.populate('user', 'username profilePhoto');
  req.io.emit('post:commented', { postId: post._id, comment: enriched, commentsCount: post.commentsCount });
  res.status(201).json(enriched);
};

exports.deletePost = async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id, author: req.user.id });
  if (!post) return res.status(404).json({ message: 'Post not found' });
  await post.deleteOne();
  req.io.emit('post:deleted', { postId: req.params.id });
  res.json({ message: 'Deleted' });
};
