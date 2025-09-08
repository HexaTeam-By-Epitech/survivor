const prisma = require('@config/prisma');

class PartnerType {
    static countAll() {
        return prisma.partnerTypes.count();
    }

    static getAllPaginated({ skip, take }) {
        return prisma.partnerTypes.findMany({
            skip,
            take,
            orderBy: {
                id: 'asc'
            }
        });
    }

    static async getById(id) {
        return prisma.partnerTypes.findUnique({
            where: { id }
        });
    }

    static async getByName(name) {
        return prisma.partnerTypes.findUnique({
            where: { name }
        });
    }

    static async create(data) {
        return prisma.partnerTypes.create({
            data
        });
    }

    static async update(id, data) {
        return prisma.partnerTypes.update({
            where: { id },
            data
        });
    }

    static async delete(id) {
        return prisma.partnerTypes.delete({
            where: { id }
        });
    }
}

module.exports = PartnerType;
