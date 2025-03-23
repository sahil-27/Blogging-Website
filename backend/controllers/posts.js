const Post = require('../models/post');
const user = require('../models/user');
const Log = require('../models/logs');

exports.createPost = (req, res, next) => {
	const now = new Date();
	const postData = {
		username: req.body.username,
		title: req.body.title,
		content: req.body.content,
		creator: req.userData.userId
	};

	if (req.file) {
		const url = req.file.location;
		postData.imagePath = url;
	}

	const post = new Post(postData);
	post.save().then((result) => {
		res.status(201).json({
			message: 'Post added successfully',
			post: {
				...result,
				id: result._id,
			}
		});
	}).catch(error => {
		res.status(500).json({
			message: 'Failed to add post'
		});
	});
};

exports.GetPosts = (req, res, next) => {
	const pageSize = +req.query.pagesize;
	const currentPage = +req.query.page;
	const postQuery = Post.find();
	let fetchedPosts;
	if (pageSize && currentPage) {
		postQuery
			.skip(pageSize * (currentPage - 1))
			.limit(pageSize);
	}
	postQuery
		.then(documents => {
			fetchedPosts = documents;
			return Post.countDocuments();
		})
		.then(count => {
			res.status(200).json({
				message: "Posts fetched successfully",
				posts: fetchedPosts,
				maxPosts: count
			});
		}).catch(error => {
			res.status(500).json({
				message: 'Failed to fetch posts'
			});
		});
};

exports.editPost = (req, res, next) => {
	let imagePath;
	if (req.body.imagePath) {
		imagePath = req.body.imagePath;
	}
	if ((req.file)) {
		imagePath = req.file.location;
	}

	const postData = {
		_id: req.body.id,
		title: req.body.title,
		content: req.body.content,
		creator: req.userData.userId
	};

	if (imagePath) {
		postData.imagePath = imagePath;
	}

	const post = new Post(postData);

	Post.updateOne({ _id: post._id, creator: req.userData.userId }, post).then(
		(result) => {
			if (result.matchedCount > 0) {
				res.status(200).json({ message: "Update successful!" });
			}
			else {
				res.status(401).json({ message: "Not Authorized" });
			}

		}
	).catch(error => {
		res.status(500).json({
			message: 'Failed to update post'
		});
	});

};

exports.getSinglePost = (req, res, next) => {
	Post.findOne({ _id: req.params.id }).then(post => {
		if (post) {
			res.status(200).json(post);
		} else {
			res.status(404).json({ message: 'Post not found' });
		}
	}).catch(error => {
		res.status(500).json({
			message: 'Failed to fetch the post'
		});
	});
};

exports.DeletePost = (req, res, next) => {
	const id = req.params.id;
	Post.deleteOne({ _id: id, creator: req.userData.userId }).then(result => {
		if (result.deletedCount > 0) {
			res.status(200).json({
				message: 'Post deleted'
			});
		}
		else {
			res.status(401).json({
				message: 'Not Authorized'
			});
		}
	}).catch(error => {
		res.status(500).json({
			message: 'Failed to fetch the post'
		});
	});
};