const prisma = require('@config/prisma');

class LegalStatus {
    static countAll() {
        return prisma.legalStatus.count();
    }

    static getAllPaginated({ skip, take }) {
        return prisma.legalStatus.findMany({
            skip,
            take,
            orderBy: {
                id: 'asc'
            }
        });
    }

    static async getById(id) {
        return prisma.legalStatus.findUnique({
            where: { id }
        });
    }

    static async getByName(name) {
        return prisma.legalStatus.findUnique({
            where: { name }
        });
    }

    static async create(data) {
        return prisma.legalStatus.create({
            data
        });
    }

    static async update(id, data) {
        return prisma.legalStatus.update({
            where: { id },
            data
        });
    }

    static async delete(id) {
        return prisma.legalStatus.delete({
            where: { id }
        });
    }
}

module.exports = LegalStatus;
