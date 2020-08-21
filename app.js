var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
const upload=require('./middleware')
var im = require('imagemagick');
var sharp = require('sharp');


// var indexRouter = require('./routes/index');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res){
  res.render('index', { title: 'Image Upload' });
});

app.get('/images', function (req, res){
  console.log("in")
  const directoryPath = path.join(__dirname, "/public/images/uploads/fullsize")

  fs.readdir(directoryPath, function(err, files) {
    if (err) {
      console.log("Error getting directory information.")
    } else {
      console.log(files)
      files.forEach(function(file) {
        console.log(file)

      })
    }
    res.render('imageview', { imageArray: files });

  })


});

app.post('/upload',upload.single('image'), function(req, res) {
  console.log(req.file.path)
  fs.readFile(req.file.path, function (err, data) {
    var imageName = req.file.originalname
    // If there's an error
    if(!imageName){
      console.log("There was an error")
      res.redirect("/");
      res.end();
    } else {
      var fullPath = __dirname + "/public/images/uploads/fullsize/" + imageName;
      var thumbPath = __dirname + "/public/images/uploads/thumb/" + imageName;
      // write file to uploads/fullsize folder
      fs.writeFile(fullPath, data, function (err) {
        // let's see it
        // im.resize({
        //   srcPath: fullPath,
        //   dstPath: thumbPath,
        //   width:   200
        // }, function(err, stdout, stderr){
        //   if (err) console.log( err);
        //   console.log('resized image to fit within 200x200px');
        // });

        sharp(fullPath).resize(200, 200)
            .jpeg({quality: 50}).toFile(thumbPath);

        // res.render('index', { title: 'Image Upload',message:'Image uploaded' })

        res.redirect('/');


      });
    }
  });
});

module.exports = app;
