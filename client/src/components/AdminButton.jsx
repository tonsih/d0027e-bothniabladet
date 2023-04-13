import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { FaCog } from 'react-icons/fa';
import { ThemeProvider } from '@mui/material';
import { theme } from '../style/themes';
import { Link } from 'react-router-dom';
import MenuButton from './MenuButton';

export default function AdminButton() {
	return (
		<PopupState variant='popover' popupId='demo-popup-menu'>
			{popupState => (
				<React.Fragment>
					<ThemeProvider theme={theme}>
						<MenuButton
							variant='text'
							{...bindTrigger(popupState)}
							disableElevation
							startIcon={<FaCog />}
						>
							AdminPanel
						</MenuButton>
						<Menu {...bindMenu(popupState)}>
							<Link to='/admin/users'>
								<MenuItem onClick={popupState.close}>Users</MenuItem>
							</Link>

							<Link to='/admin/images'>
								<MenuItem onClick={popupState.close}>Images</MenuItem>
							</Link>
						</Menu>
					</ThemeProvider>
				</React.Fragment>
			)}
		</PopupState>
	);
}
