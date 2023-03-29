const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return user_offer.init(sequelize, DataTypes);
}

class user_offer extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'user_id'
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
    tableName: 'user_offer',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_id" },
          { name: "offer_id" },
        ]
      },
      {
        name: "fk_offer_user_offer",
        using: "BTREE",
        fields: [
          { name: "offer_id" },
        ]
      },
    ]
  });
  }
}
