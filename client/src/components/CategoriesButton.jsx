import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { FaCog, FaList } from 'react-icons/fa';
import { ThemeProvider } from '@mui/material';
import { theme } from '../style/themes';
import { Link } from 'react-router-dom';
import MenuButton from './MenuButton';
import { useQuery } from '@apollo/client';
import { GET_IMAGE_TAGS } from '../queries/imageQueries';

export default function CategoriesButton() {
	const { data, loading, error } = useQuery(GET_IMAGE_TAGS);
	const categoriesSet = new Set();

	if (data?.image_tags) {
		data.image_tags.forEach(element => {
			categoriesSet.add(element.tag.name);
		});
	}

	const CategoryItems = ({ popupState }) => {
		if (categoriesSet && categoriesSet.size > 0) {
			return [...categoriesSet].map(category => {
				<Link to='/category/'>
					<MenuItem onClick={popupState.close}>{category}</MenuItem>
				</Link>;
			});
		}
	};

	return (
		<>
			<PopupState variant='popover' popupId='demo-popup-menu'>
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
											<MenuItem onClick={popupState.close}>{category}</MenuItem>
										</Link>
									))}
							</Menu>
						</ThemeProvider>
					</React.Fragment>
				)}
			</PopupState>
		</>
	);
}
