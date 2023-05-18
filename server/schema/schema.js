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
const { GraphQLDateTime, CountryCodeResolver } = require('graphql-scalars');
const { getNowDateISOString } = require('../utils/utils.cjs');
const { GraphQLUpload } = require('graphql-upload');
const { models, sequelize } = require('../configs/db/db');
const {
	user,
	tag,
	image_tag,
	offer,
	image_offer,
	user_offer,
	image,
	requested_image,
	technical_metadata,
	order,
	order_image,
	shopping_cart,
	shopping_cart_image,
	version,
} = models;
const {
	createWriteStream,
	unlinkSync,
	existsSync,
	unlink,
	readFile,
	createReadStream,
} = require('fs');
const sizeOf = require('image-size');
const exifr = require('exifr');
const mime = require('mime-types');
const moment = require('moment-timezone');
const { DateTime } = require('luxon');
const FileType = require('file-type');

const bcrypt = require('bcryptjs');
const path = require('path');
const { Op } = require('sequelize');
const { promisify } = require('util');
require('dotenv').config();

const throwErrorWithMessage = (message = 'Something went wrong') => {
	throw new Error(message);
};

const readFileAsync = promisify(readFile);

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
		last_modified: { type: GraphQLDateTime },
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
			async resolve(parent, _, { url, placeholderImg }) {
				return (await parent.image_url)
					? `${url}/images/${parent.image_url}`
					: placeholderImg;
			},
		},
		description: { type: GraphQLString },
		journalist: { type: GraphQLString },
		distributable: { type: GraphQLBoolean },
		deleted: { type: GraphQLBoolean },
	}),
});

const RequestedImageFileType = new GraphQLObjectType({
	name: 'RequestedImageFile',
	fields: () => ({
		filename: { type: GraphQLString },
		data: { type: GraphQLString },
		mime_type: { type: GraphQLString },
	}),
});

const RequestedImageType = new GraphQLObjectType({
	name: 'RequestedImage',
	fields: () => ({
		requested_image_id: { type: GraphQLID },
		title: { type: GraphQLString },
		image_url: {
			type: GraphQLString,
			async resolve(parent, _, { url }) {
				return (
					(await parent.image_url) &&
					`${url}/images/requested/${parent.image_url}`
				);
			},
		},
		description: { type: GraphQLString },
		journalist: { type: GraphQLString },
		email: { type: GraphQLNonNull(GraphQLString) },
	}),
});

