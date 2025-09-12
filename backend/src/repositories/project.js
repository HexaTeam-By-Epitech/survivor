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
                Startups: true,
                ProjectStatus: true,
                Sectors: true
            },
            orderBy: {
                id: 'asc'
            }
        });
    }

    static async getById(id) {
        return prisma.projects.findUnique({
            where: { id },
            include: {
                Startups: {
                    include: {
                        Companies: true
                    }
                },
                ProjectStatus: true,
                Sectors: true
            }
        });
    }

    static async create(data) {
        return prisma.projects.create({
            data,
            include: {
                Startups: {
                    include: {
                        Companies: true
                    }
                },
                ProjectStatus: true,
                Sectors: true
            }
        });
    }

    static async update(id, data) {
        return prisma.projects.update({
            where: { id },
            data,
            include: {
                Startups: {
                    include: {
                        Companies: true
                    }
                },
                ProjectStatus: true,
                Sectors: true
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
            include: {
                Startups: {
                    include: {
                        Companies: true
                    }
                },
                ProjectStatus: true,
                Sectors: true
            }
        });
    }

    static async findByName(name) {
        return prisma.projects.findMany({
            where: { name: { contains: name, mode: 'insensitive' } },
            include: {
                Startups: {
                    include: {
                        Companies: true
                    }
                },
                ProjectStatus: true,
                Sectors: true
            }
        });
    }
}

module.exports = ProjectRepository;
