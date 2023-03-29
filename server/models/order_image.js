const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return order_image.init(sequelize, DataTypes);
}

class order_image extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    order_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'order',
        key: 'order_id'
      }
    },
    image_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'image',
        key: 'image_id'
      }
    }
  }, {
    sequelize,
    tableName: 'order_image',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "order_id" },
          { name: "image_id" },
        ]
      },
      {
        name: "fk_image_order_image",
        using: "BTREE",
        fields: [
          { name: "image_id" },
        ]
      },
    ]
  });
  }
}
