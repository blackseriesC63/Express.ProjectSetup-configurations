import { describe, it } from "node:test";
import { User } from "../entities/user.entity";
import bcrypt from "bcrypt";

describe("User Authentication", () => {
  it("should hash the password before saving", async () => {
    const user = new User();
    user.password = "plaintextpassword";
    await user.hashPassword(); // Ensure this method exists in your User entity

    const isHashed = await bcrypt.compare("plaintextpassword", user.password);
    expect(isHashed).toBe(true);
  });

  // Add more tests for login, JWT issuing, etc.
});
