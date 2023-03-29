import { useQuery } from '@apollo/client';
import Spinner from '../components/Spinner';
import { GET_PRODUCT } from '../queries/productQueries';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import ActionButton from '../components/ActionButton';
import { useSelector } from 'react-redux';

const ProductPage = () => {
	const { product: product_id } = useParams();
	const { error, loading, data } = useQuery(GET_PRODUCT, {
		variables: { product_id },
	});

	const { user } = useSelector(state => state.auth);

	const location = useLocation();
	const path = location.pathname;

	const navigate = useNavigate();

	if (error) return <p>Something went wrong</p>;
	if (loading) return <Spinner />;

	const onClickHandler = () => {
		localStorage.setItem('ref', JSON.stringify(path));
		navigate('/login');
	};

	return (
		<>
			{!error && !loading && data && (
				<section>
					<Link to='/'>
						<ActionButton
							variant='outlined'
							color='primary'
							className='w-100 p-3'
						>
							Go back to store
						</ActionButton>
					</Link>
					<div className='container mt-3'>
						<div className='row'>
							<div className='col-md-6 col-sm-12'>
								<img
									className='card-img'
									src={data.product.img_url || 'https://placehold.co/500x400'}
									alt=''
								/>
							</div>
							<div className='col-md-6 col-sm-12'>
								<h1 className='display-5 fw-bolder'>{data.product.title}</h1>
								<div className='fs-5 mb-5'>
									<span>${data.product.price}</span>
								</div>
								<p className='lead'>{data.product.description}</p>
								<div className='d-flex'>
									<ActionButton
										variant='outlined'
										color='primary'
										className='w-100 p-3'
										{...(!user && { onClick: onClickHandler })}
									>
										{user ? (
											<>
												<FaShoppingCart className='mr-4' /> Add to Cart
											</>
										) : (
											<>Login to purchase</>
										)}
									</ActionButton>
								</div>
							</div>
						</div>
					</div>
				</section>
			)}
		</>
	);
};
export default ProductPage;
