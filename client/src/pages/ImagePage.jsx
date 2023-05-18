import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import moment from 'moment-timezone';
import { useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import ActionButton from '../components/ActionButton';
import Spinner from '../components/Spinner';
import { ADD_SHOPPING_CART_IMAGE } from '../mutations/shoppingCartMutations';
import { GET_IMAGE } from '../queries/imageQueries';
import {
	USER_SHOPPING_CART,
	USER_SHOPPING_CART_IMAGE,
	USER_SHOPPING_CART_IMAGES,
} from '../queries/shoppingCartQueries';

const ImagePage = () => {
	const { image: image_id } = useParams();
	const { user } = useSelector(state => state.auth);
	const { error, loading, data } = useQuery(GET_IMAGE, {
		variables: { image_id },
	});

	const [getSci, { data: sciData }] = useLazyQuery(USER_SHOPPING_CART_IMAGE);

	useEffect(() => {
		const getSciFunc = async () => {
			await getSci({
				variables: {
					image_ids: image_id,
					shopping_cart_id: user?.shopping_cart?.shopping_cart_id,
				},
			});
		};

		if (image_id && user?.shopping_cart?.shopping_cart_id) {
			getSciFunc();
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
				time_added: moment().tz('Europe/Stockholm'),
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
						image_ids: imageId,
						shopping_cart_id: shoppingCartId,
					},
				},
			],
		});
	};

	const ButtonTextHolder = () => {
		if (user && sciData?.shopping_cart_image_by_image_ids) {
			if (sciData?.shopping_cart_image_by_image_ids?.length <= 0) {
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
			{!error &&
				!loading &&
				data &&
				data?.image(
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
										src={data?.image?.image_url}
										alt=''
									/>
								</div>
								<div className='col-md-6 col-sm-12'>
									<h1 className='display-5 fw-bolder'>{data?.image?.title}</h1>
									<div className='fs-5 mb-5'>
										<span>${data?.image?.price}</span>
									</div>
									<p className='lead'>{data?.image?.description}</p>
									<div className='d-flex'>
										<ActionButton
											variant='outlined'
											color='primary'
											className='w-100 p-3'
											disabled={
												user &&
												sciData?.shopping_cart_image_by_image_ids?.length > 0
											}
											{...(!user?.shopping_cart
												? { onClick: onClickHandler }
												: {
														onClick: () =>
															onAddToCart(
																user?.shopping_cart?.shopping_cart_id,
																data?.image?.image_id,
																user?.me?.user_id
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
