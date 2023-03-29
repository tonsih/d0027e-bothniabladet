import { Button, ThemeProvider } from '@mui/material';
import { FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { theme } from '../style/themes';

const NotFound = () => {
	return (
		<>
			<div className='d-flex flex-column justify-content-center align-items-center mt-5'>
				<FaExclamationTriangle className='text-danger' size='5em' />
				<h1>404</h1>
				<p className='"lead'>Sorry, this page does not exist.</p>
				<Link to='/'>
					<ThemeProvider theme={theme}>
						<Button
							variant='outlined'
							color='primary'
							className='btn btn-md btn-primary w-100 p-3'
						>
							Go back to the homepage
						</Button>
					</ThemeProvider>
				</Link>
			</div>
		</>
	);
};
export default NotFound;
