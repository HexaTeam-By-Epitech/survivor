const prisma = require("@config/prisma");

class Project {
    async create({ data }) {
        return await prisma.projects.create({
            data: data,
            include: { Startups: true }
        });
    }

    async findById(id) {
        return await prisma.projects.findUnique({
            where: { id },
            include: { Startups: true }
        });
    }

    async findAll() {
        return await prisma.projects.findMany({
            include: { Startups: true }
        });
    }

    async update(id, data) {
        return await prisma.projects.update({
            where: { id },
            data,
            include: { Startups: true }
        });
    }

    async delete(id) {
        return await prisma.projects.delete({
            where: { id }
        });
    }

    async findByStartupId(startupId) {
        return await prisma.projects.findMany({
            where: { startup_id: startupId },
            include: { Startups: true }
        });
    }

    async findByName(name) {
        return await prisma.projects.findMany({
            where: { name: { contains: name, mode: 'insensitive' } },
            include: { Startups: true }
        });
    }
}

module.exports = Project;
