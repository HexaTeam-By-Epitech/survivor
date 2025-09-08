const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const CompanyRepository = require('@repositories/company');
const StartupRepository = require('@repositories/startup');
const UserRepository = require('@repositories/user');
const AdminRepository = require('@repositories/admin');
const InvestorRepository = require('@repositories/investor');

class AuthRepository {
    static async hashPassword(password, saltRounds) {
        return await bcrypt.hash(password, saltRounds);
    }

    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    static generateToken(payload, jwtConfig) {
        if (!jwtConfig?.secret) {
            throw new Error('Missing JWT secret');
        }

        return jwt.sign(payload, jwtConfig.secret, {
            expiresIn: jwtConfig.expiresIn,
            issuer: jwtConfig.issuer,
            audience: jwtConfig.audience
        });
    }

    static verifyToken(token, jwtConfig) {
        if (!jwtConfig?.secret) {
            throw new Error('Missing JWT secret');
        }

        return jwt.verify(token, jwtConfig.secret, {
            issuer: jwtConfig.issuer,
            audience: jwtConfig.audience,
            ignoreExpiration: true
        });
    }

    static async getRoleByAccountId(accountId) {
        // STARTUP
        const company = await CompanyRepository.findByAccountId(accountId);
        if (company) {
            const startup = await StartupRepository.findByCompanyId(company.id);
            if (startup) return { role: 'startup', id: startup.id };
        }

        // USER
        const user = await UserRepository.findByAccountId(accountId);
        if (user) {
            const admin = await AdminRepository.getById(user.id);
            if (admin) return { role: 'admin', id: admin.id };

            const investor = await InvestorRepository.getById(user.id);
            if (investor) return { role: 'investor', id: investor.id };

            return { role: 'user', id: user.id };
        }

        throw new Error('User role not found');
    }
}

module.exports = AuthRepository;
