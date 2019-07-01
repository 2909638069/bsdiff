let fs = require('fs');
let express = require('express');
let multer = require('multer');
let child_process = require('child_process');
let path = require('path');
let mysql = require('mysql');


let app = express();
let createFolder = (folder) => {
  try {
    fs.accessSync(folder);
  }
  catch (e) {
  fs.mkdirSync(folder);
  }
};
let latestFolder = './latest/';  // only one file. the lastest version
createFolder(latestFolder);
let pastsFolder = './pasts/';  // history versions.
createFolder(pastsFolder);
let patchesFolder = './patches/';  // patches
createFolder(patchesFolder);

let storage = multer.diskStorage(
  { destination: (req, file, cb) => { cb(null, latestFolder); },
  filename: (req, file, cb) => { cb(null, file.originalname); } }
);
let upload = multer({ storage: storage });

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'dyw',
  port: '3306',
});


app.get('/up', (req, res, next) => {
  child_process.exec('mv latest/* pasts/');  // move  the lastest version to pasts version
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
  'for file in `ls ./pasts/`; do bsdiff ./pasts/$file ./latest/* patches/${file}$(ls ./latest/); done;'
  );
  latest = fs.readdirSync('./latest/');
  pasts = fs.readdirSync('./pasts/');
  console.log(pasts);
  console.log(latest);
});


app.get('/down', (req, res, next) => {
  let name = req.query.name;
  let latest = fs.readdirSync('latest');
  let queryfile = name + latest;
  var queryfilepath = path.resolve(__dirname, 'patches/', queryfile);
  res.download(queryfilepath);
})

app.listen(3100);
