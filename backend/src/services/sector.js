const config = require('@config/index');
const customErrors = require('@errors/customErrors');
const SectorRepository = require('@repositories/sector');

class Sector {
    static async getAll({ page, limit }) {
        const safeLimit = Math.min(limit, config.pagination.maxLimit);
        const offset = (page - 1) * safeLimit;

        const total = await SectorRepository.countAll();
        const sectors = await SectorRepository.getAllPaginated({ skip: offset, take: safeLimit });

        return { sectors, total, page, limit: safeLimit };
    }

    static async getById(id) {
        const sectorData = await SectorRepository.getById(id);
        if (!sectorData) {
            throw new customErrors.SectorNotFoundError('Sector not found');
        }

        return sectorData;
    }

    static async create(data) {
        const existing = await SectorRepository.getByName(data.name);
        if (existing) {
            throw new customErrors.ConflictError('Sector name already in use');
        }

        return SectorRepository.create(data);
    }

    static async update(id, data) {
        const existing = await SectorRepository.getById(id);
        if (!existing) {
            throw new customErrors.SectorNotFoundError('Sector not found');
        }

        const nameExists = await SectorRepository.getByName(data.name);
        if (nameExists && nameExists.id !== id) {
            throw new customErrors.ConflictError('Sector name already in use');
        }

        return await SectorRepository.update(id, data);
    }

    static async delete(id) {
        const existing = await SectorRepository.getById(id);
        if (!existing) {
            throw new customErrors.SectorNotFoundError('Sector not found');
        }

        await SectorRepository.delete(id);
    }
}

module.exports = Sector;
