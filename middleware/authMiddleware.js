import jwt from 'jsonwebtoken';

const SECRET_KEY = 'badoon';

export default (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'DELETE') {
        next();
    };

    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log(token);

        if (!token) {
            return res.status(401).json({ message: 'User not authorized' });
        };

        const decoded = jwt.verify(token, SECRET_KEY);
        console.log('decoded = ' + decoded);
        req.user = decoded;

        next();
    } catch (e) {
        res.status(401).json({message: 'User not authorized'});
    };
};