const prisma = require('@config/prisma');

class InvestorRepository {
    static async create({ user_id, address = null, phone_number = null, description = null, investment_focus_id = null, investor_type_id = null }) {
        return prisma.investors.create({
            data: {
                user_id,
                address,
                phone_number,
                description,
                investment_focus_id,
                investor_type_id
            }
        });
    }

    static async getById(id) {
        return prisma.investors.findUnique({
            where: { id }
        });
    }

    static async getByUserId(user_id) {
        return prisma.investors.findUnique({
            where: { user_id }
        });
    }
}

module.exports = InvestorRepository;
