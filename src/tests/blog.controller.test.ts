// tests/blog.controller.test.ts
import request from "supertest";
import app from "../app"; // Adjust the import according to your directory structure
import { AppDataSource } from "../data-source"; // Adjust the import if necessary
import { User } from "../entities/user.entity"; // Make sure to import your User entity

let token: string;
let userId: number;
let blogId: number;

beforeAll(async () => {
  await AppDataSource.initialize();

  // Register a test user
  const userRes = await request(app).post("/auth/signup").send({
    username: "testuser",
    email: "testuser@example.com",
    password: "password123",
  });

  userId = userRes.body.userId; // Store userId for later use

  // Login to get token
  const loginRes = await request(app).post("/auth/login").send({
    email: "testuser@example.com",
    password: "password123",
  });

  token = loginRes.body.token; 
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe("Blog Post Management", () => {
  it("should create a new blog post", async () => {
    const res = await request(app)
      .post("/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Blog",
        content: "This is a test blog post.",
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Blog created");
    blogId = res.body.blogId; // Store blogId for later use
  });

  it("should get all blog posts", async () => {
    const res = await request(app).get("/blogs");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get blog post by ID", async () => {
    const res = await request(app).get(`/blogs/${blogId}`);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Test Blog");
  });

  it("should update the blog post", async () => {
    const res = await request(app)
      .put(`/blogs/${blogId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Blog",
        content: "This is an updated test blog post.",
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Blog updated");
  });

  it("should delete the blog post", async () => {
    const res = await request(app)
      .delete(`/blogs/${blogId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Blog deleted");
  });
});
