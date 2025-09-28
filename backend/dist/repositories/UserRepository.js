"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserRepository {
    constructor(repository) {
        this.repository = repository;
    }
    async findAll(options) {
        const { limit = 10, offset = 0, order = { created_at: 'DESC' } } = options || {};
        return this.repository.find({
            take: limit,
            skip: offset,
            order,
            select: ['id', 'email', 'role', 'department', 'active', 'created_at'] // Changed from isActive to active, createdAt to created_at
        });
    }
    async findActive(options) {
        const { limit = 10, offset = 0, order = { created_at: 'DESC' } } = options || {};
        return this.repository.find({
            where: { active: true }, // Changed from isActive to active
            take: limit,
            skip: offset,
            order,
            select: ['id', 'email', 'role', 'department', 'active', 'created_at'] // Changed from isActive to active, createdAt to created_at
        });
    }
    async findById(id) {
        return this.repository.findOne({ where: { id } });
    }
    async findByEmail(email) {
        return this.repository.findOne({ where: { email } });
    }
    async activate(id) {
        await this.repository.update(id, { active: true }); // Changed from isActive to active
        return this.findById(id);
    }
    async deactivate(id) {
        await this.repository.update(id, { active: false }); // Changed from isActive to active
        return this.findById(id);
    }
    async create(data) {
        const user = this.repository.create(data);
        return this.repository.save(user);
    }
    async update(id, data) {
        await this.repository.update(id, data);
        return this.findById(id);
    }
    async delete(id) {
        return this.repository.delete(id);
    }
}
exports.default = UserRepository;
//# sourceMappingURL=UserRepository.js.map