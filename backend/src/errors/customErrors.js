// --- Acount errors ---

class AccountNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AccountNotFoundError';
    }
}

// --- User errors ---

class UserNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UserNotFoundError';
    }
}

// --- Company errors ---

class CompanyNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CompanyNotFoundError';
    }
}

// --- Startup errors ---

class StartupNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'StartupNotFoundError';
    }
}

// --- conflict errors ---

class ConflictError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConflictError';
    }
}

module.exports = {
    AccountNotFoundError,
    UserNotFoundError,
    CompanyNotFoundError,
    StartupNotFoundError,
    ConflictError
}
