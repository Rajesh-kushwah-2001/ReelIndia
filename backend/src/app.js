const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const reelRoutes = require('./routes/reelRoutes');
const exploreRoutes = require('./routes/exploreRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use((req, _res, next) => {
  req.io = req.app.get('io');
  next();
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'YouPlay' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/reels', reelRoutes);
app.use('/api/explore', exploreRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(errorHandler);

module.exports = app;
