import { Button, ThemeProvider } from '@mui/material';
import { theme } from '../style/themes';

const MenuButton = ({
	variant,
	color,
	className,
	children,
	onClick,
	disabled,
	startIcon,
	endIcon,
	sx,
}) => {
	return (
		<ThemeProvider theme={theme}>
			<Button
				variant={variant}
				color={color}
				className={className}
				onClick={onClick}
				disabled={disabled}
				startIcon={startIcon}
				endIcon={endIcon}
				sx={{ ...sx, backgroundColor: 'transparent' }}
			>
				{children}
			</Button>
		</ThemeProvider>
	);
};
export default MenuButton;
