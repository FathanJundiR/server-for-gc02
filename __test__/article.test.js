const request = require("supertest");
const app = require("../app");
const { hash } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { sequelize } = require("../models/index");

let admin_token;
// let staff_token;

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

  const admin = {
    id: 3,
    email: "humberto@artisteer.com",
    role: "Admin",
  };
  const staff = {
    id: 1,
    email: "sal@mail.com",
    role: "Staff",
  };
  const staff2 = {
    id: 2,
    email: "clyde@mail.com",
    role: "Staff",
  };
  admin_token = signToken(admin);
  staff_token = signToken(staff);
  staff2_token = signToken(staff2);
  console.log(admin_token);
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

describe("POST /articles", () => {
  describe("POST /articles - Success Add Article", () => {
    test("Success Add Article", async () => {
      const article = {
        title: "Makan Siang Gratis Turun Jadi 7500",
        content:
          "AWOKWOWK MAKAN NOH GIMMICK MAKAN SIANG GRATIS. 7500 di warteg juga cuman dapet nasi sama orek tempe bgzd",
        imgUrl: "smosey2@foxnews.com",
        categoryId: 3,
      };
      const response = await request(app)
        .post("/articles")
        .send(article)
        .set("authorization", `Bearer ${admin_token}`);
      expect(response.status).toBe(201);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Success Create New Article"
      );
      expect(response.body).toHaveProperty("articles", expect.any(Object));
    });
  });

  describe("POST /articles - Failed Add Article", () => {
    test("Failded Add Article, Not Login", async () => {
      const article = {
        title: "Makan Siang Gratis Turun Jadi 7500",
        content:
          "AWOKWOWK MAKAN NOH GIMMICK MAKAN SIANG GRATIS. 7500 di warteg juga cuman dapet nasi sama orek tempe bgzd",
        imgUrl: "smosey2@foxnews.com",
        categoryId: 3,
      };
      const response = await request(app).post("/articles").send(article);
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });

    test("Failed Add Article, Invalid Token", async () => {
      const article = {
        title: "Makan Siang Gratis Turun Jadi 7500",
        content:
          "AWOKWOWK MAKAN NOH GIMMICK MAKAN SIANG GRATIS. 7500 di warteg juga cuman dapet nasi sama orek tempe bgzd",
        imgUrl: "smosey2@foxnews.com",
        categoryId: 3,
      };
      const response = await request(app)
        .post("/articles")
        .send(article)
        .set("authorization", `Bearer xxxxx`);
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Please login first");
    });

    test("Failed Add Article, Field Required", async () => {
      const article = {
        content:
          "AWOKWOWK MAKAN NOH GIMMICK MAKAN SIANG GRATIS. 7500 di warteg juga cuman dapet nasi sama orek tempe bgzd",
        imgUrl: "smosey2@foxnews.com",
        categoryId: 3,
      };
      const response = await request(app)
        .post("/articles")
        .send(article)
        .set("authorization", `Bearer ${admin_token}`);
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", expect.any(Array));
    });
  });
});

describe("PUT /articles/:id", () => {
  describe("PUT /articles/:id - Success Update Article", () => {
    test("Success Update Article", async () => {
      const article = {
        title: "ini berita  ting ting",
        content:
          "isinya ya testing aja sih, gabut dikit ges . Tapi banyak uga sih",
        imgUrl: "skeletonihiy",
        categoryId: 3,
      };
      const response = await request(app)
        .put("/articles/21")
        .send(article)
        .set("authorization", `Bearer ${admin_token}`);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Success Update Article with ID 21"
      );
    });
  });

  describe("PUT /articles/:id - Failed Update Article", () => {
    test("Failded Update Article, Not Login", async () => {
      const article = {
        title: "Makan Siang Gratis Turun Jadi 7500",
        content:
          "AWOKWOWK MAKAN NOH GIMMICK MAKAN SIANG GRATIS. 7500 di warteg juga cuman dapet nasi sama orek tempe bgzd",
        imgUrl: "smosey2@foxnews.com",
        categoryId: 3,
      };
      const response = await request(app).put("/articles/21").send(article);
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });

    test("Failed Update Article, Invalid Token", async () => {
      const article = {
        title: "Makan Siang Gratis Turun Jadi 7500",
        content:
          "AWOKWOWK MAKAN NOH GIMMICK MAKAN SIANG GRATIS. 7500 di warteg juga cuman dapet nasi sama orek tempe bgzd",
        imgUrl: "smosey2@foxnews.com",
        categoryId: 3,
      };
      const response = await request(app)
        .put("/articles/21")
        .send(article)
        .set("authorization", `Bearer xxxxx`);
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Please login first");
    });

    test("Failed Update Article, Article Not Found", async () => {
      const article = {
        title: "Makan Siang Gratis Turun Jadi 7500",
        content:
          "AWOKWOWK MAKAN NOH GIMMICK MAKAN SIANG GRATIS. 7500 di warteg juga cuman dapet nasi sama orek tempe bgzd",
        imgUrl: "smosey2@foxnews.com",
        categoryId: 3,
      };
      const response = await request(app)
        .put("/articles/10000")
        .send(article)
        .set("authorization", `Bearer ${staff_token}`);
      expect(response.status).toBe(404);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Data with id 10000 not found"
      );
    });

    test("Failed Update Article, Forbidden-Different User", async () => {
      const article = {
        title: "Makan Siang Gratis Turun Jadi 7500",
        content:
          "AWOKWOWK MAKAN NOH GIMMICK MAKAN SIANG GRATIS. 7500 di warteg juga cuman dapet nasi sama orek tempe bgzd",
        imgUrl: "smosey2@foxnews.com",
        categoryId: 3,
      };
      const response = await request(app)
        .put("/articles/1")
        .send(article)
        .set("authorization", `Bearer ${staff2_token}`);
      expect(response.status).toBe(403);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "You dont have any access"
      );
    });

    test("Failed Update Article, Field Required", async () => {
      const article = {
        title: null,
        content:
          "AWOKWOWK MAKAN NOH GIMMICK MAKAN SIANG GRATIS. 7500 di warteg juga cuman dapet nasi sama orek tempe bgzd",
        imgUrl: "smosey2@foxnews.com",
        categoryId: 3,
      };
      const response = await request(app)
        .put("/articles/1")
        .send(article)
        .set("authorization", `Bearer ${staff_token}`);
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", expect.any(Array));
    });
  });
});

describe("DELETE /article/:id", () => {
  describe("DELETE /articles/:id - Success Delete Article", () => {
    test("Success Delete Article", async () => {
      const response = await request(app)
        .delete("/articles/21")
        .set("authorization", `Bearer ${admin_token}`);
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Success Delete Article with id 21"
      );
    });
  });

  describe("DELETE /articles/:id - Failed Delete Article", () => {
    test("Failded Delete Article, Not Login", async () => {
      const response = await request(app).delete("/articles/1");
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });

    test("Failed Delete Article, Invalid Token", async () => {
      const response = await request(app)
        .delete("/articles/1")
        .set("authorization", `Bearer xxxxx`);
      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Please login first");
    });

    test("Failed Delete Article, Article Not Found", async () => {
      const response = await request(app)
        .delete("/articles/10000")
        .set("authorization", `Bearer ${staff_token}`);
      expect(response.status).toBe(404);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Data with id 10000 not found"
      );
    });

    test("Failed Delete Article, Forbidden-Different User", async () => {
      const response = await request(app)
        .delete("/articles/1")
        .set("authorization", `Bearer ${staff2_token}`);
      expect(response.status).toBe(403);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "You dont have any access"
      );
    });
  });
});
