const prisma = require('@config/prisma');

class ProjectRepository {
    static countAll() {
        return prisma.projects.count();
    }

    static getAllPaginated({ skip, take }) {
        return prisma.projects.findMany({
            skip,
            take,
            include: {
                Startups: true
            },
            orderBy: {
                created_at: 'asc'
            }
        });
    }

    static async getById(id) {
        return prisma.projects.findUnique({
            where: { id },
            include: {
                Startups: true
            }
        });
    }

    static async create(data) {
        return prisma.projects.create({
            data,
            include: {
                Startups: true
            }
        });
    }

    static async update(id, data) {
        return prisma.projects.update({
            where: { id },
            data,
            include: {
                Startups: true
            }
        });
    }

    static async delete(id) {
        return prisma.projects.delete({
            where: { id }
        });
    }

    static async findByStartupId(startupId) {
        return prisma.projects.findMany({
            where: { startup_id: startupId },
            include: { Startups: true }
        });
    }

    static async findByName(name) {
        return prisma.projects.findMany({
            where: { name: { contains: name, mode: 'insensitive' } },
            include: { Startups: true }
        });
    }
}

module.exports = ProjectRepository;
