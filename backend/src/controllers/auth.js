const ApiResponse = require('@utils/response');
const AuthService = require('@services/auth.service');

class Auth {
    static async signup(req, res) {
        try {
            const token = await AuthService.signup(req.body);
            return ApiResponse.success(res, token);
        } catch (error) {
            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const token = await AuthService.login(email, password);
            return ApiResponse.success(res, token);
        } catch (error) {
            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }
}

module.exports = Auth;
