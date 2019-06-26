let fs = require('fs');
let express = require('express');
let multer = require('multer');
let child_process = require('child_process');
let path = require('path');

let app = express();
let createFolder = (folder) => {
  try {
    fs.accessSync(folder);
  }
  catch (e) {
  fs.mkdirSync(folder);
  }
};
let tmpFolder = './tmp/';  // only one file. the lastest version
createFolder(tmpFolder);
let uploadFolder = './upload/';  // history versions.
createFolder(uploadFolder);
let downloadFolder = './download/';  // patches
createFolder(downloadFolder);


let storage = multer.diskStorage(
  { destination: (req, file, cb) => { cb(null, tmpFolder); },
  filename: (req, file, cb) => { cb(null, file.originalname); } }
);
let upload = multer({ storage: storage });


app.get('/up', (req, res, next) => {
  child_process.exec('mv tmp/* upload/');  // move  the lastest version to history version
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
  
  child_process.exec(
  'for file in `ls ./upload/`; do bsdiff ./upload/$file ./tmp/* download/${file}$(ls ./tmp/).patch; done;'
  );
});


app.get('/down', (req, res, next) => {
  let name = req.query.name;
  let latest = fs.readdirSync('tmp');
  let queryfile = name + latest;
  var queryfilepath = path.resolve(__dirname, 'download/', queryfile);
  res.download(queryfilepath);
})

app.listen(3100);
