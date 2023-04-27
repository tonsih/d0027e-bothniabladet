import { useCallback, useState } from 'react';
import OrderDetailsModal from './OrderDetailsModal';

const OrderHistoryRow = ({ order }) => {
	const { order_id, order_date, total_price } = order;

	const [show, setShow] = useState(false);

	const handleClose = useCallback(() => {
		setShow(false);
	});

	const handleShow = useCallback(() => setShow(true));

	const toggleShow = () => setShow(!show);

	return (
		<>
			<tr onClick={toggleShow}>
				<td className='w-25'>{order_id}</td>
				<td className='w-25'>{order_date}</td>
				<td className='w-25'>${total_price}</td>
				<td className='w-25'>
					<OrderDetailsModal
						order={order}
						handleShow={handleShow}
						handleClose={handleClose}
						show={show}
					/>
				</td>
			</tr>
		</>
	);
};
export default OrderHistoryRow;
