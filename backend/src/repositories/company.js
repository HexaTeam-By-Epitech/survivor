const prisma = require("@config/prisma");

class Company {
    static async create({ account_id, name, legal_status_id = null, address = null, phone_number = null, description = null }) {
        return prisma.companies.create({
            data: {
                account_id,
                name,
                legal_status_id,
                address,
                phone_number,
                description
            }
        });
    }

    static async getById(id) {
        return prisma.companies.findUnique({
            where: { id }
        });
    }

    static async findByName(name) {
        return prisma.companies.findUnique({
            where: { name }
        });
    }

    static async findByAccountId(account_id) {
        return prisma.companies.findFirst({
            where: { account_id }
        });
    }

    static async delete(id) {
        // Supprime d'abord les News liées
        await prisma.news.deleteMany({
            where: { company_id: id }
        });

        // Supprime ensuite la company
        return prisma.companies.delete({
            where: { id }
        });
    }
}

module.exports = Company;
