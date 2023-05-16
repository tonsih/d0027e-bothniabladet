import { ThemeProvider } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout, reset } from '../features/auth/authSlice';
import { theme } from '../style/themes';
import MenuButton from './MenuButton';

export default function UserMenu({ email }) {
	const dispatch = useDispatch();

	return (
		<PopupState variant='popover' popupId='demo-popup-menu'>
			{popupState => (
				<React.Fragment>
					<ThemeProvider theme={theme}>
						<MenuButton
							variant='text'
							{...bindTrigger(popupState)}
							disableElevation
							sx={{ textTransform: 'lowercase' }}
						>
							{email}
						</MenuButton>
						<Menu {...bindMenu(popupState)}>
							<Link to={`/profile`}>
								<MenuItem onClick={popupState.close}>Profile</MenuItem>
							</Link>

							<Link to={`/order-history`}>
								<MenuItem onClick={popupState.close}>Order History</MenuItem>
							</Link>

							<Link to={`/`}>
								<MenuItem
									onClick={async () => {
										dispatch(logout());
										dispatch(reset());
										popupState.close();
									}}
								>
									Log out
								</MenuItem>
							</Link>
						</Menu>
					</ThemeProvider>
				</React.Fragment>
			)}
		</PopupState>
	);
}
