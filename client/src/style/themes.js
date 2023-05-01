import { createTheme, responsiveFontSizes } from '@mui/material';

let theme = createTheme({
	palette: {
		primary: {
			main: '#2980b9',
			dark: '#345F20',
		},
		secondary: {
			danger: '#494c7d',
			main: '#c0392b',
		},
		green: {
			main: '#16a085',
		},
	},
	typography: {
		fontFamily: [
			'Poppins',
			'Segoe UI',
			'Roboto',
			'Oxygen',
			'Ubuntu',
			'Cantarell',
			'Fira Sans',
			'Droid Sans',
			'Helvetica Neue',
		].join(','),
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					backgroundColor: '#2c3e50',
					fontFamily: 'Poppins',
					color: 'white',
					borderColor: '#2c3e50',
				},
				outlined: {},
				text: {
					fontFamily: 'Poppins',
					textTransform: 'capitalize',
					color: 'white',
				},
			},
		},
		MuiCheckbox: {
			styleOverrides: {
				root: {
					color: 'white',
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundColor: '#171a1d',
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					color: 'white !important',
					backgroundColor: '#00000026',
					'&:hover .MuiOutlinedInput-notchedOutline': {
						borderColor: '#2980b9 !important',
					},
				},
				notchedOutline: {
					borderColor: 'white',
				},
			},
		},
		MuiMenuItem: {
			styleOverrides: {
				root: {
					color: 'white',
					fontSize: '0.9em',
					'&:hover': {
						backgroundColor: '#22262b',
						color: '#7e8c9a',
					},
				},
			},
		},
		MuiFormLabel: {
			styleOverrides: {
				root: {
					color: '#ffffff80 !important',
				},
			},
		},
	},
});

theme = responsiveFontSizes(theme);

export { theme };
