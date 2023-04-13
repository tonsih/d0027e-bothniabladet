import { useLazyQuery, useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ShoppingCartImageRow from '../components/ShoppingCartImageRow';
import {
	USER_SHOPPING_CART,
	USER_SHOPPING_CART_IMAGES,
} from '../queries/shoppingCartQueries';

const ShoppingCart = () => {
	const { user, isLoading, isError, isSuccess, message } = useSelector(
		state => state.auth
	);

	const [getScImgs, { data, loading, error }] = useLazyQuery(
		USER_SHOPPING_CART_IMAGES
	);

	const [getSc, { data: scData }] = useLazyQuery(USER_SHOPPING_CART);

	useEffect(() => {
		if (user?.shopping_cart) {
			getSc({
				variables: { user_id: user.me.user_id },
			});
			getScImgs({
				variables: { shopping_cart_id: user.shopping_cart.shopping_cart_id },
			});
		}
	}, [user]);

	return (
		<>
			<section>
				<table className='table table-dark table-hover'>
					<thead>
						<tr>
							<th scope='col'>ID</th>
							<th scope='col'>Image</th>
							<th scope='col'>Title</th>
							<th scope='col'>Price</th>
							<th scope='col'>Uses</th>
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
					scData?.shopping_cart_by_user_id &&
					data?.shopping_cart_images_by_sc_id && (
						<span className='orderInfo'>
							{data?.shopping_cart_images_by_sc_id.length > 0 ? (
								<>Total: ${scData.shopping_cart_by_user_id.total_price}</>
							) : (
								<>No items in the shopping cart</>
							)}
						</span>
					)}
			</section>
		</>
	);
};
export default ShoppingCart;
