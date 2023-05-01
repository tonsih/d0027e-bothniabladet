import { Button, TextField, ThemeProvider } from '@mui/material';
import { Form, Formik, useField } from 'formik';
import { useEffect } from 'react';
import { FaSignInAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import YupPassword from 'yup-password';
import { login, reset } from '../features/auth/authSlice';
import { theme } from '../style/themes';
YupPassword(yup); // extend yup

const schema = yup.object({
	email: yup.string().required().min(0).max(50),
	password: yup.string().required(),
});

const Login = ({ client }) => {
	const navigate = useNavigate();

	const { user, isLoading, isSuccess, isError, message } = useSelector(
		state => state.auth
	);

	const dispatch = useDispatch();

	const MyTextField = ({ placeholder, label, type, ...props }) => {
		const [field, meta] = useField(props);
		const errorText = meta.error && meta.touched ? meta.error : '';

		return (
			<TextField
				{...field}
				error={!!errorText}
				helperText={errorText}
				placeholder={placeholder}
				label={label}
				type={type}
			/>
		);
	};

	useEffect(() => {
		return () => dispatch(reset());
	}, []);

	useEffect(() => {
		const effect = async () => {
			let path = localStorage.getItem('ref');
			path = await JSON.parse(path);

			if (isSuccess && user && !user.banned) {
				if (path) navigate(path);
				else navigate('/');
			}
		};

		effect();
	}, [user, isSuccess, navigate, reset]);

	useEffect(() => {
		return () => {
			localStorage.setItem('ref', null);
		};
	}, []);

	return (
		<>
			{isError && message?.error && (
				<div className='alert alert-danger' role='alert'>
					{message.error[0]}
				</div>
			)}
			{user?.banned && (
				<div className='alert alert-danger' role='alert'>
					This account is banned!
				</div>
			)}
			{isSuccess && !isError && message?.success && (
				<div className='alert alert-success' role='alert'>
					{message.success}
				</div>
			)}
			<section className='heading container-fluid mt-4 d-flex flex-column align-items-center'>
				<h1>
					<FaSignInAlt /> Login
				</h1>
			</section>
			<section className='form d-flex flex-column align-items-center justify-content-center container align-content-center'>
				<ThemeProvider theme={theme}>
					<Formik
						validationSchema={schema}
						initialValues={{ email: '', password: '' }}
						onSubmit={async (data, { setSubmitting }) => {
							setSubmitting(true);
							dispatch(login(data));
							setSubmitting(false);
						}}
					>
						{({ values, isSubmitting }) => (
							<Form className='d-flex flex-column w-50 mt-3 align-items-center'>
								<div className='textfield'>
									<MyTextField
										name='email'
										label='email'
										placeholder='email'
										type='input'
										as={TextField}
									/>
								</div>
								<div className='textfield'>
									<MyTextField
										name='password'
										label='password'
										placeholder='password'
										type='password'
										as={TextField}
									/>
								</div>
								<Button
									variant='outlined'
									color='primary'
									disabled={isSubmitting}
									type='submit'
									className='form-button w-25 p-2'
								>
									Login
								</Button>
							</Form>
						)}
					</Formik>
				</ThemeProvider>
			</section>
		</>
	);
};
export default Login;
