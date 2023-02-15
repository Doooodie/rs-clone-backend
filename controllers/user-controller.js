import ApiError from '../error/api-error.js';
import { User } from '.././models/models.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs/promises';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SECRET_KEY = 'badoon';

function generateJwt(id, name, email) {
    return jwt.sign(
        { id, name, email, },
        SECRET_KEY,
        { expiresIn: '1h' },
    )
};

class UserController {
    async registration(req, res, next) {
        console.log('user-controller: registration');

        try {
            const { name, email, password } = req.body;
            console.log('name = ' + name + ', email = ' + email + ', password = ' + password );

            if (!name || !email || !password) {
                return next(ApiError.badRequest('input correct data'));
            }

            const reqName = await User.findOne({ where: { name } });
            if (reqName) {
                return next(ApiError.badRequest(`user with name «${name}» already exists`));
            }

            const reqEmail = await User.findOne({ where: { email } });
            if (reqEmail) {
                return next(ApiError.badRequest(`this e-mail «${email}» is already in use`));
            }

            const hashPassword = await bcrypt.hash(password, 4);
            
            let newUser;
            try {
                newUser = await User.create({ name, email, password: hashPassword });
            } catch(e) {
                next(ApiError.internal(e.message));
            }

            const token = generateJwt(newUser.id, newUser.name, newUser.email);

            // create a folder for new user into /PUBLIC
            try {
                await fs.mkdir(path.resolve(__dirname, '..', 'public', `${newUser.name}`));
            } catch(e) {
                next(ApiError.internal(e.message));
            }
            // -----------------------------
            return res.json({ token });
        } catch(e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async login(req, res, next) {
        console.log('user-controller: login');

        const { name, email, password } = req.body;
        
        // find user in DB by name & email fields
        let user;
        try {
            user = await User.findOne({ where: { name: name, email: email } });
            if (!user) {
                return next(ApiError.internal(`User named «${name}» with email «${email}» not found`));
            };
        } catch (e) {
            next(ApiError.internal(e.message));
        };

        let comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return next(ApiError.internal('Wrong password specified'));
        };

        const token = generateJwt(user.id, user.name, user.email);
        return res.json({ token });
    }

    async check(req, res) {
        const token = generateJwt(req.user.id, req.user.name, req.user.email);
        return res.json({ token });
    }
}

export default UserController;
