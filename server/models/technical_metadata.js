const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return technical_metadata.init(sequelize, DataTypes);
}

class technical_metadata extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    technical_metadata_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    coordinates: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    camera_type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    format: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    last_modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    size: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true
    },
    width: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true
    },
    height: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'technical_metadata',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "technical_metadata_id" },
        ]
      },
      {
        name: "technical_metadata_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "technical_metadata_id" },
        ]
      },
    ]
  });
  }
}
