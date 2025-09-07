const ApiResponse = require('@utils/response');
const customErrors = require('@errors/customErrors');
const StartupService = require('@services/startup');

class Startup {
    static async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || undefined;

            const result = await StartupService.getAll({ page, limit });

            return ApiResponse.paginated(res, result.startups, result.page, result.limit, result.total);
        } catch (error) {
            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async getById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const startup = await StartupService.getById(id);

            return ApiResponse.success(res, startup);
        } catch (error) {
            if (error instanceof customErrors.StartupNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'STARTUP_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const data = req.body;

            const updated = await StartupService.update(id, data);

            return ApiResponse.success(res, updated, 'Startup updated successfully');
        } catch (error) {
            if (error instanceof customErrors.StartupNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'STARTUP_NOT_FOUND');
            }
            if (error instanceof customErrors.ConflictError) {
                return ApiResponse.conflict(res, error.message, 'STARTUP_CONFLICT');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            await StartupService.delete(id);

            return ApiResponse.success(res, null, 'Startup deleted successfully');
        } catch (error) {
            if (error instanceof customErrors.StartupNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'STARTUP_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }
}

module.exports = Startup;
