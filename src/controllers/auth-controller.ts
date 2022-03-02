import brypto from 'crypto';
import { HttpError } from '@adwesh/common';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { natsWraper } from '@adwesh/common';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';

import { User } from '../models/User';

const signUp = async(req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(new HttpError('Invalid inputs', 422));
    }
    let foundUser;
    //let foundSection;
    let hashedPassword: string;
    let token: string;
    const { email, password } = req.body;

    //check if email exists in the DB
    try {
        foundUser = await User.findOne({email}).exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    if(foundUser) {
        return next(new HttpError('Email exists, login instead', 400));
    }
    
    //hash password
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }


    // create new user
    const newUser = new User({
        email, 
        password: hashedPassword, 
        tasks: []
    });

    try {
        await newUser.save();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }

    try {
        token = await jwt.sign( { id: newUser.id, email }, process.env.JWT_KEY!, { expiresIn: '1h' });    
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }

    res.status(201).json({message: 'Sign Up successful', user: { id: newUser.id, email, token }});

}

const login = async(req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(new HttpError('Invalid inputs', 422));
    }
    let foundUser;
    let isPassword: boolean;
    let token: string;
    const { email, password } = req.body;

    //check if email exists in the DB
    try {
        foundUser = await User.findOne({email}).populate('section').exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    if(!foundUser) {
        return next(new HttpError('Email does not exist, sign up instead', 400));
    }

    //compare passwords
    try {
        isPassword = await bcrypt.compare(password, foundUser.password);
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }

    if(!isPassword) {
        return next(new HttpError('Invalid password', 422));
    }

    //generate token
    try {
        token = await jwt.sign( { id: foundUser.id, email: foundUser.email }, process.env.JWT_KEY!, { expiresIn: '1h' });    
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }

    res.status(201).json({message: 'Login Successful', user: { id: foundUser.id, email, token, tasks: foundUser.tasks }})
}

 export { signUp, login };