const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("@config");
const AuthRepository = require("@repositories/auth");
const AccountRepository = require("@repositories/account");
const CompanyRepository = require("@repositories/company");
const StartupRepository = require("@repositories/startup");

class Auth {
    static async signup({ name, email, password }) {
        const existing = await AccountRepository.findByEmail(email);
        if (existing) throw new Error('Email already in use');

        const hashed = await AuthRepository.hashPassword(password, config.security.bcryptRounds);
        const account = await AccountRepository.create({ name, email, password: hashed });

        // default: create as startup
        const company = await CompanyRepository.create({ account_id: account.id, name });
        const startup = await StartupRepository.create({ company_id: company.id });

        const payload = {
            accountId: account.id,
            role: 'startup',
            typeId: startup.id
        };

        return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
    }

    static async login(email, password) {
        const account = await AccountRepository.findByEmail(email);
        if (!account) throw new Error('Invalid credentials');

        const valid = await bcrypt.compare(password, account.password);
        if (!valid) throw new Error('Invalid credentials');

        const roleData = await AuthRepository.getRoleByAccountId(account.id);

        const payload = {
            accountId: account.id,
            role: roleData.role,
            typeId: roleData.id
        };

        return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
    }
}

module.exports = Auth;
