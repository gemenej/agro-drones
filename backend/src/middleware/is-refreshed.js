import jwt from "jsonwebtoken";

export default (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    
    const token = authHeader.split(' ')[1];
    if (!token) {
        const error = new Error('Malformed token.');
        error.statusCode = 401;
        throw error;
    }
    
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'somesupersecretrefresh');
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
        err.statusCode = 401;
        err.message = 'Token expired.';
        } else if (err.name === 'JsonWebTokenError') {
        err.statusCode = 401;
        err.message = 'Malformed token.';
        } else {
        err.statusCode = 500;
        }
        throw err;
    }
    
    if (!decodedToken) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
    }