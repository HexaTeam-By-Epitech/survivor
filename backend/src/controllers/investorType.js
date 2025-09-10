const ApiResponse = require('@utils/response');
const customErrors = require('@errors/customErrors');
const InvestorTypeService = require('@services/investorType');

class InvestorType {
    static async getAllInvestorTypes(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || undefined;

            const result = await InvestorTypeService.getAll({ page, limit });

            return ApiResponse.paginated(res, result.investorTypes, result.page, result.limit, result.total);
        } catch (error) {
            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async getInvestorTypeById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const investorType = await InvestorTypeService.getById(id);

            return ApiResponse.success(res, investorType);
        } catch (error) {
            if (error instanceof customErrors.InvestorTypeNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'INVESTOR_TYPE_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async createInvestorType(req, res) {
        try {
            const data = req.body;
            const investorType = await InvestorTypeService.create(data);

            return ApiResponse.success(res, investorType);
        } catch (error) {
            if (error instanceof customErrors.ConflictError) {
                return ApiResponse.conflict(res, error.message, 'INVESTOR_TYPE_CONFLICT');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async updateInvestorType(req, res) {
        try {
            const id = parseInt(req.params.id);
            const data = req.body;

            await InvestorTypeService.update(id, data);

            return ApiResponse.success(res, null, 'Investor type updated successfully');
        } catch (error) {
            if (error instanceof customErrors.InvestorTypeNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'INVESTOR_TYPE_NOT_FOUND');
            }
            if (error instanceof customErrors.ConflictError) {
                return ApiResponse.conflict(res, error.message, 'INVESTOR_TYPE_CONFLICT');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async deleteInvestorType(req, res) {
        try {
            const id = parseInt(req.params.id);

            await InvestorTypeService.delete(id);

            return ApiResponse.success(res, null, 'Investor type deleted successfully');
        } catch (error) {
            if (error instanceof customErrors.InvestorTypeNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'INVESTOR_TYPE_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }
}

module.exports = InvestorType;
