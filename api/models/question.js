const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    answer: Number
});

module.exports = mongoose.model('Question', questionSchema);