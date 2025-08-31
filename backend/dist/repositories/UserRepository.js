"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_1 = require("../config/database");
const User_1 = require("../entities/User");
class UserRepository {
    constructor() {
        this.repository = database_1.AppDataSource.getRepository(User_1.User);
    }
    async create(userData) {
        const user = this.repository.create(userData);
        return await this.repository.save(user);
    }
    async findAll() {
        return await this.repository.find({
            select: ['id', 'firstName', 'lastName', 'email', 'phone', 'location', 'company', 'role', 'isActive', 'lastLogin', 'createdAt'],
            order: { createdAt: 'DESC' }
        });
    }
    async findById(id) {
        return await this.repository.findOne({
            where: { id },
            select: ['id', 'firstName', 'lastName', 'email', 'phone', 'location', 'company', 'role', 'isActive', 'lastLogin', 'createdAt']
        });
    }
    async findByEmail(email) {
        return await this.repository.findOne({ where: { email } });
    }
    async updateLastLogin(id) {
        await this.repository.update(id, { lastLogin: new Date() });
    }
    async updatePassword(id, hashedPassword) {
        const result = await this.repository.update(id, { password: hashedPassword });
        return (result.affected ?? 0) > 0;
    }
    async deactivateUser(id) {
        const result = await this.repository.update(id, { isActive: false });
        return (result.affected ?? 0) > 0;
    }
    async activateUser(id) {
        const result = await this.repository.update(id, { isActive: true });
        return (result.affected ?? 0) > 0;
    }
    async delete(id) {
        const result = await this.repository.delete(id);
        return (result.affected ?? 0) > 0;
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map