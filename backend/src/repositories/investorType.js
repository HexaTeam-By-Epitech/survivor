const prisma = require('@config/prisma');

class InvestorType {
    static countAll() {
        return prisma.investorTypes.count();
    }

    static getAllPaginated({ skip, take }) {
        return prisma.investorTypes.findMany({
            skip,
            take,
            orderBy: {
                id: 'asc'
            }
        });
    }

    static async getById(id) {
        return prisma.investorTypes.findUnique({
            where: { id }
        });
    }

    static async getByName(name) {
        return prisma.investorTypes.findUnique({
            where: { name }
        });
    }

    static async create(data) {
        return prisma.investorTypes.create({
            data
        });
    }

    static async update(id, data) {
        return prisma.investorTypes.update({
            where: { id },
            data
        });
    }

    static async delete(id) {
        return prisma.investorTypes.delete({
            where: { id }
        });
    }
}

module.exports = InvestorType;
