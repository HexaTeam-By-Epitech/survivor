const ApiResponse = require('@utils/response');
const customErrors = require('@errors/customErrors');
const InvestmentFocusService = require('@services/investmentFocus');

class InvestmentFocus {
    static async getAllInvestmentFocus(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || undefined;

            const result = await InvestmentFocusService.getAll({ page, limit });

            return ApiResponse.paginated(res, result.investmentFocus, result.page, result.limit, result.total);
        } catch (error) {
            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async getInvestmentFocusById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const investmentFocus = await InvestmentFocusService.getById(id);

            return ApiResponse.success(res, investmentFocus);
        } catch (error) {
            if (error instanceof customErrors.InvestmentFocusNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'INVESTMENT_FOCUS_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async createInvestmentFocus(req, res) {
        try {
            const data = req.body;
            const investmentFocus = await InvestmentFocusService.create(data);

            return ApiResponse.success(res, investmentFocus);
        } catch (error) {
            if (error instanceof customErrors.ConflictError) {
                return ApiResponse.conflict(res, error.message, 'INVESTMENT_FOCUS_CONFLICT');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async updateInvestmentFocus(req, res) {
        try {
            const id = parseInt(req.params.id);
            const data = req.body;

            await InvestmentFocusService.update(id, data);

            return ApiResponse.success(res, null, 'Investment focus updated successfully');
        } catch (error) {
            if (error instanceof customErrors.InvestmentFocusNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'INVESTMENT_FOCUS_NOT_FOUND');
            }
            if (error instanceof customErrors.ConflictError) {
                return ApiResponse.conflict(res, error.message, 'INVESTMENT_FOCUS_CONFLICT');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async deleteInvestmentFocus(req, res) {
        try {
            const id = parseInt(req.params.id);

            await InvestmentFocusService.delete(id);

            return ApiResponse.success(res, null, 'Investment focus deleted successfully');
        } catch (error) {
            if (error instanceof customErrors.InvestmentFocusNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'INVESTMENT_FOCUS_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }
}

module.exports = InvestmentFocus;
