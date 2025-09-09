const ApiResponse = require('@utils/response');
const customErrors = require('@errors/customErrors');
const LegalStatusService = require('@services/legalStatus');

class LegalStatus {
    static async getAllLegalStatus(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || undefined;

            const result = await LegalStatusService.getAll({ page, limit });

            return ApiResponse.paginated(res, result.legalStatus, result.page, result.limit, result.total);
        } catch (error) {
            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async getLegalStatusById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const legalStatus = await LegalStatusService.getById(id);

            return ApiResponse.success(res, legalStatus);
        } catch (error) {
            if (error instanceof customErrors.LegalStatusNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'LEGAL_STATUS_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async createLegalStatus(req, res) {
        try {
            const data = req.body;
            const legalStatus = await LegalStatusService.create(data);

            return ApiResponse.success(res, legalStatus);
        } catch (error) {
            if (error instanceof customErrors.ConflictError) {
                return ApiResponse.conflict(res, error.message, 'LEGAL_STATUS_CONFLICT');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async updateLegalStatus(req, res) {
        try {
            const id = parseInt(req.params.id);
            const data = req.body;

            await LegalStatusService.update(id, data);

            return ApiResponse.success(res, null, 'Legal status updated successfully');
        } catch (error) {
            if (error instanceof customErrors.LegalStatusNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'LEGAL_STATUS_NOT_FOUND');
            }
            if (error instanceof customErrors.ConflictError) {
                return ApiResponse.conflict(res, error.message, 'LEGAL_STATUS_CONFLICT');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async deleteLegalStatus(req, res) {
        try {
            const id = parseInt(req.params.id);
            await LegalStatusService.delete(id);

            return ApiResponse.success(res, null, 'Legal status deleted successfully');
        } catch (error) {
            if (error instanceof customErrors.LegalStatusNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'LEGAL_STATUS_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }
}

module.exports = LegalStatus;
