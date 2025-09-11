const prisma = require('@config/prisma');

class Event {
    static countAll() {
        return prisma.events.count();
    }

    static getAllPaginated({ skip, take }) {
        return prisma.events.findMany({
            skip,
            take,
            orderBy: {
                id: 'desc'
            }
        });
    }

    static async getById(id) {
        return prisma.events.findUnique({
            where: { id }
        });
    }

    static async create(data) {
        return prisma.events.create({
            data
        });
    }

    static async update(id, data) {
        return prisma.events.update({
            where: { id },
            data
        });
    }

    static async delete(id) {
        return prisma.events.delete({
            where: { id }
        });
    }
}

module.exports = Event;
