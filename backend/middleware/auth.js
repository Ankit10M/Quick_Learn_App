import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

const JWT_SECRET = 'your_secret_key_here'

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Not Authorized, token missing' })
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET)
        const user = await User.findById(payload.id).select('-password')
        
        if (!user) {
            return res
            .status(401)
            .json({ success: false, message: 'User Not Found' })
        }
        
        req.user = user;
        next();
    }
    catch (error) {
        console.log('JWT verification failed', error);
        return res.status(401).json({ success: false, message: 'Token Invalid or Expired' })
    }
}