const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return image_offer.init(sequelize, DataTypes);
}

class image_offer extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    image_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'image',
        key: 'image_id'
      }
    },
    offer_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'offer',
        key: 'offer_id'
      }
    }
  }, {
    sequelize,
    tableName: 'image_offer',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "image_id" },
          { name: "offer_id" },
        ]
      },
      {
        name: "fk_offer_image_offer",
        using: "BTREE",
        fields: [
          { name: "offer_id" },
        ]
      },
    ]
  });
  }
}
