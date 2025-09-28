import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { Project } from '../entities/Project';

class ProjectRepository {
  private repository: Repository<Project>;

  constructor(repository: Repository<Project>) {
    this.repository = repository;
  }

  async findAll(options?: {
    limit?: number;
    offset?: number;
    order?: FindOptionsOrder<Project>;
  }) {
    const { limit = 10, offset = 0, order = { createdAt: 'DESC' } } = options || {};

    return this.repository.find({
      take: limit,
      skip: offset,
      order,
    });
  }

  async findPublic(options?: {
    limit?: number;
    offset?: number;
    order?: FindOptionsOrder<Project>;
  }) {
    const { limit = 10, offset = 0, order = { createdAt: 'DESC' } } = options || {};

    return this.repository.find({
      where: { public: true }, // Changed from isPublic to public
      take: limit,
      skip: offset,
      order,
    });
  }

  async findById(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<Project>) {
    const project = this.repository.create(data);
    return this.repository.save(project);
  }

  async update(id: number, data: Partial<Project>) {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number) {
    return this.repository.delete(id);
  }
}

export default ProjectRepository;