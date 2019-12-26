//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const mongoose = require("mongoose");

mongoose.connect("mongodb url", {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const blogSchema = {
  topic: String,
  body: String
};

const Blog = mongoose.model("Blog", blogSchema);


app.get("/posts/:route", function(req, res) {
  const urlinfo = req.params.route;

  console.log(urlinfo);
  Blog.findOne({topic:urlinfo}, function(err, result){
      res.render('post', {
        postTitle: result.topic,
        postBody: result.body
      });
  });
});

app.get("/", function(req, res) {
  Blog.find(function(err,Blogs){
    res.render('home', {
      blogData: Blogs
    });
  });
});

app.get("/about", function(req, res) {
  res.render('about');
});

app.get("/contact", function(req, res) {
  res.render('contact');
});

app.get("/compose", function(req, res) {
  res.render('compose');
});

app.post("/compose", function(req, res) {
    const postTitle= req.body.title;
    const postContent= req.body.post;

    const blogPost = new Blog({
      topic: postTitle,
      body: postContent
    });
    blogPost.save(function(err){
      if(!err){
        res.redirect("/");
      }
    });
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
