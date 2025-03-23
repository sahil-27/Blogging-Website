const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Log = require('../models/logs');

exports.CreateUser = (req, res, next) => {
	bcrypt.hash(req.body.password, 10)
		.then(hash => {
			const user = new User({
				username: req.body.username,
				email: req.body.email,
				password: hash
			});
			user.save()
				.then(result => {
					res.status(201).json({
						message: 'User created',
						result: result
					});
				})
				.catch(err => {
					res.status(500).json({
						message: 'Email/username already exists',
						error: err
					});
				});
		})
};

exports.LoginUser = (req, res, next) => {
	let fetchedUser;
	User.findOne({ email: req.body.email })
		.then(user => {
			if (!user) {
				return res.status(401).json({
					message: 'User not found'
				});
			}
			fetchedUser = user;
			return bcrypt.compare(req.body.password, user.password);
		})
		.then(result => {
			if (!result) {
				return res.status(401).json({
					message: 'Incorrect Email/password'
				});
			}

			const token = jwt.sign({
				email: fetchedUser.email, userId: fetchedUser
					._id
			},
				process.env.JWT_KEY, { expiresIn: '1h' });

			res.status(200).json({
				message: 'Auth successful',
				token: token,
				expiresIn: 3600,
				userId: fetchedUser._id,
				username: fetchedUser.username
			});
		})
		.catch(err => {
			return res.status(401).json({
				message: 'Auth failed'
			});
		});
};

exports.PostLogs = (req, res, next) => {
	const logger = req.body.log;
	const log = new Log({ activity: logger });
	log.save().then((result) => {
		return res.status(201).json({
			message: 'log added successfully'
		});
	});
}
