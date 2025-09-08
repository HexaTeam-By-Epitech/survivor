const prisma = require('@config/prisma');

class User {
    static countAll() {
        return prisma.users.count();
    }

    static getAllPaginated({ skip, take }) {
        return prisma.users.findMany({
            skip,
            take,
            include: {
                account: true
            },
            orderBy: {
                account: {
                    created_at: 'asc'
                }
            }
        });
    }

    static async getById(id) {
        return prisma.users.findUnique({
            where: { id },
            include: {
                account: true
            }
        });
    }

    static async create(data) {
        return prisma.users.create({
            data: {
                account_id: data.account_id
            },
            include: {
                account: true
            }
        });
    }

    static async update(id, data) {
        return prisma.users.update({
            where: { id },
            data,
            include: {
                account: true
            }
        });
    }

    static async delete(id) {
        return prisma.users.delete({
            where: { id }
        });
    }
}

module.exports = User;
