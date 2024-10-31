import { Router } from "express";
import { BlogService } from "../services/blog.service";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

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
    res.status(500).json({
      message: "Error creating blog",
      error: error instanceof Error ? error.message : error,
    });
  }
});

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const blogs = await blogService.getAllBlogs(page, limit);
    res.json(blogs);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching blogs",
      error: error instanceof Error ? error.message : error,
    });
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
    res.status(500).json({
      message: "Error fetching blog",
      error: error instanceof Error ? error.message : error,
    });
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
    res.status(500).json({
      message: "Error updating blog",
      error: error instanceof Error ? error.message : error,
    });
  }
});

// Delete Blog
router.delete(
  "/:id",
  authenticateJWT,
  requireRole("admin"),
  async (req, res) => {
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
      res.status(500).json({
        message: "Error deleting blog",
        error: error instanceof Error ? error.message : error,
      });
    }
  }
);

router.post("/:id/comments", authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = (req as any).user.userId;

  try {
    const blog = await blogService.getBlogById(parseInt(id));
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const newComment = await blogService.createComment(
      parseInt(id),
      userId,
      content
    );
    res
      .status(201)
      .json({ message: "Comment created", commentId: newComment.id });
  } catch (error) {
    res.status(500).json({ message: "Error creating comment", error });
  }
});

// Update Comment
router.put("/comments/:commentId", authenticateJWT, async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const user = (req as any).user;
  const userId = user.userId;

  try {
    const comment = await blogService.getCommentById(parseInt(commentId));
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId !== userId && !user.isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not allowed to edit this comment" });
    }

    const updatedComment = await blogService.updateComment(
      parseInt(commentId),
      content
    );
    res.json({ message: "Comment updated", comment: updatedComment });
  } catch (error) {
    res.status(500).json({
      message: "Error updating comment",
      error: error instanceof Error ? error.message : error,
    });
  }
});

// Delete Comment
router.delete("/comments/:commentId", authenticateJWT, async (req, res) => {
  const { commentId } = req.params;
  const user = (req as any).user;
  const userId = user.userId;

  try {
    const comment = await blogService.getCommentById(parseInt(commentId));
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.userId !== userId && !user.isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this comment" });
    }

    await blogService.deleteComment(parseInt(commentId));
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting comment",
      error: error instanceof Error ? error.message : error,
    });
  }
});

// Get All Comments
router.get("/:id/comments", requireRole("admin"), async (req, res) => {
  const { id } = req.params;

  try {
    const comments = await blogService.getCommentsByBlogId(parseInt(id));
    res.json(comments);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching comments",
      error: error instanceof Error ? error.message : error,
    });
  }
});

router.post("/:id/like", authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await blogService.likeBlog(parseInt(id));
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json({ message: "Blog liked", likes: blog.likes });
  } catch (error) {
    res.status(500).json({
      message: "Error liking blog",
      error: error instanceof Error ? error.message : error,
    });
  }
});

// Unlike a blog post
router.post("/:id/unlike", authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await blogService.unlikeBlog(parseInt(id));
    if (!blog) {
      return res
        .status(404)
        .json({ message: "Blog not found or no likes to remove" });
    }
    res.json({ message: "Blog unliked", likes: blog.likes });
  } catch (error) {
    res.status(500).json({
      message: "Error unliking blog",
      error: error instanceof Error ? error.message : error,
    });
  }
});

// Delete Comment

export default router;
