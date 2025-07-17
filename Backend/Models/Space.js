const mongoose = require('mongoose');

const spaceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    profId:{ type: mongoose.Schema.Types.ObjectId, ref: 'ProfId' },        
    studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    numerOfStudents: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
});

const Space = mongoose.model('Space', spaceSchema);

module.exports = Space; 