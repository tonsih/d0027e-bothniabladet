const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return version.init(sequelize, DataTypes);
}

class version extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    version_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    version_no: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    image_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'image',
        key: 'image_id'
      }
    },
    original_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'image',
        key: 'image_id'
      }
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'version',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "version_id" },
        ]
      },
      {
        name: "version_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "version_id" },
        ]
      },
      {
        name: "fk_image_version",
        using: "BTREE",
        fields: [
          { name: "image_id" },
        ]
      },
      {
        name: "fk_original_id",
        using: "BTREE",
        fields: [
          { name: "original_id" },
        ]
      },
    ]
  });
  }
}
