"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRepository = void 0;
const database_1 = require("../config/database");
const Project_1 = require("../entities/Project");
class ProjectRepository {
    constructor() {
        this.repository = database_1.AppDataSource.getRepository(Project_1.Project);
    }
    async create(projectData) {
        const project = this.repository.create(projectData);
        return await this.repository.save(project);
    }
    async findAll() {
        return await this.repository.find({
            order: { createdAt: 'DESC' }
        });
    }
    async findPublic() {
        return await this.repository.find({
            where: { isPublic: true },
            order: { createdAt: 'DESC' }
        });
    }
    async findById(id) {
        return await this.repository.findOne({ where: { id } });
    }
    async findByCategory(category) {
        return await this.repository.find({
            where: { category, isPublic: true },
            order: { createdAt: 'DESC' }
        });
    }
    async findByStatus(status) {
        return await this.repository.find({
            where: { status },
            order: { createdAt: 'DESC' }
        });
    }
    async update(id, updateData) {
        await this.repository.update(id, updateData);
        return await this.findById(id);
    }
    async delete(id) {
        const result = await this.repository.delete(id);
        return (result.affected ?? 0) > 0;
    }
    async search(searchTerm) {
        return await this.repository
            .createQueryBuilder('project')
            .where('project.title LIKE :search OR project.description LIKE :search OR project.tags LIKE :search', { search: `%${searchTerm}%` })
            .andWhere('project.isPublic = :isPublic', { isPublic: true })
            .orderBy('project.createdAt', 'DESC')
            .getMany();
    }
}
exports.ProjectRepository = ProjectRepository;
//# sourceMappingURL=ProjectRepository.js.map