const express = require('express');
const cors = require('cors');
const socket = require('./services/socket-service');
require('dotenv').config();

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());

const http = require('http').createServer(app);
socket(http);

const authRouter = require('./routes/auth_router');
const conversationRouter = require('./routes/conversation_router');
const pingPongRouter = require('./routes/ping_pong_router');

app.use('/auth', authRouter);
app.use('/conversation', conversationRouter);
app.use('/ping', pingPongRouter);

http.listen(port, () => {
    console.log(`Server is ready to work on port ${port}!`);
});