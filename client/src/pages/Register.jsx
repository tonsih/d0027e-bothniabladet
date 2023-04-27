import { Button, TextField, ThemeProvider } from '@mui/material';
import { Form, Formik, useField } from 'formik';
import { useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import YupPassword from 'yup-password';
import Spinner from '../components/Spinner';
import { register, reset } from '../features/auth/authSlice';
import { theme } from '../style/themes';
YupPassword(yup);

const Register = () => {
	const schema = yup.object({
		first_name: yup.string().required().min(1).max(50),
		last_name: yup.string().required().min(1).max(50),
		email: yup.string().required().min(3).email().max(50),
		password: yup
			.string()
			.password()
			.required()
			.min(3)
			.max(50)
			.minUppercase(0)
			.minLowercase(0)
			.minSymbols(0)
			.minNumbers(0),
	});

	const navigate = useNavigate();

	const dispatch = useDispatch();

	const { user, isLoading, isError, isSuccess, message } = useSelector(
		state => state.auth
	);

	useEffect(() => {
		return () => dispatch(reset());
	}, []);

	useEffect(() => {
		if (isSuccess && user) {
			navigate('/');
		}
	}, [isSuccess, user]);

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

	if (isLoading) return <Spinner />;

	return (
		<>
			{isSuccess && !isError && message && message.success ? (
				<div className='alert alert-success' role='alert'>
					{message.success}
				</div>
			) : null}

			{isError && message && message.error ? (
				<div className='alert alert-danger' role='alert'>
					{message.error}
				</div>
			) : null}

			<section className='heading container-fluid mt-4 d-flex flex-column align-items-center'>
				<h1>
					<FaUser /> Register
				</h1>
				<p>Sign-up here</p>
			</section>
			<section className='form d-flex flex-column align-items-center justify-content-center container align-content-center'>
				<ThemeProvider theme={theme}>
					<Formik
						validationSchema={schema}
						initialValues={{
							first_name: '',
							last_name: '',
							email: '',
							password: '',
						}}
						onSubmit={async (data, { setSubmitting }) => {
							setSubmitting(true);
							dispatch(register(data));
							setSubmitting(false);
						}}
					>
						{({ values, isSubmitting }) => (
							<Form className='d-flex flex-column w-50 mt-3 align-items-center'>
								<div className='textfield'>
									<MyTextField
										name='first_name'
										label='first name'
										placeholder='first name'
										type='input'
										as={TextField}
									/>
								</div>
								<div className='textfield'>
									<MyTextField
										name='last_name'
										label='last name'
										placeholder='last name'
										type='input'
										as={TextField}
									/>
								</div>
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
									className='form-button w-50 p-2'
								>
									Register
								</Button>
							</Form>
						)}
					</Formik>
				</ThemeProvider>
			</section>
		</>
	);
};
export default Register;
