const config = require('@config/index');
const customErrors = require('@errors/customErrors');
const PartnerTypeRepository = require('@repositories/partnerType');

class PartnerType {
    static async getAll({ page, limit }) {
        const safeLimit = Math.min(limit, config.pagination.maxLimit);
        const offset = (page - 1) * safeLimit;

        const total = await PartnerTypeRepository.countAll();
        const partnerTypes = await PartnerTypeRepository.getAllPaginated({ skip: offset, take: safeLimit });

        return { partnerTypes, total, page, limit: safeLimit };
    }

    static async getById(id) {
        const partnerTypeData = await PartnerTypeRepository.getById(id);
        if (!partnerTypeData) {
            throw new customErrors.PartnerTypeNotFoundError('Partner type not found');
        }

        return partnerTypeData;
    }

    static async create(data) {
        const existing = await PartnerTypeRepository.getByName(data.name);
        if (existing) {
            throw new customErrors.ConflictError('Partner type name already in use');
        }

        return PartnerTypeRepository.create(data);
    }

    static async update(id, data) {
        const existing = await PartnerTypeRepository.getById(id);
        if (!existing) {
            throw new customErrors.PartnerTypeNotFoundError('Partner type not found');
        }

        const nameExists = await PartnerTypeRepository.getByName(data.name);
        if (nameExists && nameExists.id !== id) {
            throw new customErrors.ConflictError('Partner type name already in use');
        }

        return await PartnerTypeRepository.update(id, data);
    }

    static async delete(id) {
        const existing = await PartnerTypeRepository.getById(id);
        if (!existing) {
            throw new customErrors.PartnerTypeNotFoundError('Partner type not found');
        }

        await PartnerTypeRepository.delete(id);
    }
}

module.exports = PartnerType;
