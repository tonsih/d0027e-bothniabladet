import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaInfoCircle } from 'react-icons/fa';
import ActionButton from './ActionButton';
import ImageMap from './ImageMap';

const MetadataModal = ({ metadata, image }) => {
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
							let value = metadata[key];

							switch (key) {
								case 'coordinates':
								case 'technical_metadata_id':
								case '__typename':
									return null;
								case 'size':
									value = formatFileSize(value);
									break;
								case 'width':
								case 'height':
									value = `${value} pixels`;
									break;
							}

							if (value === 'last_modified' && Date.parse(value)) {
								value = new Date(value).toLocaleString('sv-SE', {
									timeZone: 'Europe/Stockholm',
								});
							}

							return (
								<div className='metadata_attribute d-flex' key={key}>
									<p>
										<strong>{key}:&nbsp;</strong>
									</p>
									<p>{value}</p>
								</div>
							);
						})}
					{metadata && metadata.coordinates && (
						<ImageMap coordinates={metadata.coordinates} image={image} />
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
