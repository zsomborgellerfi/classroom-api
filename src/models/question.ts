import mongoose from 'mongoose';

const questionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    answer: Number
});

export default mongoose.model('Question', questionSchema);