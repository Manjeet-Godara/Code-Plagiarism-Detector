const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    spaces_created:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Space' }],
    date: { type: Date, default: Date.now },
});

const Professor = mongoose.model('Professor', professorSchema);

module.exports = Professor;