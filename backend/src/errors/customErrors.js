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

// --- EventCategory errors ---

class EventCategoryNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'EventCategoryNotFoundError';
    }
}

// --- PartnerType errors ---

class PartnerTypeNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PartnerTypeNotFoundError';
    }
}

// --- SocialMedia errors ---

class SocialMediaNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'SocialMediaNotFoundError';
    }
}

// --- Investment focus errors ---

class InvestmentFocusNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvestmentFocusNotFoundError';
    }
}

// --- Legal status errors ---

class LegalStatusNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'LegalStatusNotFoundError';
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
    EventCategoryNotFoundError,
    PartnerTypeNotFoundError,
    SocialMediaNotFoundError,
    InvestmentFocusNotFoundError,
    LegalStatusNotFoundError,
    ConflictError
}
