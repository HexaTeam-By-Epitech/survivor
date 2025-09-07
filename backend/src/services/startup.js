const config = require('@config/index');
const customErrors = require('@errors/customErrors');
const StartupRepository = require('@repositories/startup');
const CompanyRepository = require('@repositories/company');
const AccountRepository = require('@repositories/account');

class Startup {
    static async getAll({ page, limit }) {
        const safeLimit = Math.min(limit, config.pagination.maxLimit);
        const offset = (page - 1) * safeLimit;

        const total = await StartupRepository.countAll();
        const startups = await StartupRepository.getAllPaginated({ skip: offset, take: safeLimit });

        return { startups, total, page, limit: safeLimit };
    }

    static async getById(id) {
        const startup = await StartupRepository.getById(id);
        if (!startup) {
            throw new customErrors.StartupNotFoundError('Startup not found');
        }

        return startup;
    }

    static async update(id, data) {
        const startup = await StartupRepository.getById(id);
        if (!startup) {
            throw new customErrors.StartupNotFoundError('Startup not found');
        }

        const updateData = {};
        if (data.name) updateData.name = data.name;
        if (data.website_url) updateData.website_url = data.website_url;
        if (data.description) updateData.description = data.description;

        return await StartupRepository.update(id, updateData);
    }

    static async delete(id) {
        const startup = await StartupRepository.getById(id);
        if (!startup) {
            throw new customErrors.StartupNotFoundError('Startup not found');
        }

        const companyId = startup.company_id;
        const company = await CompanyRepository.getById(companyId);
        if (!company) {
            throw new customErrors.CompanyNotFoundError('Company not found');
        }

        const accountId = company.account_id;
        if (!accountId) {
            throw new customErrors.AccountNotFoundError('Account not found');
        }

        await StartupRepository.delete(id);
        await CompanyRepository.delete(companyId);
        await AccountRepository.delete(accountId);
    }
}

module.exports = Startup;
