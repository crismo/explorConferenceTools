import * as dotenv from 'dotenv'
dotenv.config();

import express from 'express'
const server = express();
server.use(express.static('public'));


import badges from './routes/badges.mjs';
server.use('/badges', badges);

import task from './routes/task.mjs';
server.use('/task', task);




server.listen(process.env.PORT || 80, function () {
    console.log('server running', process.env.PORT);
});