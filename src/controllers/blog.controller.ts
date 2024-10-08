import { Router } from "express";
import { BlogService } from "../services/blog.service";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = Router();
const blogService = new BlogService();

// Create Blog
router.post("/", authenticateJWT, async (req, res) => {
  const { title, content } = req.body;
  const authorId = (req as any).user.userId;

  try {
    const newBlog = await blogService.createBlog(title, content, authorId);
    res.status(201).json({ message: "Blog created", blogId: newBlog.id });
  } catch (error) {
    res.status(500).json({ message: "Error creating blog", error });
  }
});

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const blogs = await blogService.getAllBlogs(page, limit);
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error });
  }
});

// Get Blog by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await blogService.getBlogById(parseInt(id));
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog", error });
  }
});

// Update
router.put("/:id", authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const user = (req as any).user;
  const authorId = user.userId;

  try {
    const blog = await blogService.getBlogById(parseInt(id));
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.authorId !== authorId && !user.isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not allowed to edit this blog" });
    }

    const updatedBlog = await blogService.updateBlog(
      parseInt(id),
      title,
      content
    );
    res.json({ message: "Blog updated", blog: updatedBlog });
  } catch (error) {
    res.status(500).json({ message: "Error updating blog", error });
  }
});

// Delete Blog
router.delete("/:id", authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const user = (req as any).user;
  const authorId = user.userId;

  try {
    const blog = await blogService.getBlogById(parseInt(id));
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.authorId !== authorId && !user.isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this blog" });
    }

    await blogService.deleteBlog(parseInt(id));
    res.json({ message: "Blog deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog", error });
  }
});

export default router;
