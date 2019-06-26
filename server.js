const express = require('express');
const multer = require('multer');
const child_process = require('child_process');
const fs = require('fs');


const upload = multer({ dest: 'uploads/' });
const server = express();
const host = '127.0.0.1';
const port = 3000;
server.use(express.static('.'));

server.get('/helloworld', (req, res) => res.send('Hello World!'));

server.post('/uploads', upload.single('avatar'), (req, rest, next) => {
  fs.writeFile('./uploads/1.zip', req.file);
  next();
});

server.post('/uploads', (req, res, next) =>
server.listen(port, function () {
  console.log(`Server running at http://${host}:${port}/`);
});
