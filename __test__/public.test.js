const request = require("supertest");
const app = require("../app");
const { hash } = require("../helpers/bcrypt");
const { sequelize } = require("../models/index");

beforeAll(async () => {
  const users = require("../data/users.json");
  users.forEach((user) => {
    user.password = hash(user.password);
    user.updatedAt = user.createdAt = new Date();
  });

  const categories = require("../data/categories.json");
  categories.forEach((category) => {
    category.updatedAt = category.createdAt = new Date();
  });

  const articles = require("../data/articles.json");
  articles.forEach((article) => {
    article.updatedAt = article.createdAt = new Date();
  });

  await sequelize.queryInterface.bulkInsert("Users", users, {});
  await sequelize.queryInterface.bulkInsert("Categories", categories, {});
  await sequelize.queryInterface.bulkInsert("Articles", articles, {});
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Users", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await sequelize.queryInterface.bulkDelete("Categories", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
  await sequelize.queryInterface.bulkDelete("Articles", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

describe("GET /pub/articles", () => {
  describe("GET /pub/articles - Success Get Articles", () => {
    test("Success Get Articles, With No Query", async () => {
      const response = await request(app).get("/pub/articles");
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Successs Read Article");
    });

    test("Success Get Articles, With 1 Filter Query", async () => {
      const response = await request(app).get("/pub/articles?filter=1");
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Successs Read Article");
    });

    test("Success Get Articles, With Pagination", async () => {
      const response = await request(app).get(
        "/pub/articles?page[size]=10&page[number]=2"
      );
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Successs Read Article");
      expect(response.body).toHaveProperty("totalData", 20);
      expect(response.body).toHaveProperty("dataPerPage", 10);
      expect(response.body).toHaveProperty("totalPage", 2);
      expect(response.body).toHaveProperty("page", 2);
    });
  });
});

describe("GET /pub/articles/:id", () => {
  describe("GET /pub/articles/:id - Success Get Article Based On Id", () => {
    test("Success Get Article Based On Id", async () => {
      const response = await request(app).get("/pub/articles/1");
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        `Successs Read Article With Id 1`
      );
      expect(response.body).toHaveProperty("article", expect.any(Object));
    });
  });

  describe("GET /pub/articles/:id - Failed Get Article Based On Id", () => {
    test("Failed Get Article Based On Id", async () => {
      const response = await request(app).get("/pub/articles/1000");
      expect(response.status).toBe(404);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Data with id 1000 not found"
      );
    });
  });
});
