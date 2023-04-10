const {
	GraphQLObjectType,
	GraphQLID,
	GraphQLString,
	GraphQLBoolean,
	GraphQLFloat,
	GraphQLInt,
	GraphQLList,
	GraphQLSchema,
	GraphQLNonNull,
} = require('graphql');
const { GraphQLDateTime } = require('graphql-scalars');
const { models } = require('../configs/db/db');
const {
	user,
	tag,
	image_tag,
	offer,
	image_offer,
	user_offer,
	image,
	technical_metadata,
	order,
	order_image,
	shopping_cart,
	shopping_cart_image,
} = models;

const bcrypt = require('bcryptjs');
require('dotenv').config();

const UserType = new GraphQLObjectType({
	name: 'User',
	fields: () => ({
		user_id: { type: GraphQLID },
		first_name: { type: GraphQLString },
		last_name: { type: GraphQLString },
		email: { type: GraphQLString },
		password: { type: GraphQLString },
		banned: { type: GraphQLBoolean },
		admin: { type: GraphQLBoolean },
	}),
});

const TechnicalMetadataType = new GraphQLObjectType({
	name: 'TechnicalMetadata',
	fields: () => ({
		technical_metadata_id: { type: GraphQLID },
		coordinates: { type: GraphQLString },
		camera_type: { type: GraphQLString },
		format: { type: GraphQLString },
		version: { type: GraphQLString },
		size: { type: GraphQLInt },
		width: { type: GraphQLInt },
		height: { type: GraphQLInt },
	}),
});

const TagType = new GraphQLObjectType({
	name: 'Tag',
	fields: () => ({
		tag_id: { type: GraphQLID },
		name: { type: GraphQLString },
	}),
});

const ImageType = new GraphQLObjectType({
	name: 'Image',
	fields: () => ({
		image_id: { type: GraphQLID },
		technical_metadata: {
			type: TechnicalMetadataType,
			async resolve(parent) {
				return await technical_metadata.findByPk(parent.technical_metadata_id);
			},
		},
		title: { type: GraphQLString },
		price: { type: GraphQLFloat },
		uses: { type: GraphQLInt },
		image_url: {
			type: GraphQLString,
			async resolve(parent, _, { url }) {
				return (await parent.image_url) && `${url}/images/${parent.image_url}`;
			},
		},
		description: { type: GraphQLString },
	}),
});

const ImageTagType = new GraphQLObjectType({
	name: 'ImageTag',
	fields: () => ({
		image: {
			type: ImageType,
			async resolve(parent) {
				return await image.findByPk(parent.image_id);
			},
		},
		tag: {
			type: TagType,
			async resolve(parent) {
				return await tag.findByPk(parent.tag_id);
			},
		},
	}),
});

const OrderType = new GraphQLObjectType({
	name: 'Order',
	fields: () => ({
		order_id: { type: GraphQLID },
		user: {
			type: UserType,
			async resolve(parent) {
				return await user.findByPk(parent.user_id);
			},
		},
		order_date: { type: GraphQLDateTime },
		total_price: { type: GraphQLFloat },
	}),
});

const OrderImageType = new GraphQLObjectType({
	name: 'OrderImage',
	fields: () => ({
		order: {
			type: OrderType,
			async resolve(parent) {
				return await order.findByPk(parent.order_id);
			},
		},
		image: {
			type: ImageType,
			async resolve(parent) {
				return await image.findByPk(parent.image_id);
			},
		},
	}),
});

const ShoppingCartType = new GraphQLObjectType({
	name: 'ShoppingCart',
	fields: () => ({
		shopping_cart_id: { type: GraphQLID },
		user: {
			type: UserType,
			async resolve(parent, args) {
				return await user.findByPk(parent.user_id);
			},
		},
		total_price: { type: GraphQLFloat },
	}),
});

