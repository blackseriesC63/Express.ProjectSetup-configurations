// tests/user.controller.test.ts
import request from "supertest";
import app from "../app"; // Adjust the import according to your directory structure
import { AppDataSource } from "../data-source"; // Adjust the import if necessary
import { User } from "../entities/user.entity";

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe("Authentication Logic", () => {
  let userId: number;

  it("should register a user", async () => {
    const res = await request(app).post("/auth/signup").send({
      username: "testuser",
      email: "testuser@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User created");
    userId = res.body.userId; // Store the userId for later use
  });

  it("should log in the user", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "testuser@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.token).toBeDefined();
  });

  it("should fail to log in with invalid credentials", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "testuser@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("should fetch user by ID", async () => {
    const res = await request(app).get(`/auth/${userId}`);

    expect(res.status).toBe(200);
    expect(res.body.username).toBe("testuser");
    expect(res.body.email).toBe("testuser@example.com");
  });

  it("should delete the user", async () => {
    const res = await request(app).delete(`/auth/${userId}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User deleted");
  });
});
