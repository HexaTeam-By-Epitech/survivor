const prisma = require('@config/prisma');

class Sector {
    static countAll() {
        return prisma.eventsCategories.count();
    }

    static getAllPaginated({ skip, take }) {
        return prisma.eventsCategories.findMany({
            skip,
            take,
            orderBy: {
                created_at: 'asc'
            }
        });
    }

    static async getById(id) {
        return prisma.eventsCategories.findUnique({
            where: { id }
        });
    }

    static async getByName(name) {
        return prisma.eventsCategories.findUnique({
            where: { name }
        });
    }

    static async create(data) {
        return prisma.eventsCategories.create({
            data
        });
    }

    static async update(id, data) {
        return prisma.eventsCategories.update({
            where: { id },
            data
        });
    }

    static async delete(id) {
        return prisma.eventsCategories.delete({
            where: { id }
        });
    }
}

module.exports = Sector;
