import { useMutation } from '@apollo/client';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { DELETE_IMAGE } from '../mutations/imageMutations';
import { GET_IMAGES } from '../queries/imageQueries';
import { USER_SHOPPING_CART_IMAGE } from '../queries/shoppingCartQueries';
import ActionButton from './ActionButton';

const ImageRow = ({ image }) => {
	const { image_id, image_url, title, price, uses, description } = image;
	const [deleteImage] = useMutation(DELETE_IMAGE, {
		refetchQueries: [{ query: GET_IMAGES }],
	});

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
				<td>{uses}</td>
				<td>{description}</td>
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
