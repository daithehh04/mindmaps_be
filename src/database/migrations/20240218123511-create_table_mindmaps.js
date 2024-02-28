"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("mindmaps", {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
      },
      title: {
        type: Sequelize.STRING,
      },
      desc: {
        type: Sequelize.TEXT,
      },
      img: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.BOOLEAN,
      },
      nodes: {
        type: Sequelize.ARRAY(Sequelize.JSONB),
      },
      edges: {
        type: Sequelize.ARRAY(Sequelize.JSONB),
      },
      created_at: {
        type: Sequelize.DATE(), //progress auto convert timestamp with timezone
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE(), //progress auto convert timestamp with timezone
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      deleted_at: {
        type: Sequelize.DATE(), //progress auto convert timestamp with timezone
      },
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("mindmaps")
  },
}
