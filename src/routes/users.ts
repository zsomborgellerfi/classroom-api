import express from "express";
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/user'

const router = express.Router();

// Handle user signup
router.post('/signup', (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length) {
                return res.status(422).json({
                    message: 'Email exists'
                })
            } else {
                // Hash user password for security reasons
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        })
                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(200).json({
                                    message: 'User created'
                                })
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            })
                    }
                })
            }
        });
});

// Handle user login
router.post('/login', async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
    // Compare plain text password with hashed password
    const auth = await bcrypt.compare(req.body.password, user.password);
    if (auth) {
        const token = jwt.sign({
                email: user.email,
                userId: user._id,
            },
            process.env.JWT_KEY,
            {expiresIn: "1h"},
            );
        res.status(200).json({
            message: 'Authenticated',
            token
        })
    } else {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
})

router.delete('/delete/:userId', async (req, res, next) => {
    try {
        await User.deleteOne({_id: req.params.userId})
        return res.status(200).json({
            message: 'User deleted'
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
})

export default router;