const ShoppingCartImageType = new GraphQLObjectType({
	name: 'ShoppingCartImage',
	fields: () => ({
		shopping_cart_image_id: { type: GraphQLID },
		shopping_cart: {
			type: ShoppingCartType,
			async resolve(parent) {
				return await shopping_cart.findByPk(parent.shopping_cart_id);
			},
		},
		image: {
			type: ImageType,
			async resolve(parent) {
				return await image.findByPk(parent.image_id);
			},
		},
		time_added: { type: GraphQLDateTime },
	}),
});

const OfferType = new GraphQLObjectType({
	name: 'Offer',
	fields: () => ({
		offer_id: { type: GraphQLID },
		discount: { type: GraphQLFloat },
		start_date: { type: GraphQLDateTime },
		end_date: { type: GraphQLDateTime },
	}),
});

const ImageOfferType = new GraphQLObjectType({
	name: 'ImageOffer',
	fields: () => ({
		image: {
			type: ImageType,
			async resolve(parent) {
				return await image.findByPk(parent.image_id);
			},
		},
		offer: {
			type: OfferType,
			async resolve(parent) {
				return await offer.findByPk(parent.offer_id);
			},
		},
	}),
});

const UserOfferType = new GraphQLObjectType({
	name: 'UserOffer',
	fields: () => ({
		user: {
			type: UserType,
			async resolve(parent) {
				return await user.findByPk(parent.user_id);
			},
		},
		offer: {
			type: OfferType,
			async resolve(parent) {
				return await offer.findByPk(parent.offer_id);
			},
		},
	}),
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		user: {
			type: UserType,
			args: { user_id: { type: GraphQLID } },
			async resolve(_, args) {
				return await user.findByPk(args.user_id);
			},
		},
		users: {
			type: GraphQLList(UserType),
			async resolve() {
				return await user.findAll();
			},
		},
		me: {
			type: UserType,
			async resolve(_, __, { session }) {
				const user_id = session.userId;
				let matchedUser;

				if (user_id) {
					matchedUser = await user.findOne({
						where: { user_id },
					});
				}

				return matchedUser;
			},
		},
		tag: {
			type: TagType,
			args: { tag_id: { type: GraphQLID } },
			async resolve(_, args) {
				return await tag.findByPk(args.tag_id);
			},
		},
		tags: {
			type: GraphQLList(TagType),
			async resolve() {
				return await tag.findAll();
			},
		},
		image: {
			type: ImageType,
			args: { image_id: { type: GraphQLID } },
			async resolve(_, args) {
				return await image.findByPk(args.image_id);
			},
		},
		images: {
			type: GraphQLList(ImageType),
			async resolve() {
				return await image.findAll();
			},
		},
		order: {
			type: OrderType,
			args: { order_id: { type: GraphQLID } },
			async resolve(_, args) {
				return await order.findByPk(args.order_id);
			},
		},
		orders: {
			type: GraphQLList(OrderType),
			async resolve() {
				return await order.findAll();
			},
		},
		order_image: {
			type: OrderImageType,
			args: { order_image_id: { type: GraphQLID } },
			async resolve(_, args) {
				return await order_image.findByPk(args.order_image_id);
			},
		},
		order_images: {
			type: GraphQLList(OrderImageType),
			async resolve() {
				return await order_image.findAll();
			},
		},
		shopping_cart: {
			type: ShoppingCartType,
			async resolve(_, args, { session }) {
				return await shopping_cart.findOne({
					where: { user_id: session.userId },
				});
			},
		},
		shopping_cart_by_user_id: {
			type: ShoppingCartType,
			args: { user_id: { type: GraphQLID } },
			async resolve(_, args) {
				return await shopping_cart.findOne({
					where: {
						user_id: args.user_id,
					},
				});
			},
		},
		shopping_carts: {
			type: GraphQLList(ShoppingCartType),
			async resolve() {
				return await shopping_cart.findAll();
			},
		},
		shopping_cart_image: {
			type: ShoppingCartImageType,
			args: { shopping_cart_image_id: { type: GraphQLID } },
			async resolve(_, args) {
				return await shopping_cart_image.findByPk(args.shopping_cart_image_id);
			},
		},
		shopping_cart_images: {
			type: GraphQLList(ShoppingCartImageType),
			async resolve() {
				return await shopping_cart_image.findAll();
			},
		},
		shopping_cart_images_by_sc_id: {
			type: GraphQLList(ShoppingCartImageType),
			args: { shopping_cart_id: { type: GraphQLID } },
			async resolve(_, args) {
				return await shopping_cart_image.findAll({
					where: {
						shopping_cart_id: args.shopping_cart_id,
					},
				});
			},
		},
		offer: {
			type: OfferType,
			args: { offer_id: { type: GraphQLID } },
			async resolve(_, args) {
				return await offer.findByPk(args.offer_id);
			},
		},
		offers: {
			type: GraphQLList(OfferType),
			async resolve() {
				return await offer.findAll();
			},
		},
		image_offer: {
			type: ImageOfferType,
			args: { image_id: { type: GraphQLID }, offer_id: { type: GraphQLID } },
			async resolve(_, args) {
				const { image_id, offer_id } = args;
				return await image_offer.findOne({ where: { image_id, offer_id } });
			},
		},
		image_offers: {
			type: GraphQLList(OfferType),
			async resolve() {
				return await image_offer.findAll();
			},
		},
		user_offer: {
			type: UserOfferType,
			args: { user_id: { type: GraphQLID }, offer_id: { type: GraphQLID } },
			async resolve(_, args) {
				const { user_id, offer_id } = args;
				return await image_offer.findOne({ where: { user_id, offer_id } });
			},
		},
		user_offers: {
			type: GraphQLList(OfferType),
			async resolve() {
				return await user_offer.findAll();
			},
		},
		technical_metadata: {
			type: TechnicalMetadataType,
			args: { technical_metadata_id: { type: GraphQLID } },
			async resolve(_, args) {
				return await technical_metadata.findByPk(args.technical_metadata_id);
			},
		},
	},
});

