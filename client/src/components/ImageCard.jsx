import { useSelector } from 'react-redux';
import { StyledLink } from '../style/styledComponents/StyledLink';
import ActionButton from './ActionButton';

const ImageCard = ({ image }) => {
	const { image_id, title, price, uses, description, image_url } = image;
	const { user, isLoading, isError, isSuccess, message } = useSelector(
		state => state.auth
	);

	return (
		<div className='card h-100'>
			<StyledLink
				to={`/image/${image.image_id}`}
				key={image.image_id}
				className='w-100'
			>
				<img
					className='card-img-top'
					alt={image_id}
					src={image_url || 'https://placehold.co/500x400'}
				/>
				<div className='card-body'>
					<h5 className='card-title fs-4'>{title}</h5>
					<p className='card-text fs-6'>{description}</p>
				</div>
				<ul className='list-group list-group-flush'>
					<li className='list-group-item border-top'>Price: ${price}</li>
					{user?.me?.admin && (
						<li className='list-group-item border-bottom'>No. uses: {uses}</li>
					)}
				</ul>
				<div className='card-body d-flex align-items-end'>
					<ActionButton
						variant='outlined'
						color='primary'
						className='btn w-100 p-3'
					>
						Read more...
					</ActionButton>
				</div>
			</StyledLink>
		</div>
	);
};

export default ImageCard;
