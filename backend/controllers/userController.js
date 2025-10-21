import mongoose from "mongoose";
import User from '../models/userModel.js'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


const TOKEN_EXPIRES_IN = '24h';
const JWT_SECRET_KEY = 'your_secret_key_here';

// Register

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ success: false, message: 'All fields are required' })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'invalid email'
            })
        }
        const exists = await User.findOne({ email }).lean()
        if (exists) return res.status(409).json({ success: false, message: 'user already exists' })
        const newId = new mongoose.Types.ObjectId();
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            _id: newId,
            name,
            email,
            password: hashedPassword
        });
        await user.save();
        if (!JWT_SECRET_KEY) throw new Error('JWT_SECRET is not found on server');
        const token = jwt.sign({ id: newId.toString() }, JWT_SECRET_KEY, { expiresIn: TOKEN_EXPIRES_IN })
        return res.status(201).json({
            success: true,
            message: 'Account Created Successfully!',
            token,
            user: { id: user._id.toString(), name: user.name, email: user.email }
        })
    } catch (error) {
        console.log('Register Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        })
    }
}

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are Required'
            })
        }
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        })
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password' })
        const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET_KEY, { expiresIn: TOKEN_EXPIRES_IN })
        return res.status(201).json({
            success: true,
            message: 'Login Successfully!',
            token,
            user: { id: user._id.toString(), name: user.name, email: user.email }
        })
    } catch (error) {
        console.log('Login Error:', error)
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        })
    }
}
