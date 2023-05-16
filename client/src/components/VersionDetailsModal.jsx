import { ThemeProvider } from '@mui/material';
import _ from 'lodash';
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FaCheckCircle, FaEye, FaRegTimesCircle } from 'react-icons/fa';
import { theme } from '../style/themes';
import ActionButton from './ActionButton';

const VersionDetailsModal = ({ image }) => {
	const {
		image_id: imgId,
		title: imgTitle,
		price: imgPrice,
		uses: imgUses,
		image_url: imgUrl,
		description: imgDescription,
		distributable: imgDistributable,
		journalist: imgJournalist,
	} = image?.image;

	const { version_no: verNo } = image;

	const [show, setShow] = useState(false);

	const handleClose = () => {
		setShow(false);
	};
	const handleShow = () => setShow(true);

	const InfoItem = ({ children }) => {
		return <div className='metadata_attribute d-flex'>{children}</div>;
	};

	const keyOrder = [
		'image_id',
		'title',
		'price',
		'distributable',
		'uses',
		'description',
		'journalist',
	];

	return (
		<>
			<ActionButton
				variant='outlined'
				color='primary'
				className='btn p-2'
				onClick={handleShow}
			>
				<FaEye />
			</ActionButton>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Image Details</Modal.Title>
				</Modal.Header>
				<Modal.Body className='d-flex justify-content-center flex-column'>
					<ThemeProvider theme={theme}>
						{image &&
							Object.keys(image?.image)
								.sort((a, b) => keyOrder.indexOf(a) - keyOrder.indexOf(b))
								.map(key => {
									const { image: img } = image;
									let value = img[key];

									if (
										_.isNil(value) ||
										(!_.isNumber(value) && _.isEmpty(value))
									)
										value = '-';

									switch (key) {
										case '__typename':
										case 'deleted':
											return null;
										case 'distributable':
											return (
												<InfoItem key={key}>
													<p>
														<strong>{key}:&nbsp;</strong>
													</p>
													<p>
														{value ? <FaCheckCircle /> : <FaRegTimesCircle />}
													</p>
												</InfoItem>
											);
										case 'image_url':
											if (imgUrl) {
												return (
													<InfoItem key={key}>
														<img
															src={imgUrl}
															className='img-thumbnail'
															alt='thumbnail'
														/>
													</InfoItem>
												);
											}
											return null;
									}

									return (
										<InfoItem key={key}>
											<p>
												<strong>{key}:&nbsp;</strong>
											</p>
											<p>{value}</p>
										</InfoItem>
									);
								})}
						<Modal.Footer>
							<Button variant='secondary' onClick={handleClose}>
								Close
							</Button>
						</Modal.Footer>
					</ThemeProvider>
				</Modal.Body>
			</Modal>
		</>
	);
};
export default VersionDetailsModal;
