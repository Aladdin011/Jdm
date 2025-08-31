"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactRepository = void 0;
const database_1 = require("../config/database");
const Contact_1 = require("../entities/Contact");
class ContactRepository {
    constructor() {
        this.repository = database_1.AppDataSource.getRepository(Contact_1.Contact);
    }
    async create(contactData) {
        const contact = this.repository.create(contactData);
        return await this.repository.save(contact);
    }
    async findAll() {
        return await this.repository.find({
            order: { createdAt: 'DESC' }
        });
    }
    async findById(id) {
        return await this.repository.findOne({ where: { id } });
    }
    async updateStatus(id, status) {
        await this.repository.update(id, { status });
        return await this.findById(id);
    }
    async delete(id) {
        const result = await this.repository.delete(id);
        return (result.affected ?? 0) > 0;
    }
    async findByEmail(email) {
        return await this.repository.find({
            where: { email },
            order: { createdAt: 'DESC' }
        });
    }
    async findByStatus(status) {
        return await this.repository.find({
            where: { status },
            order: { createdAt: 'DESC' }
        });
    }
}
exports.ContactRepository = ContactRepository;
//# sourceMappingURL=ContactRepository.js.map