import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaInfoCircle, FaPlus } from 'react-icons/fa';
import ActionButton from './ActionButton';
import { useQuery } from '@apollo/client';
import { GET_TECHNICAL_METADATA } from '../queries/imageQueries';
import ImageMap from './ImageMap';

const MetadataModal = ({ metadata }) => {
	const [show, setShow] = useState(false);

	const handleClose = () => {
		setShow(false);
	};
	const handleShow = () => setShow(true);

	const formatFileSize = sizeInBytes => {
		const KB = 1024;
		const MB = KB * 1024;
		if (sizeInBytes >= MB) {
			return `${(sizeInBytes / MB).toFixed(2)} MB`;
		} else if (sizeInBytes >= KB) {
			return `${(sizeInBytes / KB).toFixed(2)} KB`;
		} else {
			return `${sizeInBytes} bytes`;
		}
	};

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

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Metadata</Modal.Title>
				</Modal.Header>
				<Modal.Body className='d-flex justify-content-center flex-column'>
					{metadata &&
						Object.keys(metadata).map(key => {
							if (key !== '__typename') {
								let value = metadata[key];
								if (Date.parse(value)) {
									value = new Date(value).toLocaleString('sv-SE', {
										timeZone: 'Europe/Stockholm',
									});
								}

								if (key === 'coordinates' || key === 'technical_metadata_id') {
									return null;
								} else if (key === 'size') {
									value = formatFileSize(value);
								}

								return (
									<div className='metadata_attribute d-flex' key={key}>
										<p>
											<strong>{key}:&nbsp;</strong>
										</p>
										<p>{value}</p>
									</div>
								);
							}
						})}
					{metadata && metadata.coordinates && (
						<ImageMap coordinates={metadata.coordinates} />
					)}

					<Modal.Footer>
						<Button variant='secondary' onClick={handleClose}>
							Close
						</Button>
					</Modal.Footer>
				</Modal.Body>
			</Modal>
		</>
	);
};
export default MetadataModal;
