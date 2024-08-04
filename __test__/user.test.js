const request = require("supertest");
const app = require("../app");
const { hash } = require("../helpers/bcrypt");
const { User } = require("../models");
const {
  test,
  describe,
  expect,
  beforeAll,
  afterAll,
} = require("@jest/globals");

beforeAll(async () => {
  const users = require("../data/users.json");
  users.forEach((user) => {
    user.password = hash(user.password);
    user.updatedAt = user.createdAt = new Date();
  });

  await User.bulkCreate(users);
});

afterAll(async () => {
  await User.destroy({ truncate: true, cascade: true, restartIdentity: true });
});

describe("Post /login", () => {
  describe("Post /login - Success", () => {
    test("Success Login", async () => {
      const data = {
        email: "humberto@artisteer.com",
        password: "12345",
      };
      const response = await request(app).post("/login").send(data);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("access_token", expect.any(String));
    });
  });

  describe("Post /login - Failed", () => {
    test("Email Blank", async () => {
      const data = {
        email: "",
        password: "12345",
      };
      const response = await request(app).post("/login").send(data);
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });

    test("Password Blank", async () => {
      const data = {
        email: "humberto@artisteer.com",
        password: "",
      };
      const response = await request(app).post("/login").send(data);
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });

    test("Email Not Found", async () => {
      const data = {
        email: "hum@artisteer.com",
        password: "12345",
      };
      const response = await request(app).post("/login").send(data);
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });

    test("Password Incorrect", async () => {
      const data = {
        email: "humberto@artisteer.com",
        password: "xxxx",
      };
      const response = await request(app).post("/login").send(data);
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });
  });
});
