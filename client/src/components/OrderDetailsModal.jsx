import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { FaInfoCircle } from 'react-icons/fa';
import { GET_ORDER_IMAGES } from '../queries/orderQueries';
import '../scss/OrderDetailsModal.scss';
import ActionButton from './ActionButton';
import OrderImageRow from './OrderImageRow';

const OrderDetailsModal = ({ order, show, handleClose, handleShow }) => {
	const [orderImages, setOrderImages] = useState([]);

	const { order_id } = order || {};

	const [getOIData, { data: oiData }] = useLazyQuery(GET_ORDER_IMAGES);

	useEffect(() => {
		if (order_id && show) {
			getOIData({
				variables: {
					order_id,
				},
			});
		}
	}, [order_id, show]);

	useEffect(() => {
		if (oiData && show) {
			setOrderImages(oiData);
		}
	}, [oiData]);

	return (
		<>
			<ActionButton
				variant='contained'
				color='green'
				className='btn p-2'
				onClick={handleShow}
			>
				<FaInfoCircle />
			</ActionButton>

			<Modal show={show} onHide={handleClose} className='modal-order-details'>
				<Modal.Header closeButton>
					<Modal.Title>Order details</Modal.Title>
				</Modal.Header>
				<Modal.Body className='d-flex justify-content-center flex-column'>
					<section className='table-responsive'>
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
								{orderImages?.order_images_by_order_id?.map(image => (
									<OrderImageRow image={image} key={image.image.image_id} />
								))}
							</tbody>
						</table>
					</section>
					<Modal.Footer>
						<ActionButton variant='secondary' onClick={handleClose}>
							Close
						</ActionButton>
					</Modal.Footer>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default OrderDetailsModal;
