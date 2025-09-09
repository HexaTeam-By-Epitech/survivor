const prisma = require('@config/prisma');

class SocialMedia {
    static countAll() {
        return prisma.socialMedias.count();
    }

    static getAllPaginated({ skip, take }) {
        return prisma.socialMedias.findMany({
            skip,
            take,
            orderBy: {
                id: 'asc'
            }
        });
    }

    static async getById(id) {
        return prisma.socialMedias.findUnique({
            where: { id }
        });
    }

    static async create(data) {
        return prisma.socialMedias.create({
            data
        });
    }

    static async update(id, data) {
        return prisma.socialMedias.update({
            where: { id },
            data
        });
    }

    static async delete(id) {
        return prisma.socialMedias.delete({
            where: { id }
        });
    }
}

module.exports = SocialMedia;
