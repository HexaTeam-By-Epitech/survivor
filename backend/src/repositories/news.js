const prisma = require('@config/prisma');

class News {
    static countAll() {
        return prisma.news.count();
    }

    static getAllPaginated({ skip, take }) {
        return prisma.news.findMany({
            skip,
            take,
            include: {
                Companies: {
                    include: {
                        Accounts: true
                    }
                }
            },
            orderBy: {
                Companies: {
                    Accounts: {
                        created_at: 'asc'
                    }
                }
            }
        });
    }

    static async getById(id) {
        return prisma.news.findUnique({
            where: { id },
            include: {
                Companies: {
                    include: {
                        Accounts: true
                    }
                }
            }
        });
    }

    static async create({ company_id, title, description, location, date }) {
        return prisma.news.create({
            data: {
                company_id,
                title,
                description,
                location,
                date,
                created_at: new Date()
            }
        });
    }

    static async update(id, data) {
        return prisma.news.update({
            where: { id },
            data
        });
    }

    static async delete(id) {
        return prisma.news.delete({
            where: { id }
        });
    }
}

module.exports = News;
