"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const articles = require("../data/articles.json");
    articles.forEach((article) => {
      article.createdAt = article.updatedAt = new Date();
    });

    await queryInterface.bulkInsert("Articles", articles, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Articles", null, {});
  },
};
