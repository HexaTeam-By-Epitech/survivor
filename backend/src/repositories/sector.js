const prisma = require('@config/prisma');

class Sector {
    static async countAll() {
        return prisma.sectors.count();
    }

    static async getAllPaginated({ skip, take }) {
        return prisma.sectors.findMany({
            skip,
            take,
            orderBy: {
                id: 'asc'
            }
        });
    }

    static async getById(id) {
        return prisma.sectors.findUnique({
            where: { id }
        });
    }

    static async getByName(name) {
        return prisma.sectors.findUnique({
            where: { name }
        });
    }

    static async create(data) {
        return prisma.sectors.create({
            data
        });
    }

    static async update(id, data) {
        return prisma.sectors.update({
            where: { id },
            data
        });
    }

    static async delete(id) {
        return prisma.sectors.delete({
            where: { id }
        });
    }
}

module.exports = Sector;
