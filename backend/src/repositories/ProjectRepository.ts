import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Project } from '../entities/Project';

export class ProjectRepository {
  private repository: Repository<Project>;

  constructor() {
    this.repository = AppDataSource.getRepository(Project);
  }

  async create(projectData: Partial<Project>): Promise<Project> {
    const project = this.repository.create(projectData);
    return await this.repository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return await this.repository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findPublic(): Promise<Project[]> {
    return await this.repository.find({
      where: { isPublic: true },
      order: { createdAt: 'DESC' }
    });
  }

  async findById(id: number): Promise<Project | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByCategory(category: string): Promise<Project[]> {
    return await this.repository.find({
      where: { category, isPublic: true },
      order: { createdAt: 'DESC' }
    });
  }

  async findByStatus(status: string): Promise<Project[]> {
    return await this.repository.find({
      where: { status },
      order: { createdAt: 'DESC' }
    });
  }

  async update(id: number, updateData: Partial<Project>): Promise<Project | null> {
    await this.repository.update(id, updateData);
    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async search(searchTerm: string): Promise<Project[]> {
    return await this.repository
      .createQueryBuilder('project')
      .where('project.title LIKE :search OR project.description LIKE :search OR project.tags LIKE :search', 
        { search: `%${searchTerm}%` })
      .andWhere('project.isPublic = :isPublic', { isPublic: true })
      .orderBy('project.createdAt', 'DESC')
      .getMany();
  }
}
