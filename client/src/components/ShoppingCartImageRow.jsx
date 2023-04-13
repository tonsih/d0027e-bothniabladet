import { useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { DELETE_SHOPPING_CART_IMAGE } from '../mutations/shoppingCartMutations';
import { getMe, reset } from '../features/auth/authSlice';
import {
	SHOPPING_CART_IMAGES,
	USER_SHOPPING_CART,
	USER_SHOPPING_CART_IMAGE,
	USER_SHOPPING_CART_IMAGES,
} from '../queries/shoppingCartQueries';
import ActionButton from './ActionButton';
import { ME_QUERY } from '../queries/userQueries';

const ShoppingCartImageRow = ({ image, userId }) => {
	const { image_id, image_url, title, price, uses, description } = image?.image;
	const { shopping_cart_image_id } = image;
	const { shopping_cart_id } = image.shopping_cart;

	const [deleteShoppingCartImage] = useMutation(DELETE_SHOPPING_CART_IMAGE, {
		refetchQueries: [
			{
				query: USER_SHOPPING_CART_IMAGES,
				variables: {
					shopping_cart_id,
				},
			},
			{
				query: USER_SHOPPING_CART,
				variables: {
					user_id: userId,
				},
			},
			{
				query: USER_SHOPPING_CART_IMAGE,
				variables: {
					image_id,
					shopping_cart_id,
				},
			},
		],
	});

	const dispatch = useDispatch();

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
					<ActionButton
						onClick={async () => {
							try {
								await deleteShoppingCartImage({
									variables: {
										shopping_cart_image_id,
									},
								});
							} catch (error) {
								console.log(error);
							}
						}}
						variant='contained'
						color='secondary'
						className='btn'
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
export default ShoppingCartImageRow;
