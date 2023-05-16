import { useLazyQuery } from '@apollo/client';
import { useMediaQuery } from '@mui/material';
import { memo, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import {
	FaCamera,
	FaCog,
	FaHome,
	FaImage,
	FaShoppingCart,
	FaSignInAlt,
	FaUser,
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { useLocation } from 'react-router-dom';
import { getMe, logout, reset } from '../features/auth/authSlice';
import { USER_SHOPPING_CART_IMAGES } from '../queries/shoppingCartQueries';
import '../scss/Header.scss';
import CategoriesButton from './CategoriesButton';

const Header = () => {
	const dispatch = useDispatch();
	const { user, isLoading, isError, isSuccess, message } = useSelector(
		state => state.auth
	);

	const [getScImgs, { data, loading }] = useLazyQuery(
		USER_SHOPPING_CART_IMAGES
	);

	const isXlScreenOrSmaller = useMediaQuery('(max-width:1199px)');

	const location = useLocation();

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

	const HeaderAlt = memo(() => {
		if (isLoading) return null;
		if (user) return <LoggedInHeader />;
		return <NotLoggedInHeader />;
	});

	const NotLoggedInHeader = () => (
		<>
			<ImageRequestNavItem />
			<LinkContainer to='/login'>
				<Nav.Link active={location.pathname === '/login'}>
					<FaSignInAlt />
					Login
				</Nav.Link>
			</LinkContainer>
			<LinkContainer to='/register'>
				<Nav.Link active={location.pathname === '/register'}>
					<FaUser />
					Register
				</Nav.Link>
			</LinkContainer>
		</>
	);

	const LoggedInHeader = props => (
		<>
			{!user?.me?.admin && <ImageRequestNavItem />}
			{data?.shopping_cart_images_by_sc_id && (
				<LinkContainer to='/cart'>
					<Nav.Link active={location.pathname === '/cart'}>
						<FaShoppingCart />
						{data.shopping_cart_images_by_sc_id.length}
					</Nav.Link>
				</LinkContainer>
			)}
			{user?.me?.admin && <AdminNavItem />}
			{user?.me && <UserDropdown />}
		</>
	);

	const UserDropdown = () => {
		const { email } = user?.me;

		return (
			<NavDropdown
				title={<span>{email}</span>}
				id={`offcanvasNavbarDropdown-expand-lg`}
			>
				<LinkContainer to='/profile'>
					<NavDropdown.Item>Profile</NavDropdown.Item>
				</LinkContainer>
				<LinkContainer to='/order-history'>
					<NavDropdown.Item>Order History</NavDropdown.Item>
				</LinkContainer>
				<LinkContainer
					to='/'
					onClick={async () => {
						dispatch(logout());
						dispatch(reset());
					}}
				>
					<NavDropdown.Item>Log out</NavDropdown.Item>
				</LinkContainer>
			</NavDropdown>
		);
	};

	const AdminNavItem = () => {
		const isActiveAdminNavItem = (navItemName = '') => {
			return location.pathname.startsWith(
				`/admin/${navItemName.toLowerCase()}`
			);
		};

		return (
			<NavDropdown
				title={
					<span className='admin-panel-title'>
						<FaCog /> AdminPanel
					</span>
				}
				id={`offcanvasNavbarDropdown-expand-lg`}
				active={isActiveAdminNavItem()}
			>
				<LinkContainer to='/admin/users'>
					<NavDropdown.Item active={isActiveAdminNavItem('users')}>
						Users
					</NavDropdown.Item>
				</LinkContainer>
				<LinkContainer to='/admin/images'>
					<NavDropdown.Item active={isActiveAdminNavItem('images')}>
						Images
					</NavDropdown.Item>
				</LinkContainer>
				<LinkContainer to='/admin/image-requests'>
					<NavDropdown.Item active={isActiveAdminNavItem('image-requests')}>
						Requested Images
					</NavDropdown.Item>
				</LinkContainer>
			</NavDropdown>
		);
	};

	const ImageRequestNavItem = () => {
		return (
			<LinkContainer to='/image-request'>
				<Nav.Link active={location.pathname === '/image-request'}>
					<FaImage />
					Image Request
				</Nav.Link>
			</LinkContainer>
		);
	};

	return (
		<>
			<Navbar
				key='lg'
				bg='dark'
				variant='dark'
				expand='xl'
				className={`mb-3 ${isXlScreenOrSmaller ? 'collapsed' : 'uncollapsed'}`}
				id='navbar'
				collapseOnSelect
			>
				<Container>
					<LinkContainer to='/' exact='true'>
						<div className='logo-container'>
							<Navbar.Brand href='#'>
								<FaCamera className='pr-3' />
								<span>Bothniabladet</span>
							</Navbar.Brand>
						</div>
					</LinkContainer>
					<Navbar.Toggle aria-controls={`responsive-navbar-nav`} />
					<Navbar.Collapse id={`responsive-navbar-nav`}>
						<Nav className='justify-content-end flex-grow-1'>
							<LinkContainer to='/' exact='true'>
								<Nav.Link active={location.pathname === '/'}>
									<FaHome />
									Home
								</Nav.Link>
							</LinkContainer>
							<CategoriesButton />
							<HeaderAlt />
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</>
	);
};
export default Header;
