import {
	FaStore,
	FaSignInAlt,
	FaSignOutAlt,
	FaUser,
	FaShoppingCart,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import MenuButton from './MenuButton';
import { useDispatch, useSelector } from 'react-redux';
import { getMe, logout, reset } from '../features/auth/authSlice';
import { memo, useEffect } from 'react';
import '../scss/Header.scss';
import { USER_SHOPPING_CART_IMAGES } from '../queries/shoppingCartQueries';
import { useLazyQuery, useQuery } from '@apollo/client';
import AdminButton from './AdminButton';
import CategoriesButton from './CategoriesButton';

const Header = () => {
	const dispatch = useDispatch();
	const { user, isLoading, isError, isSuccess, message } = useSelector(
		state => state.auth
	);

	const [getScImgs, { data, loading }] = useLazyQuery(
		USER_SHOPPING_CART_IMAGES
	);

	useEffect(() => {
		if (user?.shopping_cart)
			getScImgs({
				variables: { shopping_cart_id: user.shopping_cart.shopping_cart_id },
			});
	}, [user]);

	useEffect(() => {
		dispatch(getMe());
		dispatch(reset());
	}, [dispatch, getMe, reset]);

	useEffect(() => {
		if (isSuccess) {
			dispatch(reset());
		}
	}, [isSuccess, dispatch, reset]);

	useEffect(() => {
		if (user?.me?.banned) {
			dispatch(logout());
		}
	}, [user, dispatch, logout]);

	const UserLinks = memo(() => {
		if (isLoading) return null;
		if (user) return <LoggedInHeader />;
		return <NotLoggedInHeader />;
	});

	const NotLoggedInHeader = () => (
		<>
			<li className='nav-item'>
				<Link to='/login' className='nav-link'>
					<MenuButton startIcon={<FaSignInAlt />}>Login</MenuButton>
				</Link>
			</li>
			<li className='nav-item'>
				<Link to='/register' className='nav-link'>
					<MenuButton startIcon={<FaUser />}>Register</MenuButton>
				</Link>
			</li>
		</>
	);

	const LoggedInHeader = props => (
		<>
			{user?.me?.admin && (
				<li className='nav-item'>
					<AdminButton />
				</li>
			)}
			<li className='nav-item'>
				<CategoriesButton />
			</li>
			<li className='nav-item'>
				<MenuButton
					onClick={async () => {
						dispatch(logout());
						dispatch(reset());
					}}
					startIcon={<FaSignOutAlt />}
				>
					Logout
				</MenuButton>
			</li>
			{data && (
				<Link to='/cart'>
					<li className='nav-item'>
						<MenuButton startIcon={<FaShoppingCart />}>
							{data.shopping_cart_images_by_sc_id.length}
						</MenuButton>
					</li>
				</Link>
			)}
			<li className='nav-item'>
				<MenuButton sx={{ textTransform: 'lowercase' }}>
					{user?.me?.email}
				</MenuButton>
			</li>
		</>
	);

	return (
		<header className='header'>
			<nav className='navbar navbar-dark'>
				<div className='container'>
					<Link to='/' className='navbar-brand'>
						<div className='d-flex align-items-center'>
							<FaStore className='pr-3' />
							<div className='logo-text'>BothniaBladet</div>
						</div>
					</Link>
					<ul className='nav navbar-nav ml-auto d-flex flex-row align-items-center justify-content-between'>
						<UserLinks />
					</ul>
				</div>
			</nav>
		</header>
	);
};
export default Header;
