const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function checkAuth(req, res, next) {
    const header = req.headers['authorization'];
    if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });

    const token = header.split(' ')[1];
    try {
        req.auth = jwt.verify(token, JWT_SECRET);
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
}

function checkRole(roles = []) {
    return (req, res, next) => {
        if (!req.auth || !roles.includes(req.auth.role)) {
            return res.status(403).json({ error: 'Forbidden: insufficient role' });
        }
        next();
    };
}

module.exports = { checkAuth, checkRole };
