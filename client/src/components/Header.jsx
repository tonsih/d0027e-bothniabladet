import { useLazyQuery } from '@apollo/client';
import { memo, useEffect } from 'react';
import {
	FaCamera,
	FaCog,
	FaHome,
	FaImage,
	FaShoppingCart,
	FaSignInAlt,
	FaSignOutAlt,
	FaUser,
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getMe, logout, reset } from '../features/auth/authSlice';
import { USER_SHOPPING_CART_IMAGES } from '../queries/shoppingCartQueries';
import '../scss/Header.scss';
import AdminButton from './AdminButton';
import CategoriesButton from './CategoriesButton';
import MenuButton from './MenuButton';
import UserMenu from './UserMenu';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { LinkContainer } from 'react-router-bootstrap';

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

	const HeaderAlt = memo(() => {
		if (isLoading) return null;
		if (user) return <LoggedInHeader />;
		return <NotLoggedInHeader />;
	});

	// const NotLoggedInHeader = () => (
	// 	<>
	// 		<li className='nav-item'>
	// 			<Link to='/login' className='nav-link'>
	// 				<MenuButton startIcon={<FaSignInAlt />}>Login</MenuButton>
	// 			</Link>
	// 		</li>
	// 		<li className='nav-item'>
	// 			<Link to='/register' className='nav-link'>
	// 				<MenuButton startIcon={<FaUser />}>Register</MenuButton>
	// 			</Link>
	// 		</li>
	// 	</>
	// );

	const NotLoggedInHeader = () => (
		<>
			<LinkContainer to='/login'>
				<Nav.Link>
					{/* <MenuButton startIcon={<FaSignInAlt />}>Login</MenuButton> */}
					<FaSignInAlt />
					Login
				</Nav.Link>
			</LinkContainer>
			<LinkContainer to='/register'>
				<Nav.Link>
					{/* <MenuButton startIcon={<FaUser />}>Register</MenuButton> */}
					<FaUser />
					Register
				</Nav.Link>
			</LinkContainer>
		</>
	);

	const LoggedInHeader = props => (
		<>
			{/* <UserMenu email={user?.me?.email} /> */}
			<UserDropdown />
			{user?.me?.admin && <AdminNavItem />}
			{data && (
				<LinkContainer to='/cart'>
					<Nav.Link>
						{/* <MenuButton startIcon={<FaShoppingCart />}> */}
						<FaShoppingCart />
						{data.shopping_cart_images_by_sc_id.length}
						{/* </MenuButton> */}
					</Nav.Link>
				</LinkContainer>
			)}
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
		return (
			<NavDropdown
				title={
					<span className='admin-panel-title'>
						<FaCog /> AdminPanel
					</span>
				}
				id={`offcanvasNavbarDropdown-expand-lg`}
			>
				<LinkContainer to='/admin/users'>
					<NavDropdown.Item>Users</NavDropdown.Item>
				</LinkContainer>
				<LinkContainer to='/admin/images'>
					<NavDropdown.Item>Images</NavDropdown.Item>
				</LinkContainer>
				<LinkContainer to='/admin/image-requests'>
					<NavDropdown.Item>Requested Images</NavDropdown.Item>
				</LinkContainer>
			</NavDropdown>
		);
	};

	return (
		<>
			<Navbar
				key='lg'
				bg='dark'
				variant='dark'
				expand='xl'
				className='mb-3'
				id='navbar'
				collapseOnSelect
			>
				<Container>
					<LinkContainer to='/'>
						<div className='logo-container'>
							<Navbar.Brand href='#'>
								<FaCamera className='pr-3' />
								<span>BothniaBladet</span>
							</Navbar.Brand>
						</div>
					</LinkContainer>
					<Navbar.Toggle aria-controls={`responsive-navbar-nav`} />
					<Navbar.Collapse id={`responsive-navbar-nav`}>
						{/* <Nav className='justify-content-end flex-grow-1 pe-3'> */}
						<Nav className='justify-content-end flex-grow-1'>
							<LinkContainer to='/'>
								<Nav.Link>
									<FaHome />
									Home
								</Nav.Link>
							</LinkContainer>
							<CategoriesButton />
							<HeaderAlt />
							{/* {!user?.me?.admin && (
								<LinkContainer to='/image-request'>
									<Nav.Link>
										<FaImage />
										Image Request
									</Nav.Link>
								</LinkContainer>
							)} */}
							<LinkContainer to='/image-request'>
								<Nav.Link>
									<FaImage />
									Image Request
								</Nav.Link>
							</LinkContainer>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</>
	);
};
export default Header;
