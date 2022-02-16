const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.HOST_PORT || 3000;

app.use(cors());
app.use(express.json());

const authRouter = require('./routes/auth_router');
const conversationRouter = require('./routes/conversation_router');
const pingPongRouter = require('./routes/ping_pong_router');

app.use('/auth', authRouter);
app.use('/conversation', conversationRouter);
app.use('/ping', pingPongRouter);

app.listen(port, () => {
    console.log(`Server is ready to work on port ${port}!`);
});