const VersionType = new GraphQLObjectType({
	name: 'Version',
	fields: () => ({
		version_id: { type: GraphQLID },
		version_no: { type: GraphQLInt },
		image: {
			type: ImageType,
			async resolve(parent) {
				return await image.findByPk(parent.image_id);
			},
		},
		original: {
			type: ImageType,
			async resolve(parent) {
				return await image.findByPk(parent.original_id);
			},
		},
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

const ErrorType = new GraphQLObjectType({
	name: 'Error',
	fields: {
		message: { type: GraphQLString },
	},
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		user: {
			type: UserType,
			args: { user_id: { type: GraphQLID } },
			async resolve(_, { user_id }) {
				return await user.findByPk(user_id);
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
				if (session) {
					const { userId } = session;
					let matchedUser;

					if (userId) {
						matchedUser = await user.findOne({
							where: { user_id: userId },
						});
					}

					return matchedUser;
				}
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
		requested_image_file: {
			type: RequestedImageFileType,
			args: {
				requested_image_id: { type: GraphQLNonNull(GraphQLID) },
			},
			async resolve(_, { requested_image_id }) {
				try {
					const { image_url } = await requested_image.findByPk(
						requested_image_id
					);

					if (image_url) {
						const filePath = path.join(
							__dirname,
							'..',
							'/images/requested',
							image_url
						);
						const data = await readFileAsync(filePath);
						const base64Data = data.toString('base64');
						const stream = createReadStream(filePath);
						const mime_type =
							(await FileType.fromStream(stream))?.mime ||
							mime.lookup(image_url);

						return { filename: image_url, data: base64Data, mime_type };
					}
				} catch (error) {
					throwErrorWithMessage();
				}
			},
		},
		all_versions_image: {
			type: GraphQLList(VersionType),
			args: { image_id: { type: GraphQLID } },
			async resolve(_, { image_id }) {
				try {
					const { original_id } = await version.findOne({
						where: {
							image_id,
						},
					});

					return await version.findAll({
						where: {
							original_id,
						},
					});
				} catch (error) {
					throwErrorWithMessage();
				}
			},
		},
		images: {
			type: GraphQLList(ImageType),
			async resolve() {
				return await image.findAll();
			},
		},
		requested_images: {
			type: GraphQLList(RequestedImageType),
			async resolve() {
				return await requested_image.findAll();
			},
		},
		latest_version_images: {
			type: GraphQLList(VersionType),
			async resolve() {
				const subquery =
					'(SELECT MAX(version_no) FROM version AS v WHERE v.original_id = version.original_id)';
				return await version.findAll({
					where: sequelize.literal(`version_no = ${subquery}`),
				});
			},
		},
		version_by_image: {
			type: VersionType,
			args: { image_id: { type: GraphQLID } },
			async resolve(_, { image_id }) {
				return await version.findOne({
					where: {
						image_id,
					},
				});
			},
		},
		version: {
			type: VersionType,
			args: { version_id: { type: GraphQLID } },
			async resolve(_, { version_id }) {
				return await version.findByPk(version_id);
			},
		},
		versions: {
			type: GraphQLList(VersionType),
			async resolve() {
				return await version.findAll();
			},
		},
		images_by_tag_name: {
			type: GraphQLList(VersionType),
			args: { tag_name: { type: GraphQLString } },
			async resolve(_, { tag_name }) {
				const { tag_id: tagId } = await tag.findOne({
					where: { name: tag_name },
				});

				const subquery =
					'(SELECT MAX(version_no) FROM version AS v WHERE v.original_id = version.original_id)';
				const versions = await version.findAll({
					where: sequelize.literal(`version_no = ${subquery}`),
				});

				let latestVerImgIds = [];
				for (let version of versions) {
					latestVerImgIds.push(version?.image_id);
				}

				const imgTags = await image_tag.findAll({
					where: {
						image_id: latestVerImgIds,
						tag_id: tagId,
					},
				});

				let imgs = [];

				for (let imgTag of imgTags) {
					imgs.push(imgTag.image_id);
				}

				return await version.findAll({
					where: {
						image_id: imgs,
					},
				});
			},
		},
		image_tag: {
			type: ImageTagType,
			args: { image_id: { type: GraphQLID }, tag_id: { type: GraphQLID } },
			async resolve(_, { image_id, tag_id }) {
				return await image_tag.findOne({ where: { image_id, tag_id } });
			},
		},
		image_tags_by_image_id: {
			type: GraphQLList(ImageTagType),
			args: { image_id: { type: GraphQLNonNull(GraphQLID) } },
			async resolve(_, { image_id }) {
				return await image_tag.findAll({ where: { image_id } });
			},
		},
		image_tags: {
			type: GraphQLList(ImageTagType),
			async resolve() {
				const subquery =
					'(SELECT MAX(version_no) FROM version AS v WHERE v.original_id = version.original_id)';
				const versions = await version.findAll({
					where: sequelize.literal(`version_no = ${subquery}`),
				});

				let latestVerImgIds = [];

				for (let version of versions) {
					latestVerImgIds.push(version?.image_id);
				}

				return await image_tag.findAll({
					where: {
						image_id: latestVerImgIds,
					},
				});
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
		user_orders: {
			type: GraphQLList(OrderType),
			async resolve(_, __, { session }) {
				try {
					if (session?.userId) {
						return await order.findAll({
							where: { user_id: session.userId },
						});
					}
				} catch (error) {
					throwErrorWithMessage();
				}
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
		order_images_by_order_id: {
			type: GraphQLList(OrderImageType),
			args: { order_id: { type: GraphQLID } },
			async resolve(_, { order_id }) {
				return await order_image.findAll({
					where: {
						order_id,
					},
				});
			},
		},
		shopping_cart: {
			type: ShoppingCartType,
			async resolve(_, __, { session }) {
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
		shopping_cart_image_by_image_ids: {
			type: GraphQLList(ShoppingCartImageType),
			args: {
				image_ids: { type: GraphQLNonNull(GraphQLList(GraphQLID)) },
				shopping_cart_id: { type: GraphQLNonNull(GraphQLID) },
			},
			async resolve(_, args) {
				const { image_ids, shopping_cart_id } = args;
				const images = Array.isArray(image_ids) ? image_ids : [image_ids];
				return await shopping_cart_image.findAll({
					where: {
						image_id: { [Op.in]: images },
						shopping_cart_id,
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
		technical_metadata_by_image_id: {
			type: TechnicalMetadataType,
			args: { image_id: { type: GraphQLID } },
			async resolve(_, { image_id }) {
				const img = await image.findOne({ where: { image_id } });
				const { technical_metadata_id } = img?.dataValues ?? {
					technical_metadata_id: null,
				};
				if (technical_metadata_id) {
					return await technical_metadata.findOne({
						where: { technical_metadata_id },
					});
				}
				return null;
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
			async resolve(_, args, { session }) {
				const { first_name, last_name, email, password, banned, admin } = args;

				if (await user.findOne({ where: { email } }))
					throwErrorWithMessage('User with the provided email already exists!');

				const hashedPassword = await bcrypt.hash(
					password,
					parseInt(process.env.BCRYPT_ROUNDS)
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

				if (!matchedUser) throwErrorWithMessage('User does not exist');

				if (!(await bcrypt.compare(password, matchedUser.password)))
					throwErrorWithMessage('Wrong password');

				session.userId = matchedUser.user_id;

				return matchedUser;
			},
		},
		logoutUser: {
			type: UserType,
			async resolve(_, __, { session }) {
				const res = new Promise(res =>
					session.destroy(err => {
						if (err) throwErrorWithMessage('logout error');
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
			type: VersionType,
			args: {
				title: { type: GraphQLNonNull(GraphQLString) },
				price: { type: GraphQLNonNull(GraphQLFloat) },
				uses: { type: GraphQLInt, defaultValue: 0 },
				distributable: { type: GraphQLBoolean, defaultValue: false },
				journalist: { type: GraphQLString },
				image_file: { type: GraphQLUpload },
				description: { type: GraphQLString },
				coordinates: { type: GraphQLString },
				camera_type: { type: GraphQLString },
				format: { type: GraphQLString },
				last_modified: { type: GraphQLDateTime },
				size: { type: GraphQLInt },
			},
			async resolve(
				_,
				{
					title,
					price,
					uses,
					distributable,
					journalist,
					image_file,
					description,
					coordinates,
					camera_type,
					format,
					last_modified,
					size,
				},
				{ url }
			) {
				try {
					let tm;

					if (coordinates || camera_type || format || last_modified || size) {
						tm = await technical_metadata.create({
							coordinates: coordinates || null,
							camera_type: camera_type || null,
							format: format || null,
							last_modified: last_modified || null,
							size: size || null,
						});
					}

					const img = await image.create({
						technical_metadata_id: tm?.technical_metadata_id || null,
						title,
						price,
						uses,
						distributable,
						journalist,
						description,
					});

					await version.create({
						version_no: 1,
						image_id: img?.image_id,
						original_id: img?.image_id,
						created_at: getNowDateISOString(),
					});

					if (image_file) {
						const { mimetype, createReadStream } = await image_file;
						const filename = img?.image_id + '.' + mime.extension(mimetype);
						let imgPath = path.join(__dirname, '..', '/images', filename);
						let stream = await createReadStream().pipe(
							createWriteStream(imgPath)
						);

						// stream.on('finish', async () => {
						// 	if (tm) {
						// 		sizeOf(imgPath, async (err, { width, height }) => {
						// 			await tm.update({
						// 				width,
						// 				height,
						// 			});
						// 		});
						// 	}

						// 	await img.update({
						// 		image_url: filename,
						// 	});
						// });

						await new Promise((resolve, reject) => {
							stream.on('finish', async () => {
								if (tm) {
									sizeOf(imgPath, async (err, { width, height }) => {
										await tm.update({
											width,
											height,
										});
									});
								}

								await img.update({
									image_url: filename,
								});

								resolve(); // Resolve the promise after the image URL is updated
							});

							stream.on('error', reject);
						});
					}

					return await version.findOne({ where: { image_id: img.image_id } });
				} catch (error) {
					console.log(error);
					throwErrorWithMessage();
				}
			},
		},
		addRequestedImage: {
			type: RequestedImageType,
			args: {
				title: { type: GraphQLString },
				email: { type: GraphQLNonNull(GraphQLString) },
				journalist: { type: GraphQLString },
				image_file: { type: GraphQLUpload },
				description: { type: GraphQLString },
			},
			async resolve(_, { title, email, journalist, image_file, description }) {
				try {
					const reqImg = await requested_image.create({
						title,
						journalist,
						description,
						email,
					});

					if (image_file) {
						const { mimetype, createReadStream } = await image_file;
						const filename =
							reqImg?.requested_image_id + '.' + mime.extension(mimetype);
						let imgPath = path.join(
							__dirname,
							'..',
							'/images/requested',
							filename
						);
						let stream = await createReadStream().pipe(
							createWriteStream(imgPath)
						);

						stream.on('finish', async () => {
							await reqImg.update({
								image_url: filename,
							});
						});
					}

					return reqImg;
				} catch (error) {
					console.log(error);
					throwErrorWithMessage();
				}
			},
		},
		updateImage: {
			type: ImageType,
			args: {
				image_id: { type: GraphQLNonNull(GraphQLID) },
				title: { type: GraphQLNonNull(GraphQLString) },
				price: { type: GraphQLNonNull(GraphQLFloat) },
				uses: { type: GraphQLInt, defaultValue: 0 },
				distributable: { type: GraphQLBoolean, defaultValue: false },
				journalist: { type: GraphQLString },
				image_url: { type: GraphQLString },
				image_file: { type: GraphQLUpload },
				description: { type: GraphQLString },
				coordinates: { type: GraphQLString },
				camera_type: { type: GraphQLString },
				format: { type: GraphQLString },
				last_modified: { type: GraphQLDateTime },
				size: { type: GraphQLInt },
			},
			async resolve(
				_,
				{
					image_id,
					title,
					price,
					uses,
					distributable,
					journalist,
					image_url,
					image_file,
					description,
					coordinates,
					camera_type,
					format,
					last_modified,
					size,
				},
				{ url }
			) {
				try {
					let { technical_metadata_id: tmId } = await image.findOne({
						where: { image_id },
					});

					let tm = await technical_metadata.findOne({
						where: {
							technical_metadata_id: tmId,
						},
					});

					let filename;

					if (image_url && !image_file) {
						filename = image_url.replace(url + '/images', '').substring(1);

						tm = await technical_metadata.findOne({
							where: {
								technical_metadata_id: tmId,
							},
						});
					}

					const newImg = await image.create({
						title,
						price,
						uses,
						distributable,
						journalist,
						description,
						image_url: image_file ? null : filename || null,
					});

					const { image_id: new_image_id } = newImg;

					if (coordinates || camera_type || format || last_modified || size) {
						let tmCoordinates, tmCameraType, tmformat, tmLastModified, tmSize;

						if (tm) {
							({
								coordinates: tmCoordinates,
								camera_type: tmCameraType,
								format: tmformat,
								last_modified: tmLastModified,
								size: tmSize,
							} = tm);
						}

						tm = await technical_metadata.create({
							coordinates: coordinates || tmCoordinates || null,
							camera_type: camera_type || tmCameraType || null,
							format: format || tmformat || null,
							last_modified: last_modified || tmLastModified || null,
							size: size || tmSize || null,
						});
					}

					await newImg.update({
						technical_metadata_id: tm?.technical_metadata_id,
					});

					const oldVersion = await version.findOne({ where: { image_id } });

					const { version_no, original_id } = oldVersion;

					await version.create({
						version_no: version_no + 1,
						image_id: new_image_id,
						original_id,
						created_at: getNowDateISOString(),
					});

					if (image_file) {
						const { mimetype, createReadStream } = await image_file;
						const filename = new_image_id + '.' + mime.extension(mimetype);
						let imgPath = path.join(__dirname, '..', '/images', filename);
						let stream = await createReadStream().pipe(
							createWriteStream(imgPath)
						);

						stream.on('finish', async () => {
							if (tm) {
								sizeOf(imgPath, async (err, { width, height }) => {
									await tm.update({
										width,
										height,
									});
								});
							}

							await newImg.update({
								image_url: filename,
							});
						});
					}

					const scimgs = await shopping_cart_image.findAll({
						where: {
							image_id,
						},
					});

					for (let scimg of scimgs) {
						const { shopping_cart_image_id } = scimg;
						await shopping_cart_image.update(
							{
								image_id: new_image_id,
							},
							{
								where: {
									shopping_cart_image_id,
								},
							}
						);
					}

					return newImg;
				} catch (error) {
					console.log(error);
					throwErrorWithMessage();
				}
			},
		},
		addImageTag: {
			type: ImageTagType,
			args: {
				image_id: { type: GraphQLNonNull(GraphQLID) },
				tag_id: { type: GraphQLNonNull(GraphQLID) },
			},
			async resolve(_, { image_id, tag_id }) {
				return await image_tag.create({
					image_id,
					tag_id,
				});
			},
		},
		createImageTag: {
			type: ImageTagType,
			args: {
				image_id: { type: GraphQLNonNull(GraphQLID) },
				name: { type: GraphQLNonNull(GraphQLString) },
			},
			async resolve(_, { image_id, name }) {
				try {
					const foundTag = await tag.findOne({
						where: {
							name,
						},
					});

					let tagId = null;

					if (foundTag?.dataValues?.tag_id) {
						const { tag_id } = foundTag?.dataValues;
						tagId = tag_id;
					} else {
						const createdTag = await tag.create({
							name,
						});

						if (createdTag?.dataValues?.tag_id) {
							const { tag_id } = createdTag?.dataValues;
							tagId = tag_id;
						}
					}

					return await image_tag.create({
						image_id,
						tag_id: tagId,
					});
				} catch (error) {
					throwErrorWithMessage();
				}
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
			async resolve(_, { user_id, shopping_cart_id, order_date, total_price }) {
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
		createOrder: {
			type: OrderType,
			async resolve(_, __, { session }) {
				try {
					if (session?.userId) {
						const sc = await shopping_cart.findOne({
							where: { user_id: session.userId },
						});

						const sci = await shopping_cart_image.findAll({
							where: {
								shopping_cart_id: sc.shopping_cart_id,
							},
						});

						const orderDate = DateTime.now()
							.setZone('Europe/Stockholm')
							.toJSDate()
							.toLocaleString('en-US', { timeZone: 'Europe/Stockholm' });

						const isoOrderDate = new Date(orderDate);
						isoOrderDate.setHours(isoOrderDate.getHours() + 2);
						const isoString = isoOrderDate.toISOString();

						const ord = await order.create({
							user_id: session.userId,
							order_date: isoString,
						});

						await sequelize.transaction(async t => {
							for (const cartImg of sci) {
								const { image_id, shopping_cart_image_id } =
									cartImg?.dataValues;

								const img = await image.findByPk(image_id);

								let { uses } = img?.dataValues;

								if (uses && uses > 0) {
									await order_image.create(
										{
											order_id: ord.order_id,
											image_id,
										},
										{ transaction: t }
									);

									await img.update(
										{
											uses: uses - 1,
										},
										{ transaction: t }
									);

									await shopping_cart_image.destroy({
										where: {
											shopping_cart_image_id,
										},
										transaction: t,
									});
								}
							}
						});

						return ord;
					}
					return null;
				} catch (error) {
					console.log(error);
					throwErrorWithMessage();
				}
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
				last_modified: { type: GraphQLDateTime },
				size: { type: GraphQLInt },
				width: { type: GraphQLInt },
				height: { type: GraphQLInt },
			},
			async resolve(_, args) {
				const {
					coordinates,
					camera_type,
					format,
					last_modified,
					size,
					width,
					height,
				} = args;

				return await technical_metadata.create({
					coordinates,
					camera_type,
					format,
					last_modified,
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
			type: GraphQLList(ImageType),
			args: { image_id: { type: GraphQLNonNull(GraphQLID) } },
			async resolve(_, { image_id }, { url }) {
				let deletedImages = [];
				try {
					const { original_id } = await version.findOne({
						where: {
							image_id,
						},
					});

					const imgVersions = await version.findAll({
						where: {
							original_id,
						},
					});

					let imgIds = [];

					for (let imgVer of imgVersions) {
						const { image_id: imgId } = imgVer;

						imgIds.push(imgId);
						deletedImages.push(imgVer);
					}

					await image.update(
						{
							deleted: true,
						},
						{
							where: {
								image_id: imgIds,
							},
						}
					);

					await shopping_cart_image.destroy({
						where: {
							image_id: imgIds,
						},
					});

					return deletedImages;
				} catch (error) {
					console.log(error);
					throwErrorWithMessage();
				}
			},
		},
		deleteRequestedImage: {
			type: RequestedImageType,
			args: { requested_image_id: { type: GraphQLNonNull(GraphQLID) } },
			async resolve(_, { requested_image_id }) {
				try {
					const reqImg = await requested_image.findByPk(requested_image_id);

					if (reqImg?.image_url) {
						const { image_url: imgUrl } = reqImg;

						let imgPath = path.join(
							__dirname,
							'..',
							'/images/requested',
							imgUrl
						);

						unlink(imgPath, err => {
							if (err) {
								throwErrorWithMessage();
								return;
							}
						});
					}

					await reqImg.destroy();

					return reqImg;
				} catch (error) {
					console.log(error);
					throwErrorWithMessage();
				}
			},
		},
		restoreDeletedImages: {
			type: GraphQLList(ImageType),
			async resolve(_, { image_id }, { url }) {
				try {
					const returnedImgs = [];
					const imgVersions = await version.findAll();
					let imgIds = [];

					for (let imgVer of imgVersions) {
						const { image_id: imgId } = imgVer;

						imgIds.push(imgId);
						returnedImgs.push(imgVer);
					}

					await image.update(
						{
							deleted: false,
						},
						{
							where: {
								image_id: imgIds,
							},
						}
					);

					return returnedImgs;
				} catch (error) {
					console.log(error);
					throwErrorWithMessage();
				}
			},
		},
		deleteImageTag: {
			type: ImageTagType,
			args: {
				image_id: { type: GraphQLNonNull(GraphQLID) },
				name: { type: GraphQLNonNull(GraphQLString) },
			},
			async resolve(_, { image_id, name }) {
				const { tag_id } = await tag.findOne({
					where: {
						name,
					},
				});

				const deletedImageTag = await image_tag.findOne({
					where: {
						image_id,
						tag_id,
					},
				});

				await deletedImageTag.destroy();

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
			async resolve(
				_,
				{ user_id, first_name, last_name, email, password, banned, admin }
			) {
				let hashedPassword;

				if (password) {
					hashedPassword = await bcrypt.hash(
						password,
						parseInt(process.env.BCRYPT_ROUNDS)
					);
				}

				await user.update(
					{
						first_name,
						last_name,
						email,
						password: hashedPassword,
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
		uploadFile: {
			type: GraphQLBoolean,
			args: {
				file: {
					type: GraphQLUpload,
				},
			},
			async resolve(parent, { file }) {
				const { filename, mimetype, createReadStream } = await file;
				await createReadStream().pipe(
					createWriteStream(`server/images/${filename}`)
				);
				return true;
			},
		},
	},
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation,
});
