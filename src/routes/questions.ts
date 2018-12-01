import express from "express";
import mongoose from 'mongoose';

import Question from "../models/question";

const router = express.Router();
// Handle incoming GET requests to /questions
router.get('/', (req, res, next) => {
    Question.find()
        .exec()
        .then((docs) => {
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({error: err});
        });
});

router.post('/', (req, res, next) => {
    const question = new Question({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        answer: req.body.answer
    });
    question.save().then((result) => {
        console.log(result);
        res.status(200).json({
            message: 'Post works!!',
            question: result,
        });
    })
        .catch((err) => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

router.get('/:questionId', (req, res, next) => {
    const id = req.params.questionId;
    Question.findById(id)
        .exec()
        .then((doc) => {
            console.log(doc);
            if (doc) res.status(200).json(doc);
            else res.status(404).json({message: 'No valid question found.'});
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

router.patch('/:questionId', (req, res, next) => {
    const id = req.params.questionId;
    const updateOps = {};
    /*  for (const ops of req.body) {
          updateOps[ops.propName] = ops.value;
      }*/
    Question.update({_id: id}, {$set: updateOps})
        .exec()
        .then((result) => {
            if (result) res.status(200).json(result);
            else res.status(404).json({message: 'No valid question found.'});
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

router.delete('/:questionId', (req, res, next) => {
    const id = req.params.questionId;
    Question.deleteOne({_id: id})
        .then((result) => {
            if (result) res.status(200).json(result);
            else res.status(404).json({message: 'No valid question found.'});
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

export default router;
