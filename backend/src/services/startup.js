const StartupRepository = require("@repositories/startup");
const CompanyRepository = require("@repositories/company");
const AccountRepository = require("@repositories/account");

class Startup {
    static async getAll() {
        return await StartupRepository.findAll();
    }

    static async getById(id) {
        return await StartupRepository.findById(id);
    }

    static async update(id, data) {
        const { website_url } = data;
        return await StartupRepository.update(id, { website_url });
    }

    static async delete(id) {
        const startup = await StartupRepository.findById(id);
        if (!startup) throw new Error("Startup not found");

        const companyId = startup.company_id;
        const company = await CompanyRepository.findById(companyId);
        const accountId = company.account_id;

        await StartupRepository.delete(id);
        await CompanyRepository.delete(companyId);
        await AccountRepository.delete(accountId);
    }
}

module.exports = Startup;
