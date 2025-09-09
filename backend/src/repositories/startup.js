const prisma = require("@config/prisma");

class Startup {
    static countAll() {
        return prisma.startups.count();
    }

    static getAllPaginated({ skip, take }) {
        return prisma.startups.findMany({
            skip,
            take,
            include: {
                Companies: {
                    include: {
                        Accounts: true
                    }
                },
                Projects: {
                    include: {
                        ProjectStatus: true,
                        Sectors: true
                    }
                }
            },
            orderBy: {
                Companies: {
                    Accounts: {
                        created_at: 'asc'
                    }
                }
            }
        });

    }

    static async create({ company_id }) {
        return prisma.startups.create({
            data: { company_id }
        });
    }

    static async getById(id) {
        return prisma.startups.findUnique({
            where: { id },
            include: {
                Companies: {
                    include: {
                        Accounts: true
                    }
                },
                Projects: {
                    include: {
                        ProjectStatus: true,
                        Sectors: true
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
        return prisma.startups.delete({
            where: { id }
        });
    }
}

module.exports = Startup;
