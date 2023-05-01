import { ThemeProvider } from '@mui/material';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaHistory } from 'react-icons/fa';
import '../scss/AddImageModal.scss';
import { theme } from '../style/themes';
import ActionButton from './ActionButton';
import VersionDetailsModal from './VersionDetailsModal';
import { useQuery } from '@apollo/client';
import { GET_TECHNICAL_METADATA } from '../queries/imageQueries';
import MetadataModal from './MetadataModal';

const VersionHistoryImageRow = ({ image }) => {
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

	const {
		data: tmData,
		error,
		loading,
	} = useQuery(GET_TECHNICAL_METADATA, {
		variables: { image_id: imgId },
	});

	return (
		<>
			<tr>
				<td>{imgId}</td>
				<td>{verNo}</td>
				<td className='w-50'>
					<img
						className='w-50'
						src={imgUrl || 'https://placehold.co/500x400'}
					/>
				</td>
				<td>
					<VersionDetailsModal image={image} />
				</td>
				<td>
					{tmData?.technical_metadata_by_image_id?.technical_metadata_id &&
						image?.image && (
							<MetadataModal
								metadata={tmData?.technical_metadata_by_image_id}
								image={image?.image}
							/>
						)}
				</td>
			</tr>
		</>
	);
};

export default React.memo(VersionHistoryImageRow);
