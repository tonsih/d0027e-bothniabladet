import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import Spinner from '../components/Spinner';
import { GET_IMAGE } from '../queries/imageQueries';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import ActionButton from '../components/ActionButton';
import { useSelector } from 'react-redux';
import { ADD_SHOPPING_CART_IMAGE } from '../mutations/shoppingCartMutations';
import {
	USER_SHOPPING_CART,
	USER_SHOPPING_CART_IMAGE,
	USER_SHOPPING_CART_IMAGES,
} from '../queries/shoppingCartQueries';
import { useEffect } from 'react';

const ImagePage = () => {
	const { image: image_id } = useParams();
	const { user } = useSelector(state => state.auth);
	const { error, loading, data } = useQuery(GET_IMAGE, {
		variables: { image_id },
	});

	const [getSci, { data: sciData }] = useLazyQuery(USER_SHOPPING_CART_IMAGE);

	useEffect(() => {
		if (image_id && user?.shopping_cart?.shopping_cart_id) {
			getSci({
				variables: {
					image_id,
					shopping_cart_id: user?.shopping_cart.shopping_cart_id,
				},
			});
		}
	}, [image_id, getSci, user]);

	const [addShoppingCartImage] = useMutation(ADD_SHOPPING_CART_IMAGE);

	const location = useLocation();
	const path = location.pathname;

	const navigate = useNavigate();

	if (error) return <p>Something went wrong</p>;
	if (loading) return <Spinner />;

	const onClickHandler = () => {
		localStorage.setItem('ref', JSON.stringify(path));
		navigate('/login');
	};

	const onAddToCart = (shoppingCartId, imageId, userId) => {
		addShoppingCartImage({
			variables: {
				shopping_cart_id: shoppingCartId,
				image_id: imageId,
				time_added: new Date().toISOString(),
			},
			refetchQueries: [
				{
					query: USER_SHOPPING_CART_IMAGES,
					variables: {
						shopping_cart_id: shoppingCartId,
					},
				},
				{
					query: USER_SHOPPING_CART,
					variables: {
						user_id: userId,
					},
				},
				{
					query: USER_SHOPPING_CART_IMAGE,
					variables: {
						image_id: imageId,
						shopping_cart_id: shoppingCartId,
					},
				},
			],
		});
	};

	const ButtonTextHolder = () => {
		if (user && sciData?.shopping_cart_image_by_image_id) {
			if (sciData?.shopping_cart_image_by_image_id?.length <= 0) {
				return (
					<>
						<FaShoppingCart className='mr-4' /> Add to Cart
					</>
				);
			} else {
				return <>Already in shopping cart</>;
			}
		}
		return <>Login to purchase</>;
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
							Go back to images
						</ActionButton>
					</Link>
					<div className='container mt-3'>
						<div className='row'>
							<div className='col-md-6 col-sm-12'>
								<img
									className='card-img'
									src={data.image.image_url || 'https://placehold.co/500x400'}
									alt=''
								/>
							</div>
							<div className='col-md-6 col-sm-12'>
								<h1 className='display-5 fw-bolder'>{data.image.title}</h1>
								<div className='fs-5 mb-5'>
									<span>${data.image.price}</span>
								</div>
								<p className='lead'>{data.image.description}</p>
								<div className='d-flex'>
									<ActionButton
										variant='outlined'
										color='primary'
										className='w-100 p-3'
										disabled={
											user &&
											sciData?.shopping_cart_image_by_image_id?.length > 0
										}
										{...(!user?.shopping_cart
											? { onClick: onClickHandler }
											: {
													onClick: () =>
														onAddToCart(
															user.shopping_cart.shopping_cart_id,
															data.image.image_id,
															user.me.user_id
														),
											  })}
									>
										<ButtonTextHolder />
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
export default ImagePage;
