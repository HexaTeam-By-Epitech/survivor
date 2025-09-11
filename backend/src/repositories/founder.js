const prisma = require('@config/prisma');

class FounderRepository {
    static async create({ user_id }) {
        return prisma.founders.create({
            data: {
                user_id
            }
        });
    }

    static async getByUserId(user_id) {
        return prisma.founders.findUnique({
            where: { user_id }
        });
    }
}

module.exports = FounderRepository;
