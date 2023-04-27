import { Button, ThemeProvider } from '@mui/material';
import { theme } from '../style/themes';

const ActionButton = ({
	variant,
	color,
	className,
	children,
	onClick,
	disabled,
	startIcon,
	endIcon,
	type,
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
				type={type}
			>
				{children}
			</Button>
		</ThemeProvider>
	);
};
export default ActionButton;
