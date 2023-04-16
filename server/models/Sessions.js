const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return Sessions.init(sequelize, DataTypes);
}

class Sessions extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    sid: {
      type: DataTypes.STRING(36),
      allowNull: false,
      primaryKey: true
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Sessions',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "sid" },
        ]
      },
    ]
  });
  }
}
