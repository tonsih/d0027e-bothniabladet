import { useQuery } from '@apollo/client';
import { ThemeProvider } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import * as React from 'react';
import { FaList } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { GET_IMAGE_TAGS } from '../queries/imageQueries';
import { theme } from '../style/themes';
import MenuButton from './MenuButton';
import { LinkContainer } from 'react-router-bootstrap';
import { NavDropdown } from 'react-bootstrap';

export default function CategoriesButton() {
	const { data, loading, error } = useQuery(GET_IMAGE_TAGS);
	const categoriesSet = new Set();

	if (data?.image_tags) {
		data.image_tags.forEach(element => {
			const { image, tag } = element;
			const { name: tagName } = tag || {};
			const { uses, distributable, deleted } = image || {};
			if (uses > 0 && distributable && !deleted) categoriesSet.add(tagName);
		});
	}

	// 	const AdminNavItem = () => {
	// 	return (
	// 		<NavDropdown
	// 			title={
	// 				<span className='admin-panel-title'>
	// 					<FaCog /> AdminPanel
	// 				</span>
	// 			}
	// 			id={`offcanvasNavbarDropdown-expand-lg`}
	// 		>
	// 			<LinkContainer to='/admin/users'>
	// 				<NavDropdown.Item>Users</NavDropdown.Item>
	// 			</LinkContainer>
	// 			<LinkContainer to='/admin/images'>
	// 				<NavDropdown.Item>Images</NavDropdown.Item>
	// 			</LinkContainer>
	// 		</NavDropdown>
	// 	);
	// };

	return (
		categoriesSet.size > 0 && (
			<>
				<NavDropdown
					title={
						<span className='categies-menu-title'>
							<FaList /> Categories
						</span>
					}
					id={`offcanvasNavbarDropdown-expand-lg`}
				>
					{categoriesSet &&
						categoriesSet.size > 0 &&
						[...categoriesSet].map(category => (
							<LinkContainer
								key={category}
								to={`/category/${category.toLowerCase()}`}
							>
								<NavDropdown.Item>{category}</NavDropdown.Item>
							</LinkContainer>
						))}
				</NavDropdown>

				{/* <PopupState variant='popover' popupId='demo-popup-menu'>
					{popupState => (
						<React.Fragment>
							<ThemeProvider theme={theme}>
								<MenuButton
									variant='text'
									{...bindTrigger(popupState)}
									disableElevation
									startIcon={<FaList />}
								>
									Categories
								</MenuButton>
								<Menu {...bindMenu(popupState)}>
									{categoriesSet &&
										categoriesSet.size > 0 &&
										[...categoriesSet].map(category => (
											<Link
												key={category}
												to={`/category/${category.toLowerCase()}`}
											>
												<MenuItem onClick={popupState.close}>
													{category}
												</MenuItem>
											</Link>
										))}
								</Menu>
							</ThemeProvider>
						</React.Fragment>
					)}
				</PopupState> */}
			</>
		)
	);
}
