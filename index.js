const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// The default behavior of EJS is that it looks into the ‘views’ folder for the templates to render. So, let’s make a ‘views’ folder in our main node project folder and make a file named “index.ejs” which is to be served on some desired requests in our node project. 
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get('/', function(req, res) {
  fs.readdir(`./files`, function(err, files) {
    res.render("index", {files: files});
  })
});

app.get('/files/:filename', function(req, res) {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, filedata) {
    res.render('show', {filename: req.params.filename, filedata: filedata});
  })
});

app.get('/edit/:filename', function(req, res) {
  res.render('edit', {filename: req.params.filename});
});

app.post('/edit', function(req, res) {
  fs.rename(`./files/${req.body.Previous}`, `./files/${req.body.New}`, function(err) {
    res.redirect("/");
  })
});

app.post('/create', function(req, res) {
  fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, function(err) {
    res.redirect("/");
  });
});

const port = process.env.PORT;
app.listen(port, function() {
  console.log("Listening on port 3000")
});


