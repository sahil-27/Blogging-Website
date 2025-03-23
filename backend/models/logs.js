const mongoose = require('mongoose');

const logsSchema = mongoose.Schema({
	activity: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Logs', logsSchema);