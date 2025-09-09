const ApiResponse = require('@utils/response');
const customErrors = require('@errors/customErrors');
const SectorService = require('@services/sector');

class Sector {
    static async getAllSectors(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || undefined;

            const result = await SectorService.getAll({ page, limit });

            return ApiResponse.paginated(res, result.sectors, result.page, result.limit, result.total);
        } catch (error) {
            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async getSectorById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const sector = await SectorService.getById(id);

            return ApiResponse.success(res, sector);
        } catch (error) {
            if (error instanceof customErrors.SectorNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'SECTOR_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async createSector(req, res) {
        try {
            const data = req.body;
            const sector = await SectorService.create(data);

            return ApiResponse.success(res, sector);
        } catch (error) {
            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async updateSector(req, res) {
        try {
            const id = parseInt(req.params.id);
            const data = req.body;

            await SectorService.update(id, data);

            return ApiResponse.success(res, null, 'Sector updated successfully');
        } catch (error) {
            if (error instanceof customErrors.SectorNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'SECTOR_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }

    static async deleteSector(req, res) {
        try {
            const id = parseInt(req.params.id);

            await SectorService.delete(id);

            return ApiResponse.success(res, null, 'Sector deleted successfully');
        } catch (error) {
            if (error instanceof customErrors.SectorNotFoundError) {
                return ApiResponse.notFound(res, error.message, 'SECTOR_NOT_FOUND');
            }

            return ApiResponse.error(res, 'Internal error', 'INTERNAL_ERROR', 550, error);
        }
    }
}

module.exports = Sector;
