const { DataTypes } = require("sequelize");

const db = require("../db/conn");

const User = require("./User");

const thought = db.define("Thought", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

thought.belongsTo(User); //inclusão de user
User.hasMany(thought);

module.exports = thought;
