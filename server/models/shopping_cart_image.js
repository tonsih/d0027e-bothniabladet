const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return shopping_cart_image.init(sequelize, DataTypes);
}

class shopping_cart_image extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    shopping_cart_image_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    shopping_cart_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'shopping_cart',
        key: 'shopping_cart_id'
      }
    },
    image_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'image',
        key: 'image_id'
      }
    },
    time_added: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'shopping_cart_image',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "shopping_cart_image_id" },
        ]
      },
      {
        name: "shopping_cart_image_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "shopping_cart_image_id" },
        ]
      },
      {
        name: "uc_shopping_cart_image",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "shopping_cart_id" },
          { name: "image_id" },
        ]
      },
      {
        name: "fk_image_shopping_cart_image",
        using: "BTREE",
        fields: [
          { name: "image_id" },
        ]
      },
    ]
  });
  }
}
