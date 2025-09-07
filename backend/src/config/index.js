module.exports = {
    // Configuration de l'application
    app: {
        name: 'JEB API',
        version: '1.0.0',
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development',
        host: process.env.HOST || 'localhost'
    },

    // Configuration JWT
    jwt: {
        secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
        expiresIn: '24h',
        issuer: 'jeb-api',
        audience: 'jeb'
    },

    // Configuration de sécurité
    security: {
        bcryptRounds: 12,
        rateLimitWindow: 15 * 60 * 1000, // 15 minutes
        rateLimitMax: 100, // 100 requêtes par fenêtre
        corsOrigin: process.env.CORS_ORIGIN || '*'
    },

    // Configuration des logs
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        format: process.env.NODE_ENV === 'production' ? 'json' : 'dev'
    },

    // Configuration de pagination
    pagination: {
        defaultLimit: 10,
        maxLimit: 100
    }
};
