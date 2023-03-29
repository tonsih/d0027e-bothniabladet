import { FaEdit, FaTrash } from 'react-icons/fa';
import ActionButton from './ActionButton';

const ImageRow = ({ image }) => {
	const { image_id, image_url, title, price, uses, description } = image;
	return (
		<>
			<tr>
				<th scope='row'>{image_id}</th>
				<td className='w-25'>
					<img
						className='w-75'
						src={image_url || 'https://placehold.co/500x400'}
					/>
				</td>
				<td>{title}</td>
				<td>${price}</td>
				<td>{uses}</td>
				<td>{description}</td>
				<td>
					<ActionButton variant='contained' color='secondary' className='btn'>
						<h6 className='p-0 m-0'>
							<FaEdit />
						</h6>
					</ActionButton>
				</td>
				<td>
					<ActionButton variant='contained' color='secondary' className='btn'>
						<h6 className='p-0 m-0'>
							<FaTrash />
						</h6>
					</ActionButton>
				</td>
			</tr>
		</>
	);
};
export default ImageRow;
