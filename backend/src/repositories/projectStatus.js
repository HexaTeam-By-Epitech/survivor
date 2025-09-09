const prisma = require('@config/prisma');

class ProjectStatus {
    static countAll() {
        return prisma.projectStatus.count();
    }

    static getAllPaginated({ skip, take }) {
        return prisma.projectStatus.findMany({
            skip,
            take,
            orderBy: {
                id: 'asc'
            }
        });
    }

    static async getById(id) {
        return prisma.projectStatus.findUnique({
            where: { id }
        });
    }

    static async getByName(name) {
        return prisma.projectStatus.findUnique({
            where: { name }
        });
    }

    static async create(data) {
        return prisma.projectStatus.create({
            data
        });
    }

    static async update(id, data) {
        return prisma.projectStatus.update({
            where: { id },
            data
        });
    }

    static async delete(id) {
        return prisma.projectStatus.delete({
            where: { id }
        });
    }
}

module.exports = ProjectStatus;
