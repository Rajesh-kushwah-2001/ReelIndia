const User = require('../models/User');
const uploadBuffer = require('../utils/cloudinaryUpload');
const Notification = require('../models/Notification');

exports.updateProfile = async (req, res) => {
  const updates = { bio: req.body.bio, username: req.body.username };
  if (req.file) updates.profilePhoto = await uploadBuffer(req.file.buffer, 'youplay/profiles', 'image');
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
  res.json(user);
};

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password').populate('followers following', 'username profilePhoto');
  if (!user) return res.status(404).json({ message: 'Profile not found' });
  res.json(user);
};

exports.followToggle = async (req, res) => {
  const me = await User.findById(req.user.id);
  const target = await User.findById(req.params.id);
  if (!target) return res.status(404).json({ message: 'User not found' });
  const isFollowing = me.following.some((id) => id.equals(target._id));

  if (isFollowing) {
    me.following.pull(target._id);
    target.followers.pull(me._id);
  } else {
    me.following.push(target._id);
    target.followers.push(me._id);
    await Notification.create({ recipient: target._id, actor: me._id, type: 'follow', resourceId: me._id, resourceType: 'user' });
    req.io.to(target._id.toString()).emit('notification:new', { type: 'follow', actor: me._id });
  }

  await Promise.all([me.save(), target.save()]);
  res.json({ following: !isFollowing, followersCount: target.followers.length });
};
