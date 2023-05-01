const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return requested_image.init(sequelize, DataTypes);
}

class requested_image extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    requested_image_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    journalist: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'requested_image',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "requested_image_id" },
        ]
      },
      {
        name: "requested_image_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "requested_image_id" },
        ]
      },
    ]
  });
  }
}
