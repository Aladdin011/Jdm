import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Contact } from '../entities/Contact';

export class ContactRepository {
  private repository: Repository<Contact>;

  constructor() {
    this.repository = AppDataSource.getRepository(Contact);
  }

  async create(contactData: Partial<Contact>): Promise<Contact> {
    const contact = this.repository.create(contactData);
    return await this.repository.save(contact);
  }

  async findAll(): Promise<Contact[]> {
    return await this.repository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findById(id: number): Promise<Contact | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async updateStatus(id: number, status: string): Promise<Contact | null> {
    await this.repository.update(id, { status });
    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== null && result.affected > 0;
  }

  async findByEmail(email: string): Promise<Contact[]> {
    return await this.repository.find({
      where: { email },
      order: { createdAt: 'DESC' }
    });
  }

  async findByStatus(status: string): Promise<Contact[]> {
    return await this.repository.find({
      where: { status },
      order: { createdAt: 'DESC' }
    });
  }
}
