const UserService = require('@services/userService');

class UserController {
    static async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            return res.json({ data: users });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await UserService.getUserById(Number(id));
            if (!user) return res.status(404).json({ error: 'User not found' });
            return res.json({ data: user });
        } catch (error) {
            void error;
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async createUser(req, res) {
        try {
            console.log(req.body);
            const user = await UserService.createUser(req.body);
            return res.status(201).json({ data: user });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const updated = await UserService.updateUser(Number(id), req.body);
            if (!updated) return res.status(404).json({ error: 'User not found' });
            return res.json({ data: updated });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const deleted = await UserService.deleteUser(Number(id));
            if (!deleted) return res.status(404).json({ error: 'User not found' });
            return res.status(204).send();
        } catch (error) {
            void error;
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = UserController;
