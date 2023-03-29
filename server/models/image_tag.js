const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return image_tag.init(sequelize, DataTypes);
}

class image_tag extends Sequelize.Model {
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
    tag_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'tag',
        key: 'tag_id'
      }
    }
  }, {
    sequelize,
    tableName: 'image_tag',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "image_id" },
          { name: "tag_id" },
        ]
      },
      {
        name: "fk_tag_image_tag",
        using: "BTREE",
        fields: [
          { name: "tag_id" },
        ]
      },
    ]
  });
  }
}
