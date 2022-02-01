const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const path = require('path');

const postsRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');

const app = express();

mongoose.connect("mongodb+srv://sierra:"+ process.env.MONGO_ATLAS_PW + "@meancluster.juc0m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority").then(() => {
  console.log('Connected to DB!');
}).catch(() => {
  console.error('Connection failed!');

});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
