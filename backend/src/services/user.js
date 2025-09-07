const bcrypt = require('bcrypt');
const config = require('@config/index');
const customErrors = require('@errors/customErrors');
const UserRepository = require('@repositories/user');
const AccountRepository = require('@repositories/account');
const AuthRepository = require('@repositories/auth');
const UserEntity = require('@entities/User');

class User {
    static async getAllUsers({ page, limit }) {
        const safeLimit = Math.min(limit, config.pagination.maxLimit);
        const offset = (page - 1) * safeLimit;

        const total = await UserRepository.countAll();
        const users = await UserRepository.getAllPaginated({ skip: offset, take: safeLimit });

        return { users, total, page, limit: safeLimit };
    }

    static async getUserById(uid) {
        const userData = await UserRepository.getById(uid);
        if (!userData) {
            throw new customErrors.UserNotFoundError('User not found');
        }

        return new UserEntity({
            id: userData.id,
            email: userData.account?.email,
            name: userData.account?.name,
            password: userData.account?.password,
            created_at: userData.account?.created_at,
            updated_at: userData.account?.updated_at
        });
    }

    static async createUser(data) {
        const existing = await AccountRepository.findByEmail(data.email);
        if (existing) {
            throw new customErrors.ConflictError('Email already in use');
        }

        const hashedPassword = await AuthRepository.hashPassword(data.password, config.security.bcryptRounds);

        const entity = new UserEntity({
            email: data.email,
            name: data.name,
            password: hashedPassword
        });

        const account = await AccountRepository.create({
            email: entity.email,
            password: entity.password,
            name: entity.name
        });

        const user = await UserRepository.create({
            account_id: account.id
        });

        return {
            id: user.id,
            account: {
                id: account.id,
                email: account.email,
                name: account.name,
                image_path: account.image_path,
                created_at: account.created_at
            }
        };
    }

    static async updateUser(uid, data) {
        const user = await UserRepository.getById(uid);
        if (!user) {
            throw new customErrors.UserNotFoundError('User not found');
        }

        const updateFields = {};

        if (data.name) updateFields.name = data.name;
        if (data.email) {
            const existing = await AccountRepository.findByEmail(data.email);
            if (existing && existing.id !== user.account.id) {
                throw new customErrors.ConflictError('Email already in use');
            }
            updateFields.email = data.email;
        }

        if (data.password) {
            updateFields.password = await bcrypt.hash(data.password, config.security.bcryptRounds);
        }

        const updated = await AccountRepository.update(user.account_id, updateFields);

        return {
            id: user.id,
            account: {
                id: updated.id,
                email: updated.email,
                name: updated.name,
                image_path: updated.image_path,
                last_updated_at: updated.last_updated_at
            }
        };
    }

    static async deleteUser(uid) {
        const user = await UserRepository.getById(uid);
        if (!user) {
            throw new customErrors.UserNotFoundError('User not found');
        }

        await UserRepository.delete(uid);
    }
}

module.exports = User;
