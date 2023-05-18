import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { FaCheckCircle, FaHistory, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { DELETE_IMAGE } from '../mutations/imageMutations';
import {
	GET_IMAGES_BY_TAG_NAME,
	GET_IMAGE_TAGS,
	GET_IMAGE_TAGS_BY_IMAGE_ID,
	GET_LATEST_VERSION_IMAGES,
	GET_TECHNICAL_METADATA,
} from '../queries/imageQueries';
import {
	USER_SHOPPING_CART,
	USER_SHOPPING_CART_IMAGES,
} from '../queries/shoppingCartQueries';
import ActionButton from './ActionButton';
import EditImageModal from './EditImageModal';
import MetadataModal from './MetadataModal';

export const handleDeleteButtonClick = async (
	imgTagNames,
	user,
	image_id,
	deleteImage
) => {
	try {
		const refetchQueries = imgTagNames.map(tagName => ({
			query: GET_IMAGES_BY_TAG_NAME,
			variables: {
				tag_name: tagName,
			},
		}));

		await deleteImage({
			variables: {
				image_id,
			},
			refetchQueries: [
				{
					query: USER_SHOPPING_CART,
					variables: {
						user_id: user?.me?.user_id,
					},
				},
				...refetchQueries,
			],
			update(cache, { data: { deleteImage } }) {
				const { latest_version_images } = cache.readQuery({
					query: GET_LATEST_VERSION_IMAGES,
				});

				cache.writeQuery({
					query: GET_LATEST_VERSION_IMAGES,
					data: {
						latest_version_images: latest_version_images.filter(
							verImage => verImage.image.image_id !== image_id
						),
					},
				});

				const { image_tags } = cache.readQuery({
					query: GET_IMAGE_TAGS,
				});
				cache.writeQuery({
					query: GET_IMAGE_TAGS,
					data: {
						image_tags: image_tags.filter(
							imgTag => imgTag.image.image_id !== image_id
						),
					},
				});

				const { shopping_cart_images_by_sc_id: scImgs } = cache.readQuery({
					query: USER_SHOPPING_CART_IMAGES,
					variables: {
						shopping_cart_id: user?.shopping_cart?.shopping_cart_id,
					},
				});

				cache.writeQuery({
					query: USER_SHOPPING_CART_IMAGES,
					variables: {
						shopping_cart_id: user?.shopping_cart?.shopping_cart_id,
					},
					data: {
						shopping_cart_images_by_sc_id: scImgs.filter(
							scImg => scImg.image.image_id !== image_id
						),
					},
				});
			},
		});
	} catch (error) {
		console.log(error);
	}
};

const AdminImageRow = ({ image }) => {
	const {
		image_id,
		image_url,
		title,
		price,
		uses,
		description,
		journalist,
		distributable,
	} = image;
	const [deleteImage] = useMutation(DELETE_IMAGE);

	const { user, isLoading, isError, isSuccess, message } = useSelector(
		state => state.auth
	);

	const [imgTagNames, setImgTagNames] = useState([]);

	const {
		data: tmData,
		error,
		loading,
	} = useQuery(GET_TECHNICAL_METADATA, {
		variables: { image_id },
	});

	const [getITBIData, { data: itbiData }] = useLazyQuery(
		GET_IMAGE_TAGS_BY_IMAGE_ID
	);

	useEffect(() => {
		const getITBIDataFunc = async () => {
			await getITBIData({
				variables: {
					image_id,
				},
			});
		};

		if (image_id) {
			getITBIDataFunc();
		}
	}, [image_id]);

	useEffect(() => {
		if (itbiData?.image_tags_by_image_id) {
			for (let imgTag of itbiData?.image_tags_by_image_id) {
				const { name: imgTagName } = imgTag?.tag;
				setImgTagNames([...imgTagNames, imgTagName]);
			}
		}
	}, [itbiData?.image_tags_by_image_id]);

	return (
		<>
			<tr>
				<th scope='row'>{image_id}</th>
				<td className='w-25'>
					<img className='w-75' src={image_url} />
				</td>
				<td>{title}</td>
				<td>${price}</td>
				<td>{distributable && <FaCheckCircle />}</td>
				<td>{uses}</td>
				<td>{description}</td>
				<td>{journalist || '\u2014'}</td>
				<td>
					{tmData?.technical_metadata_by_image_id?.technical_metadata_id && (
						<MetadataModal
							metadata={tmData?.technical_metadata_by_image_id}
							image={image}
						/>
					)}
				</td>
				<td>
					<Link to={`/version-history/${image_id}`}>
						<ActionButton variant='outlined' color='primary' className='btn'>
							<h6 className='p-0 m-0'>
								<FaHistory />
							</h6>
						</ActionButton>
					</Link>
				</td>
				<td>
					<EditImageModal imageToEdit={image} />
				</td>
				<td>
					<ActionButton
						className='btn delete-image-button admin-image-row'
						variant='outlined'
						color='secondary'
						onClick={() =>
							handleDeleteButtonClick(imgTagNames, user, image_id, deleteImage)
						}
					>
						<h6 className='p-0 m-0'>
							<FaTrash />
						</h6>
					</ActionButton>
				</td>
			</tr>
		</>
	);
};
export default AdminImageRow;
