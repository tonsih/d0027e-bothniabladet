import { useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { GET_ORDER, GET_ORDER_IMAGES } from '../queries/orderQueries';
import OrderImageRow from '../components/OrderImageRow';

const OrderConfirmation = () => {
	const { order: order_id } = useParams();
	const { user } = useSelector(state => state.auth);
	const {
		error: oError,
		loading: oLoading,
		data: oData,
	} = useQuery(GET_ORDER, {
		variables: { order_id },
	});

	const {
		error: oiError,
		loading: oiLoading,
		data: oiData,
	} = useQuery(GET_ORDER_IMAGES, {
		variables: { order_id },
	});

	return (
		<>
			<section>
				<h1>Order confirmed</h1>
				<h4>Order details</h4>
				<table className='table table-dark table-hover'>
					<thead>
						<tr>
							<th scope='col'>ID</th>
							<th scope='col'>Image</th>
							<th scope='col'>Title</th>
							<th scope='col'>Price</th>
							<th scope='col'>Description</th>
						</tr>
					</thead>
					<tbody>
						{user?.me?.user_id === oData?.order?.user?.user_id &&
							oiData?.order_images_by_order_id &&
							oiData.order_images_by_order_id.map(image => (
								<OrderImageRow image={image} key={image.image.image_id} />
							))}
					</tbody>
				</table>
				<span className='order_price'>
					Total price: $
					{oData?.order?.total_price > 0 && oData?.order?.total_price}
				</span>
			</section>
		</>
	);
};
export default OrderConfirmation;
