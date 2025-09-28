"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProjectRepository {
    constructor(repository) {
        this.repository = repository;
    }
    async findAll(options) {
        const { limit = 10, offset = 0, order = { createdAt: 'DESC' } } = options || {};
        return this.repository.find({
            take: limit,
            skip: offset,
            order,
        });
    }
    async findPublic(options) {
        const { limit = 10, offset = 0, order = { createdAt: 'DESC' } } = options || {};
        return this.repository.find({
            where: { public: true }, // Changed from isPublic to public
            take: limit,
            skip: offset,
            order,
        });
    }
    async findById(id) {
        return this.repository.findOne({ where: { id } });
    }
    async create(data) {
        const project = this.repository.create(data);
        return this.repository.save(project);
    }
    async update(id, data) {
        await this.repository.update(id, data);
        return this.findById(id);
    }
    async delete(id) {
        return this.repository.delete(id);
    }
}
exports.default = ProjectRepository;
//# sourceMappingURL=ProjectRepository.js.map