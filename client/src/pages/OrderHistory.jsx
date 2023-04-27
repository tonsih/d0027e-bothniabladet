import { useLazyQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { GET_USER_ORDERS } from '../queries/orderQueries';
import { useEffect, useState } from 'react';
import OrderHistoryRow from '../components/OrderHistoryRow';

const OrderHistory = () => {
	const { user, isLoading, isError, isSuccess, message } = useSelector(
		state => state.auth
	);

	const [getOrderData, { data: uoData }] = useLazyQuery(GET_USER_ORDERS);
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		if (user?.me?.user_id) {
			getOrderData();
		}
	}, [user]);

	useEffect(() => {
		if (uoData) {
			setOrders(uoData?.user_orders);
		}
	}, [uoData]);

	return (
		<section>
			<table className='table table-dark table-hover'>
				<thead>
					<tr>
						<th scope='col'>Order ID</th>
						<th scope='col'>Order Date</th>
						<th scope='col'>Total Price</th>
						<th scope='col'>View details</th>
					</tr>
				</thead>
				<tbody>
					{orders.length > 0 &&
						orders.map(order => (
							<OrderHistoryRow key={order?.order_id} order={order} />
						))}
					{/* // data.shopping_cart_images_by_sc_id.map(image => (
							// 	<ShoppingCartImageRow
							// 		image={image}
							// 		userId={user.me.user_id}
							// 		key={image.image.image_id}
							// 	/>
							// ))} */}
				</tbody>
			</table>
		</section>
	);
};
export default OrderHistory;
