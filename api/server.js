const express = require('express')
const server = express();
server.use(express.json());

const blogsRouter = require('../hubs/blogs-router.js');

server.get('/', (req, res) => {
    res.send(`<h2>WEB API II</h2>
        <p>Welcome to the WEB API II</p>`);
    }
)

server.use('/api/posts', blogsRouter);

module.exports = server;