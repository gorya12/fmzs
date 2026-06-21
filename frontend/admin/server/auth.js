const jwt = require('jsonwebtoken');

module.exports = (secret) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ error: 'Токен не предоставлен' });
        }

        const token = authHeader.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Токен не предоставлен' });
        }

        try {
            const decoded = jwt.verify(token, secret);
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ error: 'Недействительный токен' });
        }
    };
};
