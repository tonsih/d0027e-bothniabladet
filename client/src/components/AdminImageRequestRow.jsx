import { FaPlusCircle, FaTrash } from 'react-icons/fa';
import ActionButton from './ActionButton';
import { handleDeleteButtonClick } from './AdminImageRequestCard';
import { useMutation } from '@apollo/client';
import { DELETE_REQUESTED_IMAGE } from '../mutations/imageMutations';
import AddImageModal from './AddImageModal';
import { useMediaQuery, useTheme } from '@mui/material';
import '../scss/Buttons.scss';

const AdminImageRequestRow = ({ requestedImage }) => {
	const {
		requested_image_id,
		title,
		description,
		email,
		journalist,
		image_url,
	} = requestedImage;

	const [deleteRequestedImage] = useMutation(DELETE_REQUESTED_IMAGE);

	const theme = useTheme();
	const isMdWidth = useMediaQuery(theme.breakpoints.down('md'));
	const isMax992 = useMediaQuery('(max-width:992px)');

	return (
		<>
			<tr>
				<th scope='row'>{requested_image_id}</th>
				<td className='w-25'>
					<img
						className='w-75'
						src={image_url || 'https://placehold.co/500x400?text=No+Image'}
					/>
				</td>
				<td>{title}</td>
				<td>{description}</td>
				<td>{email}</td>
				<td>{journalist || '\u2014'}</td>
				<td>
					<AddImageModal
						adminImageCard={isMax992}
						id={`add-image-button${isMax992 && '-992px'}`}
						ButtonInnerComponent={FaPlusCircle}
						image={requestedImage}
					/>
				</td>
				<td>
					<ActionButton
						variant='outlined'
						color='secondary'
						className='btn delete-image-button'
						onClick={() =>
							handleDeleteButtonClick(requested_image_id, deleteRequestedImage)
						}
					>
						<h6 className='p-0 m-0'>
							<FaTrash />
						</h6>
					</ActionButton>
				</td>
			</tr>
		</>
	);
};
export default AdminImageRequestRow;
