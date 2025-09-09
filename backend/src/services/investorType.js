const config = require('@config/index');
const customErrors = require('@errors/customErrors');
const InvestorTypeRepository = require('@repositories/investorType');

class InvestorType {
    static async getAll({ page, limit }) {
        const safeLimit = Math.min(limit, config.pagination.maxLimit);
        const offset = (page - 1) * safeLimit;

        const total = await InvestorTypeRepository.countAll();
        const investorTypes = await InvestorTypeRepository.getAllPaginated({ skip: offset, take: safeLimit });

        return { investorTypes, total, page, limit: safeLimit };
    }

    static async getById(id) {
        const investorTypeData = await InvestorTypeRepository.getById(id);
        if (!investorTypeData) {
            throw new customErrors.InvestorTypeNotFoundError('Investor type not found');
        }

        return investorTypeData;
    }

    static async create(data) {
        const existing = await InvestorTypeRepository.getByName(data.name);
        if (existing) {
            throw new customErrors.ConflictError('Investor type name already in use');
        }

        return InvestorTypeRepository.create(data);
    }

    static async update(id, data) {
        const existing = await InvestorTypeRepository.getById(id);
        if (!existing) {
            throw new customErrors.InvestorTypeNotFoundError('Investor type not found');
        }

        const nameExists = await InvestorTypeRepository.getByName(data.name);
        if (nameExists && nameExists.id !== id) {
            throw new customErrors.ConflictError('Investor type name already in use');
        }

        return await InvestorTypeRepository.update(id, data);
    }

    static async delete(id) {
        const existing = await InvestorTypeRepository.getById(id);
        if (!existing) {
            throw new customErrors.InvestorTypeNotFoundError('Investor type not found');
        }

        await InvestorTypeRepository.delete(id);
    }
}

module.exports = InvestorType;
