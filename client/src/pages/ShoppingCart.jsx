import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ActionButton from '../components/ActionButton';
import ShoppingCartImageRow from '../components/ShoppingCartImageRow';
import { CREATE_ORDER } from '../mutations/orderMutations';
import {
	GET_IMAGE_TAGS,
	GET_LATEST_VERSION_IMAGES,
} from '../queries/imageQueries';
import {
	USER_SHOPPING_CART,
	USER_SHOPPING_CART_IMAGE,
	USER_SHOPPING_CART_IMAGES,
} from '../queries/shoppingCartQueries';
import '../scss/Buttons.scss';

const ShoppingCart = () => {
	const navigate = useNavigate();

	const { user, isLoading, isError, isSuccess, message } = useSelector(
		state => state.auth
	);

	const [getScImgs, { data, loading, error }] = useLazyQuery(
		USER_SHOPPING_CART_IMAGES
	);

	const imageIds = [];

	if (data?.shopping_cart_images_by_sc_id) {
		for (const sci of data?.shopping_cart_images_by_sc_id) {
			imageIds.push(sci?.image?.image_id);
		}
	}

	const [getSc, { data: scData }] = useLazyQuery(USER_SHOPPING_CART);

	const [createOrder] = useMutation(CREATE_ORDER);

	useEffect(() => {
		if (user?.shopping_cart && user?.me) {
			getSc({
				variables: { user_id: user.me.user_id },
			});
			getScImgs({
				variables: { shopping_cart_id: user.shopping_cart.shopping_cart_id },
			});
		}
	}, [user]);

	return user ? (
		<>
			<section className='table-responsive'>
				<table className='table table-dark table-hover'>
					<thead>
						<tr>
							<th scope='col'>ID</th>
							<th scope='col'>Image</th>
							<th scope='col'>Title</th>
							<th scope='col'>Price</th>
							<th scope='col'>Description</th>
							<th scope='col'>Delete</th>
						</tr>
					</thead>
					<tbody>
						{!loading &&
							!error &&
							user?.me?.user_id &&
							data?.shopping_cart_images_by_sc_id &&
							data.shopping_cart_images_by_sc_id.map(image => (
								<ShoppingCartImageRow
									image={image}
									userId={user.me.user_id}
									key={image.image.image_id}
								/>
							))}
					</tbody>
				</table>
				{user?.shopping_cart &&
					user?.me &&
					scData?.shopping_cart_by_user_id &&
					data?.shopping_cart_images_by_sc_id && (
						<span className='orderInfo d-flex flex-column'>
							{data?.shopping_cart_images_by_sc_id.length > 0 ? (
								<>
									Total: ${scData.shopping_cart_by_user_id.total_price}
									<ActionButton
										color='primary'
										variant='outlined'
										className='btn order-button'
										onClick={async () => {
											try {
												const refetchQueries = imageIds.map(imageId => ({
													query: USER_SHOPPING_CART_IMAGE,
													variables: {
														shopping_cart_id:
															user.shopping_cart.shopping_cart_id,
														image_ids: imageId,
													},
												}));

												const createdOrder = await createOrder({
													refetchQueries: [
														{
															query: USER_SHOPPING_CART,
															variables: {
																user_id: user.me.user_id,
															},
														},
														{
															query: USER_SHOPPING_CART_IMAGES,
															variables: {
																shopping_cart_id:
																	user.shopping_cart.shopping_cart_id,
															},
														},
														...refetchQueries,
														{
															query: GET_LATEST_VERSION_IMAGES,
														},
														{
															query: GET_IMAGE_TAGS,
														},
													],
												});

												if (createdOrder?.data?.createOrder?.order_id)
													navigate(
														`/order/${createdOrder?.data?.createOrder?.order_id}`
													);
											} catch (error) {
												console.log(error);
											}
										}}
									>
										Order
									</ActionButton>
								</>
							) : (
								<>No items in the shopping cart</>
							)}
						</span>
					)}
			</section>
		</>
	) : (
		<p>Please login</p>
	);
};
export default ShoppingCart;
