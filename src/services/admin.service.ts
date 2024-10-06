import { AppDataSource } from "../data-source";
import { Admin } from "../entities/admin.entity";

export class AdminService {
  private adminRepository = AppDataSource.getRepository(Admin);

  //   async createAdmin(
  //     username: string,
  //     email: string,
  //     password: string
  //   ): Promise<Admin> {
  //     const admin = new Admin();
  //     admin.username = username;
  //     admin.email = email;
  //     admin.password = password;

  //     await admin.hashPassword();
  //     return await this.adminRepository.save(admin);
  //   }

  // crete admin
  async createAdmin(
    username: string,
    email: string,
    password: string
  ): Promise<Admin> {
    const admin = new Admin();
    admin.username = username;
    admin.email = email;
    admin.password = password;

    await admin.hashPassword();
    return await this.adminRepository.save(admin);
  }

  async findAdminById(id: number): Promise<Admin | null> {
    return await this.adminRepository.findOne({ where: { id } });
  }

  async findAdminByEmail(email: string): Promise<Admin | null> {
    return await this.adminRepository.findOne({ where: { email } });
  }

  async findAllAdmins(): Promise<Admin[]> {
    return await this.adminRepository.find();
  }

  async updateAdmin(
    id: number,
    username: string,
    email: string,
    password?: string
  ): Promise<Admin | null> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) return null;

    admin.username = username;
    admin.email = email;
    if (password) {
      admin.password = password;
      await admin.hashPassword();
    }

    return await this.adminRepository.save(admin);
  }

  async deleteAdmin(id: number): Promise<void> {
    await this.adminRepository.delete(id);
  }
}
