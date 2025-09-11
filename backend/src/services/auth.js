const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("@config");
const AuthRepository = require("@repositories/auth");
const AccountRepository = require("@repositories/account");
const UserRepository = require("@repositories/user");
const FounderRepository = require("@repositories/founder");
const InvestorRepository = require("@repositories/investor");
const CompanyRepository = require("@repositories/company");
const StartupRepository = require("@repositories/startup");

class Auth {
    static async signup({ name, email, password, role }) {
        const allowedRoles = ['founder', 'investor', 'startup'];
        if (!allowedRoles.includes(role)) throw new Error('Invalid role');

        const existing = await AccountRepository.findByEmail(email);
        if (existing) throw new Error('Email already in use');

        const hashed = await AuthRepository.hashPassword(password, config.security.bcryptRounds);
        const account = await AccountRepository.create({ name, email, password: hashed });

        if (role === 'founder' || role === 'investor') {
            const user = await UserRepository.create({ account_id: account.id });

            if (role === 'founder') {
                await FounderRepository.create({ user_id: user.id });
            } else if (role === 'investor') {
                await InvestorRepository.create({ user_id: user.id });
            }

        } else if (role === 'startup') {
            const company = await CompanyRepository.create({ account_id: account.id, name });
            await StartupRepository.create({ company_id: company.id });
        }

        const payload = {
            accountId: account.id
        };

        return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
    }

    static async login(email, password) {
        const account = await AccountRepository.findByEmail(email);
        if (!account) throw new Error('Invalid credentials');

        const valid = await bcrypt.compare(password, account.password);
        if (!valid) throw new Error('Invalid credentials');

        const payload = {
            accountId: account.id
        };

        return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
    }

    static async getRole(accountId) {
        const account = await AccountRepository.getById(accountId);
        if (!account) throw new Error('Account not found');

        const user = await UserRepository.findByAccountId(accountId);
        if (user) {
            const founder = await FounderRepository.getByUserId(user.id);
            if (founder) return 'founder';

            const investor = await InvestorRepository.getByUserId(user.id);
            if (investor) return 'investor';
        }

        const company = await CompanyRepository.findByAccountId(accountId);
        if (company) {
            const startup = await StartupRepository.findByCompanyId(company.id);
            if (startup) return 'startup';
        }

        return 'unknown';
    }
}

module.exports = Auth;
