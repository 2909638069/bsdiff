let fs = require('fs');
let express = require('express');
let multer = require('multer');


let app = express();



let createFolder = (folder) => {
  try {
    fs.accessSync(folder);
  }
  catch (e) {
  fs.mkdirSync(folder);
  }
};
let uploadFolder = './upload/';
createFolder(uploadFolder);



let storage = multer.diskStorage(
  { destination: (req, file, cb) => { cb(null, uploadFolder); },
  //filename: (req, file, cb) => { cb(null, file.originalname + '-' + Date.now()); } }
  filename: (req, file, cb) => { cb(null, file.originalname); } }
);
let upload = multer({ storage: storage });



app.get('/', (req, res, next) => {
  let form = fs.readFileSync('./index.html', { encoding: 'utf8' });
  res.send(form);
});



app.post('/upload', upload.single('logo'), (req, res, next) => {
  var file = req.file;
  var fileInfo = {};

  fileInfo.mimetype = file.mimetype;
  fileInfo.originalname = file.originalname;
  fileInfo.size = file.size;
  fileInfo.path = file.path;
  
  res.set({ 'content-type': 'application/json; charset=utf-8' });
  res.send(JSON.stringify(fileInfo));
});


app.listen(3100);
