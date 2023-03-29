const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return offer.init(sequelize, DataTypes);
}

class offer extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    offer_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    discount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'offer',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "offer_id" },
        ]
      },
      {
        name: "offer_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "offer_id" },
        ]
      },
    ]
  });
  }
}
