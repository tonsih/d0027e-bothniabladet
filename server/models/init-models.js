const DataTypes = require("sequelize").DataTypes;
const _image = require("./image");
const _image_offer = require("./image_offer");
const _image_tag = require("./image_tag");
const _offer = require("./offer");
const _order = require("./order");
const _order_image = require("./order_image");
const _shopping_cart = require("./shopping_cart");
const _shopping_cart_image = require("./shopping_cart_image");
const _tag = require("./tag");
const _technical_metadata = require("./technical_metadata");
const _user = require("./user");
const _user_offer = require("./user_offer");

function initModels(sequelize) {
  const image = _image(sequelize, DataTypes);
  const image_offer = _image_offer(sequelize, DataTypes);
  const image_tag = _image_tag(sequelize, DataTypes);
  const offer = _offer(sequelize, DataTypes);
  const order = _order(sequelize, DataTypes);
  const order_image = _order_image(sequelize, DataTypes);
  const shopping_cart = _shopping_cart(sequelize, DataTypes);
  const shopping_cart_image = _shopping_cart_image(sequelize, DataTypes);
  const tag = _tag(sequelize, DataTypes);
  const technical_metadata = _technical_metadata(sequelize, DataTypes);
  const user = _user(sequelize, DataTypes);
  const user_offer = _user_offer(sequelize, DataTypes);

  image.belongsToMany(offer, { as: 'offer_id_offers', through: image_offer, foreignKey: "image_id", otherKey: "offer_id" });
  image.belongsToMany(order, { as: 'order_id_orders', through: order_image, foreignKey: "image_id", otherKey: "order_id" });
  image.belongsToMany(tag, { as: 'tag_id_tags', through: image_tag, foreignKey: "image_id", otherKey: "tag_id" });
  offer.belongsToMany(image, { as: 'image_id_images', through: image_offer, foreignKey: "offer_id", otherKey: "image_id" });
  offer.belongsToMany(user, { as: 'user_id_users', through: user_offer, foreignKey: "offer_id", otherKey: "user_id" });
  order.belongsToMany(image, { as: 'image_id_image_order_images', through: order_image, foreignKey: "order_id", otherKey: "image_id" });
  tag.belongsToMany(image, { as: 'image_id_image_image_tags', through: image_tag, foreignKey: "tag_id", otherKey: "image_id" });
  user.belongsToMany(offer, { as: 'offer_id_offer_user_offers', through: user_offer, foreignKey: "user_id", otherKey: "offer_id" });
  image_offer.belongsTo(image, { as: "image", foreignKey: "image_id"});
  image.hasMany(image_offer, { as: "image_offers", foreignKey: "image_id"});
  image_tag.belongsTo(image, { as: "image", foreignKey: "image_id"});
  image.hasMany(image_tag, { as: "image_tags", foreignKey: "image_id"});
  order_image.belongsTo(image, { as: "image", foreignKey: "image_id"});
  image.hasMany(order_image, { as: "order_images", foreignKey: "image_id"});
  shopping_cart_image.belongsTo(image, { as: "image", foreignKey: "image_id"});
  image.hasMany(shopping_cart_image, { as: "shopping_cart_images", foreignKey: "image_id"});
  image_offer.belongsTo(offer, { as: "offer", foreignKey: "offer_id"});
  offer.hasMany(image_offer, { as: "image_offers", foreignKey: "offer_id"});
  user_offer.belongsTo(offer, { as: "offer", foreignKey: "offer_id"});
  offer.hasMany(user_offer, { as: "user_offers", foreignKey: "offer_id"});
  order_image.belongsTo(order, { as: "order", foreignKey: "order_id"});
  order.hasMany(order_image, { as: "order_images", foreignKey: "order_id"});
  shopping_cart_image.belongsTo(shopping_cart, { as: "shopping_cart", foreignKey: "shopping_cart_id"});
  shopping_cart.hasMany(shopping_cart_image, { as: "shopping_cart_images", foreignKey: "shopping_cart_id"});
  image_tag.belongsTo(tag, { as: "tag", foreignKey: "tag_id"});
  tag.hasMany(image_tag, { as: "image_tags", foreignKey: "tag_id"});
  image.belongsTo(technical_metadata, { as: "technical_metadatum", foreignKey: "technical_metadata_id"});
  technical_metadata.hasMany(image, { as: "images", foreignKey: "technical_metadata_id"});
  order.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(order, { as: "orders", foreignKey: "user_id"});
  shopping_cart.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasOne(shopping_cart, { as: "shopping_cart", foreignKey: "user_id"});
  user_offer.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(user_offer, { as: "user_offers", foreignKey: "user_id"});

  return {
    image,
    image_offer,
    image_tag,
    offer,
    order,
    order_image,
    shopping_cart,
    shopping_cart_image,
    tag,
    technical_metadata,
    user,
    user_offer,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
