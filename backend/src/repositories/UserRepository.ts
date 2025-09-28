import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { User } from '../entities/User';

class UserRepository {
  private repository: Repository<User>;

  constructor(repository: Repository<User>) {
    this.repository = repository;
  }

  async findAll(options?: {
    limit?: number;
    offset?: number;
    order?: FindOptionsOrder<User>;
  }) {
    const { limit = 10, offset = 0, order = { created_at: 'DESC' } } = options || {};

    return this.repository.find({
      take: limit,
      skip: offset,
      order,
      select: ['id', 'email', 'role', 'department', 'active', 'created_at'] // Changed from isActive to active, createdAt to created_at
    });
  }

  async findActive(options?: {
    limit?: number;
    offset?: number;
    order?: FindOptionsOrder<User>;
  }) {
    const { limit = 10, offset = 0, order = { created_at: 'DESC' } } = options || {};

    return this.repository.find({
      where: { active: true }, // Changed from isActive to active
      take: limit,
      skip: offset,
      order,
      select: ['id', 'email', 'role', 'department', 'active', 'created_at'] // Changed from isActive to active, createdAt to created_at
    });
  }

  async findById(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.repository.findOne({ where: { email } });
  }

  async activate(id: number) {
    await this.repository.update(id, { active: true }); // Changed from isActive to active
    return this.findById(id);
  }

  async deactivate(id: number) {
    await this.repository.update(id, { active: false }); // Changed from isActive to active
    return this.findById(id);
  }

  async create(data: Partial<User>) {
    const user = this.repository.create(data);
    return this.repository.save(user);
  }

  async update(id: number, data: Partial<User>) {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number) {
    return this.repository.delete(id);
  }
}

export default UserRepository;