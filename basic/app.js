let fs = require('fs');
let express = require('express');
let multer = require('multer');

let app = express();
let uploadSingle = multer({ dest: 'upload-single/' }); 

app.post('/upload-single', uploadSingle.single('logo'), (req, res, next) => {
    var file = req.file;
    var fileInfo = {};

    fileInfo.mimetype = file.mimetype;
    fileInfo.originalname = file.originalname;
    fileInfo.size = file.size;
    fileInfo.path = file.path;

    res.set({
        'content-type': 'application/json; charset=utf-8'
    });

    res.send(JSON.stringify(fileInfo));
});

app.get('/up', (req, res, next) => {
    let form = fs.readFileSync('./index.html', {
        encoding: 'utf8'
    });

    res.send(form);
});

app.listen(3100);
