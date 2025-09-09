const config = require('@config/index');
const customErrors = require('@errors/customErrors');
const LegalStatusRepository = require('@repositories/legalStatus');

class LegalStatus {
    static async getAll({ page, limit }) {
        const safeLimit = Math.min(limit, config.pagination.maxLimit);
        const offset = (page - 1) * safeLimit;

        const total = await LegalStatusRepository.countAll();
        const legalStatus = await LegalStatusRepository.getAllPaginated({ skip: offset, take: safeLimit });

        return { legalStatus, total, page, limit: safeLimit };
    }

    static async getById(id) {
        const legalStatusData = await LegalStatusRepository.getById(id);
        if (!legalStatusData) {
            throw new customErrors.LegalStatusNotFoundError('Legal status not found');
        }

        return legalStatusData;
    }

    static async create(data) {
        const existing = await LegalStatusRepository.getByName(data.name);
        if (existing) {
            throw new customErrors.ConflictError('Legal status name already in use');
        }

        return LegalStatusRepository.create(data);
    }

    static async update(id, data) {
        const existing = await LegalStatusRepository.getById(id);
        if (!existing) {
            throw new customErrors.LegalStatusNotFoundError('Legal status not found');
        }

        const nameExists = await LegalStatusRepository.getByName(data.name);
        if (nameExists && nameExists.id !== id) {
            throw new customErrors.ConflictError('Legal status name already in use');
        }

        return await LegalStatusRepository.update(id, data);
    }

    static async delete(id) {
        const existing = await LegalStatusRepository.getById(id);
        if (!existing) {
            throw new customErrors.LegalStatusNotFoundError('Legal status not found');
        }

        await LegalStatusRepository.delete(id);
    }
}

module.exports = LegalStatus;
