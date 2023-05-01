import { FaTrash } from 'react-icons/fa';
import ActionButton from './ActionButton';

const AdminImageRequestRow = ({ requestedImage }) => {
	const {
		requested_image_id,
		title,
		description,
		email,
		journalist,
		image_url,
	} = requestedImage;

	return (
		<>
			<tr>
				<th scope='row'>{requested_image_id}</th>
				<td className='w-25'>
					<img
						className='w-75'
						src={image_url || 'https://placehold.co/500x400'}
					/>
				</td>
				<td>{title}</td>
				<td>{description}</td>
				<td>{email}</td>
				<td>{journalist || '\u2014'}</td>
				<td>asdda</td>
				<td>
					<ActionButton
						variant='contained'
						color='secondary'
						className='btn'
						onClick={async () => {
							try {
							} catch (error) {
								console.log(error);
							}
						}}
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
