const prisma = require('@config/prisma');

class InvestmentFocus {
    static countAll() {
        return prisma.investmentFocus.count();
    }

    static getAllPaginated({ skip, take }) {
        return prisma.investmentFocus.findMany({
            skip,
            take,
            orderBy: {
                id: 'asc'
            }
        });
    }

    static async getById(id) {
        return prisma.investmentFocus.findUnique({
            where: { id }
        });
    }

    static async getByName(name) {
        return prisma.investmentFocus.findUnique({
            where: { name }
        });
    }

    static async create(data) {
        return prisma.investmentFocus.create({
            data
        });
    }

    static async update(id, data) {
        return prisma.investmentFocus.update({
            where: { id },
            data
        });
    }

    static async delete(id) {
        return prisma.investmentFocus.delete({
            where: { id }
        });
    }
}

module.exports = InvestmentFocus;
