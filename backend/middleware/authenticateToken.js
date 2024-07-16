const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
}

module.exports = authenticateToken;
