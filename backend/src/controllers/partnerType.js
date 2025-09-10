const ApiResponse = require('@utils/response');
const customErrors = require('@errors/customErrors');
const PartnerTypeService = require('@services/partnerType');

class PartnerType {
    static async getAllPartnerTypes(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || undefined;

            const result = await PartnerTypeService.getAll({ page, limit });

            return ApiResponse.paginated(res, result.partnerTypes, result.page, result.limit, result.total);
        } catch (error) {
            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async getPartnerTypeById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const partnerType = await PartnerTypeService.getById(id);

            return ApiResponse.success(res, partnerType);
        } catch (error) {
            if (error instanceof customErrors.PartnerTypeNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'PARTNER_TYPE_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async createPartnerType(req, res) {
        try {
            const data = req.body;
            const newPartnerType = await PartnerTypeService.create(data);

            return ApiResponse.success(res, newPartnerType, 'Partner type created successfully');
        } catch (error) {
            if (error instanceof customErrors.ConflictError) {
                return ApiResponse.conflict(res, error.message, 'PARTNER_TYPE_CONFLICT');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async updatePartnerType(req, res) {
        try {
            const id = parseInt(req.params.id);
            const data = req.body;

            const updatedPartnerType = await PartnerTypeService.update(id, data);

            return ApiResponse.success(res, updatedPartnerType, 'Partner type updated successfully');
        } catch (error) {
            if (error instanceof customErrors.PartnerTypeNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'PARTNER_TYPE_NOT_FOUND');
            }
            if (error instanceof customErrors.ConflictError) {
                return ApiResponse.conflict(res, error.message, 'PARTNER_TYPE_CONFLICT');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async deletePartnerType(req, res) {
        try {
            const id = parseInt(req.params.id);
            await PartnerTypeService.delete(id);

            return ApiResponse.success(res, null, 'Partner type deleted successfully');
        } catch (error) {
            if (error instanceof customErrors.PartnerTypeNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'PARTNER_TYPE_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }
}

module.exports = PartnerType;
