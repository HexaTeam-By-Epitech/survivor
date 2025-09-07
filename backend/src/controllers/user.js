const ApiResponse = require('@utils/response');
const customErrors = require('@errors/customErrors');
const UserService = require('@services/user');

class User {
    static async getAllUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || undefined;

            const result = await UserService.getAll({ page, limit });

            return ApiResponse.paginated(res, result.users, result.page, result.limit, result.total);
        } catch (error) {
            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async getUserById(req, res) {
        try {
            const uid = parseInt(req.params.id);
            const user = await UserService.getById(uid);

            return ApiResponse.success(res, user);
        } catch (error) {
            if (error instanceof customErrors.UserNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'USER_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async createUser(req, res) {
        try {
            const data = req.body;
            const user = await UserService.create(data);

            return ApiResponse.success(res, user);
        } catch (error) {
            if (error instanceof customErrors.UserNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'USER_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async updateUser(req, res) {
        try {
            const uid = parseInt(req.params.id);
            const data = req.body;

            await UserService.update(uid, data);

            return ApiResponse.success(res, null, 'User updated successfully');
        } catch (error) {
            if (error instanceof customErrors.UserNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'USER_NOT_FOUND');
            }
            if (error instanceof customErrors.ConflictError) {
                return ApiResponse.conflict(res, error.message, 'MAIL_IN_USE');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async deleteUser(req, res) {
        try {
            const uid = parseInt(req.params.id);

            await UserService.delete(uid);

            return ApiResponse.success(res, null, 'User deleted successfully');
        } catch (error) {
            if (error instanceof customErrors.UserNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'USER_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }
}

module.exports = User;
