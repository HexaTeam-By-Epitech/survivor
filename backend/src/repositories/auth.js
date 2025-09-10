const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
}

module.exports = AuthRepository;
