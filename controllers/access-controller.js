import ApiError from "../error/api-error.js";

class AccessController {
    // дать доступ определенному пользователю к определенному файлу
    async create(req, res) {
        const { file, user } = req.body;
        // console.log('user-controller: login');
        res.json({ message: 'access-controller: create'});
    }

    // удалить доступ определенного пользователю к определенному файлу
    async delete(req, res) {
        // console.log('user-controller: check');
        res.json({ message: 'access-controller: delete'});
    }
}

export default AccessController;
