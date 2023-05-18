import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import {
	FaCheckCircle,
	FaHistory,
	FaTimesCircle,
	FaTrash,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { DELETE_IMAGE } from '../mutations/imageMutations';
import {
	GET_IMAGE_TAGS_BY_IMAGE_ID,
	GET_TECHNICAL_METADATA,
} from '../queries/imageQueries';
import '../scss/AdminImageCard.scss';
import ActionButton from './ActionButton';
import { handleDeleteButtonClick } from './AdminImageRow';
import EditImageModal from './EditImageModal';
import MetadataModal from './MetadataModal';

const AdminImageCard = ({ image }) => {
	const {
		image_id,
		image_url,
		title,
		price,
		uses,
		description,
		journalist,
		distributable,
	} = image;
	const [deleteImage] = useMutation(DELETE_IMAGE, {
		// refetchQueries: [
		// 	{ query: GET_LATEST_VERSION_IMAGES },
		// 	{ query: GET_IMAGE_TAGS },
		// ],
	});

	const { user, isLoading, isError, isSuccess, message } = useSelector(
		state => state.auth
	);

	const [imgTagNames, setImgTagNames] = useState([]);

	const {
		data: tmData,
		error,
		loading,
	} = useQuery(GET_TECHNICAL_METADATA, {
		variables: { image_id },
	});

	const [getITBIData, { data: itbiData }] = useLazyQuery(
		GET_IMAGE_TAGS_BY_IMAGE_ID
	);

	useEffect(() => {
		const getITBIDataFunc = async () => {
			await getITBIData({
				variables: {
					image_id,
				},
			});
		};

		if (image_id) {
			getITBIDataFunc();
		}
	}, [image_id]);

	useEffect(() => {
		if (itbiData?.image_tags_by_image_id) {
			for (let imgTag of itbiData?.image_tags_by_image_id) {
				const { name: imgTagName } = imgTag?.tag;
				setImgTagNames([...imgTagNames, imgTagName]);
			}
		}
	}, [itbiData?.image_tags_by_image_id]);

	return (
		<>
			<div className='card h-100'>
				<img className='card-img-top' alt={image_id} src={image_url} />
				<div className='card-body'>
					<h5 className='card-title fs-4'>{title}</h5>
					<p className='card-text fs-6'>{description}</p>
				</div>
				<ul className='list-group list-group-flush'>
					<li className='list-group-item border-top'>ID: {image_id}</li>
					<li className='list-group-item border-top'>Price: ${price}</li>
					<li className='list-group-item border-bottom'>
						Distributable:{' '}
						{distributable ? <FaCheckCircle /> : <FaTimesCircle />}
					</li>
					<li className='list-group-item border-bottom'>No. uses: {uses}</li>
					<li className='list-group-item border-bottom'>
						Journalist: {journalist || '\u2014'}
					</li>
				</ul>

				{tmData?.technical_metadata_by_image_id?.technical_metadata_id && (
					<div className='card-body d-flex align-items-end'>
						<MetadataModal
							metadata={tmData?.technical_metadata_by_image_id}
							image={image}
							adminImageCard={true}
						/>
					</div>
				)}

				<div className='card-body d-flex align-items-end'>
					<Link to={`/version-history/${image_id}`} className='w-100'>
						<ActionButton
							variant='outlined'
							color='primary'
							className='btn w-100 p-3'
							startIcon={<FaHistory />}
						>
							Version history
						</ActionButton>
					</Link>
				</div>

				<div className='card-body d-flex align-items-end'>
					<EditImageModal imageToEdit={image} adminImageCard={true} />
				</div>

				<div className='card-body d-flex align-items-end'>
					<ActionButton
						variant='outlined'
						color='secondary'
						className='btn delete-image-button w-100 p-3'
						startIcon={<FaTrash />}
						onClick={() =>
							handleDeleteButtonClick(imgTagNames, user, image_id, deleteImage)
						}
					>
						Delete image
					</ActionButton>
				</div>

				{/* </StyledLink> */}
			</div>
		</>
	);
};
export default AdminImageCard;
