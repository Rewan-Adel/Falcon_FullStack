const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const {notFoundError} = require('./middlewares/error.messages.middleware')

const authRouter = require('./modules/authentication/routes/auth.route');
const userRouter = require('./modules/user/routes/user.route');
const identityRouter = require('./modules/user/routes/identity.route');

const marketRouter = require('./modules/marketplace/routes/market.route');

const postRouter = require('./modules/social_media/routes/post.route');
const commentRouter = require('./modules/social_media/routes/comment.route');
const likesRouter = require('./modules/social_media/routes/likes.route');
const followRouter = require('./modules/social_media/routes/follow.route');
const groupRouter = require('./modules/social_media/routes/group.route');
const groupMemberRouter = require('./modules/social_media/routes/groupMember.route');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/market', marketRouter);
app.use('/api/identity', identityRouter);

app.use('/api/social/post', postRouter);
app.use('/api/social/comment', commentRouter);
app.use('/api/social/likes', likesRouter);
app.use('/api/social/follow', followRouter);
app.use('/api/social/group', groupRouter);
app.use('/api/social/group/member', groupMemberRouter);

app.all('*', (req, res) => {
    return notFoundError(`Can't find ${req.originalUrl} on this server!`, res);
});
const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`);
});

module.exports = app;