// Mutations
const mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		registerUser: {
			type: UserType,
			args: {
				first_name: { type: GraphQLNonNull(GraphQLString) },
				last_name: { type: GraphQLNonNull(GraphQLString) },
				email: { type: GraphQLNonNull(GraphQLString) },
				password: { type: GraphQLNonNull(GraphQLString) },
				banned: { type: GraphQLNonNull(GraphQLBoolean), defaultValue: false },
				admin: { type: GraphQLNonNull(GraphQLBoolean), defaultValue: false },
			},
			async resolve(parent, args, { session }) {
				const { first_name, last_name, email, password, banned, admin } = args;

				if (await user.findOne({ where: { email } }))
					throw new Error('User with the provided email already exists!');

				const hashedPassword = await bcrypt.hash(
					password,
					parseInt(process.env.SALT)
				);

				const createdUser = await user.create({
					first_name,
					last_name,
					email,
					password: hashedPassword,
					banned,
					admin,
				});

				session.userId = createdUser.user_id;

				await shopping_cart.create({
					user_id: createdUser.user_id,
					total_price: 0,
				});

				return createdUser;
			},
		},
		loginUser: {
			type: UserType,
			args: {
				email: { type: GraphQLNonNull(GraphQLString) },
				password: { type: GraphQLNonNull(GraphQLString) },
			},
			async resolve(_, args, { session }) {
				const { email, password } = args;

				const matchedUser = await user.findOne({
					where: { email },
				});

				if (!matchedUser) throw new Error('User does not exist');

				if (!(await bcrypt.compare(password, matchedUser.password)))
					throw new Error('Wrong password');

				session.userId = matchedUser.user_id;

				return matchedUser;
			},
		},
		logoutUser: {
			type: UserType,
			async resolve(_, __, { session }) {
				const res = new Promise(res =>
					session.destroy(err => {
						if (err) console.log('logout error: ', err);
						res(true);
					})
				);

				return await res;
			},
		},
		addTag: {
			type: TagType,
			args: {
				name: { type: GraphQLNonNull(GraphQLString) },
			},
			async resolve(_, args) {
				return await tag.create({
					name: args.name,
				});
			},
		},
		addImage: {
			type: ImageType,
			args: {
				image_id: { type: GraphQLID },
				technical_metadata_id: { type: GraphQLID },
				title: { type: GraphQLNonNull(GraphQLString) },
				price: { type: GraphQLNonNull(GraphQLFloat) },
				uses: { type: GraphQLNonNull(GraphQLInt) },
				distributable: { type: GraphQLBoolean, defaultValue: false },
				image_url: { type: GraphQLString },
				description: { type: GraphQLString },
			},
			async resolve(_, args) {
				const {
					technical_metadata_id,
					title,
					price,
					uses,
					distributable,
					image_url,
					description,
				} = args;

				return await image.create({
					technical_metadata_id,
					title,
					price,
					uses,
					image_url,
					distributable,
					description,
				});
			},
		},
		addImageTag: {
			type: ImageTagType,
			args: {
				image_id: { type: GraphQLNonNull(GraphQLID) },
				tag_id: { type: GraphQLNonNull(GraphQLID) },
			},
			async resolve(_, args) {
				const { image_id, tag_id } = args;

				return await image_tag.create({
					image_id,
					tag_id,
				});
			},
		},
		addOrder: {
			type: OrderType,
			args: {
				user_id: { type: GraphQLNonNull(GraphQLID) },
				shopping_cart_id: { type: GraphQLNonNull(GraphQLID) },
				order_date: { type: GraphQLNonNull(GraphQLDateTime) },
				total_price: { type: GraphQLNonNull(GraphQLFloat) },
			},
			async resolve(_, args) {
				const { user_id, shopping_cart_id, order_date, total_price } = args;

				return await order.create({
					user_id,
					shopping_cart_id,
					order_date,
					total_price,
				});
			},
		},
		addOrderImage: {
			type: OrderImageType,
			args: {
				order_id: { type: GraphQLNonNull(GraphQLID) },
				image_id: { type: GraphQLNonNull(GraphQLID) },
			},
			async resolve(_, args) {
				const { order_id, image_id } = args;

				return await order_image.create({
					order_id,
					image_id,
				});
			},
		},
		addShoppingCart: {
			type: ShoppingCartType,
			args: {
				user_id: { type: GraphQLNonNull(GraphQLID) },
				total_price: { type: GraphQLNonNull(GraphQLFloat), defaultValue: 0 },
			},
			async resolve(_, args) {
				const { user_id, total_price } = args;

				return await shopping_cart.create({
					user_id,
					total_price,
				});
			},
		},
		addShoppingCartImage: {
			type: ShoppingCartImageType,
			args: {
				shopping_cart_id: { type: GraphQLNonNull(GraphQLID) },
				image_id: { type: GraphQLNonNull(GraphQLID) },
				time_added: { type: GraphQLNonNull(GraphQLDateTime) },
			},
			async resolve(_, args) {
				const { shopping_cart_id, image_id, time_added } = args;

				return await shopping_cart_image.create({
					shopping_cart_id,
					image_id,
					time_added,
				});
			},
		},
		addTechnicalMetadata: {
			type: TechnicalMetadataType,
			args: {
				coordinates: { type: GraphQLString },
				camera_type: { type: GraphQLString },
				format: { type: GraphQLString },
				version: { type: GraphQLString },
				size: { type: GraphQLInt },
				width: { type: GraphQLInt },
				height: { type: GraphQLInt },
			},
			async resolve(_, args) {
				const {
					coordinates,
					camera_type,
					format,
					version,
					size,
					width,
					height,
				} = args;

				return await technical_metadata.create({
					coordinates,
					camera_type,
					format,
					version,
					size,
					width,
					height,
				});
			},
		},
		addOffer: {
			type: OfferType,
			args: {
				discount: { type: GraphQLString },
				start_date: { type: GraphQLDateTime },
				end_date: { type: GraphQLDateTime },
			},
			async resolve(_, args) {
				const { discount, start_date, end_date } = args;

				return await offer.create({
					discount,
					start_date,
					end_date,
				});
			},
		},
		addUserOffer: {
			type: UserOfferType,
			args: {
				user_id: { type: GraphQLNonNull(GraphQLID) },
				offer_id: { type: GraphQLNonNull(GraphQLID) },
			},
			async resolve(_, args) {
				const { offer_id, user_id } = args;

				return await user_offer.create({
					user_id,
					offer_id,
				});
			},
		},
		addImageOffer: {
			type: ImageOfferType,
			args: {
				image_id: { type: GraphQLNonNull(GraphQLID) },
				offer_id: { type: GraphQLNonNull(GraphQLID) },
			},
			async resolve(_, args) {
				const { image_id, offer_id } = args;

				return await image_offer.create({
					image_id,
					offer_id,
				});
			},
		},
		deleteUser: {
			type: UserType,
			args: { user_id: { type: GraphQLNonNull(GraphQLID) } },
			async resolve(_, args) {
				const deletedUser = await user.findByPk(args.user_id);
				await user.destroy({
					where: {
						user_id: args.user_id,
					},
				});
				return deletedUser;
			},
		},
		deleteTag: {
			type: TagType,
			args: { tag_id: { type: GraphQLNonNull(GraphQLID) } },
			async resolve(_, args) {
				const deletedTag = await tag.findByPk(args.tag_id);
				await tag.destroy({
					where: {
						tag_id: args.tag_id,
					},
				});
				return deletedTag;
			},
		},
		deleteImage: {
			type: ImageType,
			args: { image_id: { type: GraphQLNonNull(GraphQLID) } },
			resolve(_, args) {
				const deletedImage = image.findByPk(args.image_id);
				image.destroy({
					where: {
						image_id: args.image_id,
					},
				});
				return deletedImage;
			},
		},
		deleteImageTag: {
			type: ImageTagType,
			args: { image_tag_id: { type: GraphQLNonNull(GraphQLID) } },
			async resolve(_, args) {
				const deletedImageTag = await image_tag.findByPk(args.image_tag_id);
				await image_tag.destroy({
					where: {
						image_tag_id: args.image_tag_id,
					},
				});
				return deletedImageTag;
			},
		},
		deleteOrder: {
			type: OrderType,
			args: { order_id: { type: GraphQLNonNull(GraphQLID) } },
			async resolve(_, args) {
				const deletedOrder = await order.findByPk(args.order_id);
				await order.destroy({
					where: {
						order_id: args.order_id,
					},
				});
				return deletedOrder;
			},
		},
		deleteOrderImage: {
			type: OrderImageType,
			args: { order_image_id: { type: GraphQLNonNull(GraphQLID) } },
			resolve(_, args) {
				const deletedOrderImage = order_image.findByPk(args.order_image_id);
				order_image.destroy({
					where: {
						order_image_id: args.order_image_id,
					},
				});
				return deletedOrderImage;
			},
		},
		deleteOrderImage: {
			type: OrderImageType,
			args: {
				order_id: { type: GraphQLNonNull(GraphQLID) },
				image_id: { type: GraphQLNonNull(GraphQLID) },
			},

			async resolve(_, args) {
				const { order_id, image_id } = args;

				const deletedOrderImage = await order_image.findOne({
					where: {
						order_id,
						image_id,
					},
				});
				order_image.destroy({
					where: {
						order_id,
						image_id,
					},
				});
				return deletedOrderImage;
			},
		},
		deleteShoppingCart: {
			type: ShoppingCartType,
			args: { shopping_cart_id: { type: GraphQLNonNull(GraphQLID) } },
			resolve(_, args) {
				const deletedShoppingCart = shopping_cart.findByPk(args.shopping_cart);
				shopping_cart.destroy({
					where: {
						shopping_cart_id: args.shopping_cart_id,
					},
				});
				return deletedShoppingCart;
			},
		},
		deleteShoppingCartImage: {
			type: ShoppingCartImageType,
			args: { shopping_cart_image_id: { type: GraphQLNonNull(GraphQLID) } },
			async resolve(_, args) {
				const deletedShoppingCartImage = await shopping_cart_image.findByPk(
					await args.shopping_cart_image_id
				);
				shopping_cart_image.destroy({
					where: {
						shopping_cart_image_id: args.shopping_cart_image_id,
					},
				});
				return deletedShoppingCartImage;
			},
		},
		deleteOffer: {
			type: OfferType,
			args: { offer_id: { type: GraphQLNonNull(GraphQLID) } },
			async resolve(_, args) {
				const deletedOffer = await offer.findByPk(await args.offer_id);
				offer.destroy({
					where: {
						offer_id: args.offer_id,
					},
				});
				return deletedOffer;
			},
		},
		deleteImageOffer: {
			type: ImageOfferType,
			args: {
				image_id: { type: GraphQLNonNull(GraphQLID) },
				offer_id: { type: GraphQLNonNull(GraphQLID) },
			},

			async resolve(_, args) {
				const { image_id, offer_id } = args;

				const deletedImageOffer = await image_offer.findOne({
					where: {
						image_id,
						offer_id,
					},
				});
				image_offer.destroy({
					where: {
						image_id,
						offer_id,
					},
				});
				return deletedImageOffer;
			},
		},
		deleteUserOffer: {
			type: UserOfferType,
			args: {
				user_id: { type: GraphQLNonNull(GraphQLID) },
				offer_id: { type: GraphQLNonNull(GraphQLID) },
			},

			async resolve(_, args) {
				const { user_id, offer_id } = args;

				const deletedUserOffer = await user_offer.findOne({
					where: {
						user_id,
						offer_id,
					},
				});
				user_offer.destroy({
					where: {
						user_id,
						offer_id,
					},
				});
				return deletedUserOffer;
			},
		},
		updateUser: {
			type: UserType,
			args: {
				user_id: { type: GraphQLNonNull(GraphQLID) },
				first_name: { type: GraphQLString },
				last_name: { type: GraphQLString },
				email: { type: GraphQLString },
				password: { type: GraphQLString },
				banned: { type: GraphQLBoolean },
				admin: { type: GraphQLBoolean },
			},
			async resolve(_, args) {
				const {
					user_id,
					first_name,
					last_name,
					email,
					password,
					banned,
					admin,
				} = args;

				await user.update(
					{
						first_name,
						last_name,
						email,
						password,
						banned,
						admin,
					},
					{ where: { user_id } }
				);
				return user.findByPk(user_id);
			},
		},
		updateTag: {
			type: TagType,
			args: {
				tag_id: { type: GraphQLNonNull(GraphQLID) },
				name: { type: GraphQLString },
			},
			async resolve(_, args) {
				const { tag_id, name } = args;

				await tag.update(
					{
						tag_id,
						name,
					},
					{ where: { tag_id } }
				);
				return await tag.findByPk(tag_id);
			},
		},
		updateImage: {
			type: ImageType,
			args: {
				image_id: { type: GraphQLNonNull(GraphQLID) },
				category_id: { type: GraphQLID },
				title: { type: GraphQLString },
				price: { type: GraphQLFloat },
				uses: { type: GraphQLInt },
				description: { type: GraphQLString },
				image_url: { type: GraphQLString },
			},
			async resolve(_, args) {
				const { image_id, tag_id, title, price, uses, description, image_url } =
					args;

				await image.update(
					{
						image_id,
						tag_id,
						title,
						price,
						uses,
						description,
						image_url,
					},
					{ where: { image_id } }
				);
				return await image.findByPk(image_id);
			},
		},
		updateImageTag: {
			type: ImageTagType,
			args: {
				image_id: { type: GraphQLNonNull(GraphQLID) },
				tag_id: { type: GraphQLNonNull(GraphQLID) },
			},
			async resolve(_, args) {
				const { image_id, tag_id } = args;

				await image_tag.update(
					{
						image_id,
						tag_id,
					},
					{ where: { image_id, tag_id } }
				);
				return await image_tag.findOne({
					where: {
						image_id,
						tag_id,
					},
				});
			},
		},
		updateOrder: {
			type: OrderType,
			args: {
				order_id: { type: GraphQLNonNull(GraphQLID) },
				user_id: { type: GraphQLID },
				order_date: { type: GraphQLDateTime },
				total_price: { type: GraphQLFloat },
			},
			async resolve(_, args) {
				const { order_id, user_id, order_date, total_price } = args;

				await order.update(
					{
						order_id,
						user_id,
						order_date,
						total_price,
					},
					{ where: { order_id } }
				);
				return await order.findByPk(order_id);
			},
		},
		updateOrderImage: {
			type: OrderImageType,
			args: {
				order_id: { type: GraphQLNonNull(GraphQLID) },
				image_id: { type: GraphQLNonNull(GraphQLID) },
			},
			async resolve(_, args) {
				const { order_id, image_id } = args;

				await order_image.update(
					{
						order_id,
						image_id,
					},
					{ where: { order_id, image_id } }
				);
				return await order_image.findOne({ where: order_id, image_id });
			},
		},
		updateShoppingCart: {
			type: ShoppingCartType,
			args: {
				shopping_cart_id: { type: GraphQLNonNull(GraphQLID) },
				user_id: { type: GraphQLID },
				total_price: { type: GraphQLFloat },
			},
			async resolve(_, args) {
				const { shopping_cart_id, user_id, total_price } = args;
				await shopping_cart.update(
					{
						shopping_cart_id,
						user_id,
						total_price,
					},
					{ where: { shopping_cart_id } }
				);
				return await shopping_cart.findByPk(shopping_cart_id);
			},
		},
		updateShoppingCartImage: {
			type: ShoppingCartImageType,
			args: {
				shopping_cart_image_id: { type: GraphQLNonNull(GraphQLID) },
				shopping_cart_id: { type: GraphQLID },
				image_id: { type: GraphQLID },
				time_added: { type: GraphQLDateTime },
			},
			async resolve(_, args) {
				const {
					shopping_cart_image_id,
					shopping_cart_id,
					image_id,
					time_added,
				} = args;

				await shopping_cart_image.update(
					{
						shopping_cart_image_id,
						shopping_cart_id,
						image_id,
						time_added,
					},
					{ where: { shopping_cart_image_id } }
				);
				return await shopping_cart_image.findByPk(shopping_cart_image_id);
			},
		},
		updateOffer: {
			type: OfferType,
			args: {
				offer_id: { type: GraphQLNonNull(GraphQLID) },
				discount: { type: GraphQLFloat },
				start_date: { type: GraphQLDateTime },
				end_date: { type: GraphQLDateTime },
			},
			async resolve(_, args) {
				const { offer_id, discount, start_date, end_date } = args;

				await offer.update(
					{
						offer_id,
						discount,
						start_date,
						end_date,
					},
					{ where: { offer_id } }
				);
				return await offer.findOne(offer_id);
			},
		},
		updateImageOffer: {
			type: ImageOfferType,
			args: {
				image_id: { type: GraphQLNonNull(GraphQLID) },
				offer_id: { type: GraphQLNonNull(GraphQLID) },
			},
			async resolve(_, args) {
				const { offer_id, image_id } = args;

				await image_offer.update(
					{
						offer_id,
						image_id,
					},
					{ where: { offer_id, image_id } }
				);
				return await image_offer.findOne({ where: offer_id, image_id });
			},
		},
		updateUserOffer: {
			type: UserOfferType,
			args: {
				user_id: { type: GraphQLNonNull(GraphQLID) },
				offer_id: { type: GraphQLNonNull(GraphQLID) },
			},
			async resolve(_, args) {
				const { offer_id, user_id } = args;

				await image_offer.update(
					{
						offer_id,
						user_id,
					},
					{ where: { offer_id, user_id } }
				);
				return await image_offer.findOne({ where: offer_id, user_id });
			},
		},
	},
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation,
});
