const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return tag.init(sequelize, DataTypes);
}

class tag extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    tag_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "name"
    }
  }, {
    sequelize,
    tableName: 'tag',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "tag_id" },
        ]
      },
      {
        name: "tag_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "tag_id" },
        ]
      },
      {
        name: "name",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "name" },
        ]
      },
    ]
  });
  }
}
