class UserEntity {
    constructor({ id, email, name, password, created_at, updated_at }) {
        if (!email) throw new Error("Email is required");
        if (!name) throw new Error("Name is required");
        if (!password) throw new Error("Password is required");

        this.id = id;
        this.email = email;
        this.name = name;
        this.password = password;
        this.created_at = created_at || new Date();
        this.updated_at = updated_at || new Date();
    }

    toObject() {
        return {
            id: this.id,
            email: this.email,
            name: this.name,
            password: this.password,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }

    changePassword(currentPassword, newPassword, verifyFn) {
        if (!verifyFn(currentPassword, this.password)) {
            throw new Error("Current password is incorrect");
        }
        if (currentPassword === newPassword) {
            throw new Error("New password must be different");
        }
        this.password = newPassword;
    }
}

module.exports = UserEntity;
