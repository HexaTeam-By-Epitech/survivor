const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AccountRepository = require("@repositories/account");
const CompanyRepository = require("@repositories/company");
const StartupRepository = require("@repositories/startup");

class Auth {
    constructor() {
        this.startupRepo = new StartupRepository();
        this.jwtSecret = process.env.JWT_SECRET;
        this.tokenExpiry = "1h";
    }

    async signup({ name, email, password }) {
        const [existingAccount, existingCompany] = await Promise.all([
            AccountRepository.findByEmail(email),
            CompanyRepository.findByName(name)
        ]);

        if (existingAccount) throw new Error("Email already in use");
        if (existingCompany) throw new Error("Company name already in use");

        const hashedPassword = await bcrypt.hash(password, 10);

        const account = await AccountRepository.create({
            name,
            email,
            password: hashedPassword
        });

        const company = await CompanyRepository.create({
            account_id: account.id,
            name
        });

        const startup = await StartupRepository.create({
            company_id: company.id
        });

        const payload = { startupId: startup.id };
        return jwt.sign(payload, this.jwtSecret, { expiresIn: this.tokenExpiry });
    }

    async login(email, password) {
        const account = await AccountRepository.findByEmail(email);
        if (!account) throw new Error("Account not found");

        const valid = await bcrypt.compare(password, account.password);
        if (!valid) throw new Error("Invalid password");

        const company = await CompanyRepository.findByAccountId(account.id);
        if (!company) throw new Error("Company not found");

        const startup = await StartupRepository.findByCompanyId(company.id);
        if (!startup) throw new Error("Startup not found");

        const payload = { startupId: startup.id };
        return jwt.sign(payload, this.jwtSecret, { expiresIn: this.tokenExpiry });
    }

    generateToken(startup) {
        const payload = { startupId: startup.id };
        return jwt.sign(payload, this.jwtSecret, { expiresIn: this.tokenExpiry });
    }
}

module.exports = Auth;
