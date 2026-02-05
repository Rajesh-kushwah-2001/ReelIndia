const Notification = require('../models/Notification');

exports.list = async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user.id })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('actor', 'username profilePhoto');
  res.json(notifications);
};

exports.markRead = async (req, res) => {
  await Notification.updateMany({ recipient: req.user.id, read: false }, { read: true });
  res.json({ message: 'Marked as read' });
};
