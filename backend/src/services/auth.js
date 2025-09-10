const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("@config");
const AuthRepository = require("@repositories/auth");
const AccountRepository = require("@repositories/account");

class Auth {
    static async signup({ name, email, password }) {
        const existing = await AccountRepository.findByEmail(email);
        if (existing) throw new Error('Email already in use');

        const hashed = await AuthRepository.hashPassword(password, config.security.bcryptRounds);
        const account = await AccountRepository.create({ name, email, password: hashed });

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
}

module.exports = Auth;
