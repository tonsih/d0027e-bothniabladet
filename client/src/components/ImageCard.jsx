import { StyledLink } from '../style/styledComponents/StyledLink';
import ActionButton from './ActionButton';

const ProductCard = ({ product }) => {
	const { product_id, title, price, amount, description, img_url } = product;
	return (
		<div className='card h-100'>
			<StyledLink
				to={`/product/${product.product_id}`}
				key={product.product_id}
				className='w-100'
			>
				<img
					className='card-img-top'
					alt={product_id}
					src={img_url || 'https://placehold.co/500x400'}
				></img>
				<div className='card-body'>
					<h5 className='card-title fs-4'>{title}</h5>
					<p className='card-text fs-6'>{description}</p>
				</div>
				<ul className='list-group list-group-flush'>
					<li className='list-group-item border-top'>Price: ${price}</li>
					<li className='list-group-item border-bottom'>
						Amount in store: {amount}
					</li>
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

export default ProductCard;
