// --- Account errors ---

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

// --- Project errors ---

class ProjectNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ProjectNotFoundError';
    }
}

// --- Event errors ---

class EventNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'EventNotFoundError';
    }
}

// --- News errors ---

class NewsNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NewsNotFoundError';
    }
}

// --- Sector errors ---

class SectorNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'SectorNotFoundError';
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
    ProjectNotFoundError,
    EventNotFoundError,
    NewsNotFoundError,
    SectorNotFoundError,
    ConflictError
}
