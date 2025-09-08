const config = require('@config/index');
const customErrors = require('@errors/customErrors');
const InvestmentFocusRepository = require('@repositories/investmentFocus');

class InvestmentFocus {
    static async getAll({ page, limit }) {
        const safeLimit = Math.min(limit, config.pagination.maxLimit);
        const offset = (page - 1) * safeLimit;

        const total = await InvestmentFocusRepository.countAll();
        const investmentFocus = await InvestmentFocusRepository.getAllPaginated({ skip: offset, take: safeLimit });

        return { investmentFocus, total, page, limit: safeLimit };
    }

    static async getById(id) {
        const investmentFocusData = await InvestmentFocusRepository.getById(id);
        if (!investmentFocusData) {
            throw new customErrors.InvestmentFocusNotFoundError('Investment focus not found');
        }

        return investmentFocusData;
    }

    static async create(data) {
        const existing = await InvestmentFocusRepository.getByName(data.name);
        if (existing) {
            throw new customErrors.ConflictError('Investment focus name already in use');
        }

        return InvestmentFocusRepository.create(data);
    }

    static async update(id, data) {
        const existing = await InvestmentFocusRepository.getById(id);
        if (!existing) {
            throw new customErrors.InvestmentFocusNotFoundError('Investment focus not found');
        }

        const nameExists = await InvestmentFocusRepository.getByName(data.name);
        if (nameExists && nameExists.id !== id) {
            throw new customErrors.ConflictError('Investment focus name already in use');
        }

        return await InvestmentFocusRepository.update(id, data);
    }

    static async delete(id) {
        const existing = await InvestmentFocusRepository.getById(id);
        if (!existing) {
            throw new customErrors.InvestmentFocusNotFoundError('Investment focus not found');
        }

        await InvestmentFocusRepository.delete(id);
    }
}

module.exports = InvestmentFocus;
