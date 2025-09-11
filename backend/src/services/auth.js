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
        const allowedRoles = ['admin', 'user', 'investor', 'startup'];
        if (!allowedRoles.includes(role)) throw new Error('Invalid role');

        const existing = await AccountRepository.findByEmail(email);
        if (existing) throw new Error('Email already in use');

        const hashed = await AuthRepository.hashPassword(password, config.security.bcryptRounds);
        const account = await AccountRepository.create({ name, email, password: hashed });

        let typeId;

        if (role === 'founder' || role === 'investor') {
            const user = await UserRepository.create({ account_id: account.id });

            if (role === 'founder') {
                const founder = await FounderRepository.create({ user_id: user.id });
                typeId = founder.id;
            } else if (role === 'investor') {
                const investor = await InvestorRepository.create({ user_id: user.id });
                typeId = investor.id;
            } else {
                typeId = user.id;
            }

        } else if (role === 'startup') {
            const company = await CompanyRepository.create({ account_id: account.id, name });
            const startup = await StartupRepository.create({ company_id: company.id });
            typeId = startup.id;
        }

        const payload = {
            accountId: account.id,
            role,
            typeId
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
}

module.exports = Auth;
