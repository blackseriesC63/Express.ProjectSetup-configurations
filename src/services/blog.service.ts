import { AppDataSource } from "../data-source";
import { Blog } from "../entities/blog.entity";
import { User } from "../entities/user.entity";
import { Comment } from "../entities/comment.entity";

export class BlogService {
  private blogRepository = AppDataSource.getRepository(Blog);
  private userRepository = AppDataSource.getRepository(User);
  private commentRepository = AppDataSource.getRepository(Comment);

  async createBlog(
    title: string,
    content: string,
    authorId: number
  ): Promise<Blog> {
    const blog = new Blog();
    blog.title = title;
    blog.content = content;
    blog.authorId = authorId;

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

  // Comments:

  // Create comments for blog
  async createComment(
    blogId: number,
    userId: number,
    content: string
  ): Promise<Comment> {
    const comment = new Comment();
    comment.blogId = blogId;
    comment.userId = userId;
    comment.content = content;

    return await this.commentRepository.save(comment);
  }

  async getCommentsByBlogId(blogId: number): Promise<Comment[]> {
    return await this.commentRepository.find({ where: { blogId } });
  }

  async getCommentById(commentId: number): Promise<Comment | null> {
    return await this.commentRepository.findOne({ where: { id: commentId } });
  }

  // Get all comments of blog
  async getAllComments(): Promise<Comment[]> {
    return await this.commentRepository.find();
  }

  // Update comment
  async updateComment(
    commentId: number,
    content: string
  ): Promise<Comment | null> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    if (!comment) return null;

    comment.content = content;

    return await this.commentRepository.save(comment);
  }

  // Delete comment
  async deleteComment(commentId: number): Promise<void> {
    await this.commentRepository.delete(commentId);
  }

  async likeBlog(id: number): Promise<Blog | null> {
    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog) return null;

    blog.likes += 1;
    return await this.blogRepository.save(blog);
  }

  async unlikeBlog(id: number): Promise<Blog | null> {
    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog || blog.likes === 0) return null;

    blog.likes -= 1;
    return await this.blogRepository.save(blog);
  }
}
