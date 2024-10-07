import { AppDataSource } from "../../data-source";
import { User } from "../../entities/user.entity";
import bcrypt from "bcrypt";

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async createUser(
    username: string,
    email: string,
    password: string
  ): Promise<User> {
    const user = new User();
    user.username = username;
    user.email = email;
    user.password = password;

    await user.hashPassword();
    return await this.userRepository.save(user);
  }

  //get user by id
  async findUserById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async updateUser(
    id: number,
    username: string,
    email: string,
    password?: string
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    user.username = username;
    user.email = email;
    if (password) {
      user.password = password;
      await user.hashPassword();
    }

    return await this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async comparePassword(user: User, plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, user.password);
  }
}
