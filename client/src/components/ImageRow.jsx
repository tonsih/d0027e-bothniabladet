import { useMutation, useQuery } from '@apollo/client';
import {
	FaCheck,
	FaCheckCircle,
	FaCross,
	FaEdit,
	FaInfoCircle,
	FaTrash,
} from 'react-icons/fa';
import { DELETE_IMAGE } from '../mutations/imageMutations';
import { GET_IMAGES, GET_TECHNICAL_METADATA } from '../queries/imageQueries';
import { USER_SHOPPING_CART_IMAGE } from '../queries/shoppingCartQueries';
import ActionButton from './ActionButton';
import MetadataModal from './MetadataModal';

const ImageRow = ({ image }) => {
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
	const [deleteImage] = useMutation(DELETE_IMAGE, {
		refetchQueries: [{ query: GET_IMAGES }],
	});

	const {
		data: tmData,
		error,
		loading,
	} = useQuery(GET_TECHNICAL_METADATA, {
		variables: { image_id },
	});

	console.log(tmData?.technical_metadata_by_image_id?.technical_metadata_id);

	return (
		<>
			<tr>
				<th scope='row'>{image_id}</th>
				<td className='w-25'>
					<img
						className='w-75'
						src={image_url || 'https://placehold.co/500x400'}
					/>
				</td>
				<td>{title}</td>
				<td>${price}</td>
				<td>{distributable && <FaCheckCircle />}</td>
				<td>{uses}</td>
				<td>{description}</td>
				<td>{journalist || '\u2014'}</td>
				<td>
					{tmData?.technical_metadata_by_image_id?.technical_metadata_id && (
						<MetadataModal metadata={tmData?.technical_metadata_by_image_id} />
					)}
				</td>
				<td>
					<ActionButton variant='contained' color='secondary' className='btn'>
						<h6 className='p-0 m-0'>
							<FaEdit />
						</h6>
					</ActionButton>
				</td>
				<td>
					<ActionButton
						variant='contained'
						color='secondary'
						className='btn'
						onClick={async () => {
							try {
								await deleteImage({
									variables: {
										image_id,
									},
								});
							} catch (error) {
								console.log(error);
							}
						}}
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
export default ImageRow;
