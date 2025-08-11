import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.repository.create(userData);
    return await this.repository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.repository.find({
      select: ['id', 'firstName', 'lastName', 'email', 'phone', 'location', 'company', 'role', 'isActive', 'lastLogin', 'createdAt'],
      order: { createdAt: 'DESC' }
    });
  }

  async findById(id: number): Promise<User | null> {
    return await this.repository.findOne({
      where: { id },
      select: ['id', 'firstName', 'lastName', 'email', 'phone', 'location', 'company', 'role', 'isActive', 'lastLogin', 'createdAt']
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({ where: { email } });
  }

  async updateLastLogin(id: number): Promise<void> {
    await this.repository.update(id, { lastLogin: new Date() });
  }

  async updatePassword(id: number, hashedPassword: string): Promise<boolean> {
    const result = await this.repository.update(id, { password: hashedPassword });
    return result.affected !== null && result.affected > 0;
  }

  async deactivateUser(id: number): Promise<boolean> {
    const result = await this.repository.update(id, { isActive: false });
    return result.affected !== null && result.affected > 0;
  }

  async activateUser(id: number): Promise<boolean> {
    const result = await this.repository.update(id, { isActive: true });
    return result.affected !== null && result.affected > 0;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== null && result.affected > 0;
  }
}
