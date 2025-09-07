const prisma = require("@config/prisma");

class Startup {
    static async create({ company_id }) {
        return prisma.startups.create({
            data: { company_id }
        });
    }

    static async findAll() {
        return prisma.startups.findMany({
            include: {
                Companies: {
                    include: {
                        Accounts: true
                    }
                }
            }
        });
    }

    async findByEmail(email) {
        return prisma.startups.findUnique({ where: { email } });
    }

    static async findById(id) {
        return prisma.startups.findUnique({
            where: { id },
            include: {
                Companies: {
                    include: {
                        Accounts: true
                    }
                }
            }
        });
    }

    static async findByCompanyId(company_id) {
        return prisma.startups.findFirst({
            where: { company_id }
        });
    }

    static async update(id, data) {
        return prisma.startups.update({
            where: { id },
            data
        });
    }

    static async delete(id) {
        // Supprime d'abord les relations StartupsFounders
        await prisma.startupsFounders.deleteMany({
            where: { startup_id: id }
        });

        // Supprime la startup
        return prisma.startups.delete({
            where: { id }
        });
    }
}

module.exports = Startup;
