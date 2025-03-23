const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./models/post');
const mongoose = require('mongoose');


const app = express();
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://shaiksahil270:' + process.env.MONGO_ATLAS_PW + '@cluster0.lggq0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
	.then(() => {
		console.log('Connected to database');
	})
	.catch(() => {
		console.log('Connection failed');
	});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static('images'));

app.use((req, res, next) => {
	res.setHeader(
		'Access-Control-Allow-Origin', '*'
	);
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PATCH, PUT, DELETE, OPTIONS'
	);
	next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
module.exports = app;