import ApiError from '../error/api-error.js';

class UserController {
    async registration(req, res) {
        // console.log('user-controller: registration');
        res.json({ message: 'user-controller: registration'});
    }

    async login(req, res) {
        // console.log('user-controller: login');
        res.json({ message: 'user-controller: login'});
        // res.json({ message: 'user-controller: login'});
    }

    async check(req, res, next) {
        console.log('user-controller: check');
        const { id } = req.query;
        
        if (!id) {
            next(ApiError.badRequest('id is missing from the request'));
        }

        res.json(id);
    }
}

export default UserController;
