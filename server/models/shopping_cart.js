const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return shopping_cart.init(sequelize, DataTypes);
}

class shopping_cart extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    shopping_cart_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'user',
        key: 'user_id'
      },
      unique: "fk_user_shopping_cart"
    },
    total_price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'shopping_cart',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "shopping_cart_id" },
        ]
      },
      {
        name: "shopping_cart_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "shopping_cart_id" },
        ]
      },
      {
        name: "user_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
