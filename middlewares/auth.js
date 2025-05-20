const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ msg: 'No token, access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded.admin;
        next();
    } catch (err) {
        res.status(400).json({ msg: 'Token is not valid' });
    }
};
