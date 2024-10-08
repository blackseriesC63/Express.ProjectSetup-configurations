import { AppDataSource } from "../data-source";
import { Blog } from "../entities/blog.entity";
import { User } from "../entities/user.entity";

export class BlogService {
  private blogRepository = AppDataSource.getRepository(Blog);
  private userRepository = AppDataSource.getRepository(User);

  async createBlog(
    title: string,
    content: string,
    authorId: number
  ): Promise<Blog> {
    const blog = new Blog();
    blog.title = title;
    blog.content = content;
    blog.authorId = authorId; // Assign the authorId to the blog

    return await this.blogRepository.save(blog);
  }

  async getAllBlogs(page: number, limit: number): Promise<Blog[]> {
    const [results] = await this.blogRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });
    return results;
  }

  async getBlogById(id: number): Promise<Blog | null> {
    return await this.blogRepository.findOne({ where: { id } });
  }

  async updateBlog(
    id: number,
    title: string,
    content: string
  ): Promise<Blog | null> {
    const blog = await this.getBlogById(id);
    if (!blog) return null;

    blog.title = title;
    blog.content = content;

    return await this.blogRepository.save(blog);
  }

  async deleteBlog(id: number): Promise<void> {
    await this.blogRepository.delete(id);
  }
}
