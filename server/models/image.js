const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return image.init(sequelize, DataTypes);
}

class image extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    image_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    technical_metadata_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: 'technical_metadata',
        key: 'technical_metadata_id'
      }
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "title"
    },
    description: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      unique: "image_url"
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    uses: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    distributable: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'image',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "image_id" },
        ]
      },
      {
        name: "image_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "image_id" },
        ]
      },
      {
        name: "title",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "title" },
        ]
      },
      {
        name: "image_url",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "image_url" },
        ]
      },
      {
        name: "fk_technical_metadata_image",
        using: "BTREE",
        fields: [
          { name: "technical_metadata_id" },
        ]
      },
    ]
  });
  }
}