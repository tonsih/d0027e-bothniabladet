import { useLazyQuery, useMutation } from '@apollo/client';
import { Button, Checkbox, TextField, ThemeProvider } from '@mui/material';
import { Form, Formik, useField } from 'formik';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import { UPDATE_USER } from '../mutations/userMutations';
import { USERS_QUERY, USER_QUERY } from '../queries/userQueries';
import { theme } from '../style/themes';

const schema = yup.object({
	first_name: yup.string().required('first name is required').min(1).max(15),
	last_name: yup.string().required('last name is required').min(1).max(15),
	email: yup.string().min(5).max(50).required('email is required'),
});

const MyTextField = ({
	placeholder,
	label,
	type,
	multiline,
	rows,
	className,
	autoComplete,
	disabled,
	...props
}) => {
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
			multiline={multiline}
			rows={rows}
			className={className}
			autoComplete={autoComplete}
			disabled={disabled}
		/>
	);
};

const UserProfile = () => {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [admin, setAdmin] = useState(false);

	const { user, isLoading, isError, isSuccess, message } = useSelector(
		state => state.auth
	);

	const [getUserData, { data: usrData }] = useLazyQuery(USER_QUERY);

	const [updateUser] = useMutation(UPDATE_USER);

	const AdminIcon = () => {
		return admin ? <FaCheckCircle /> : null;
	};

	useEffect(() => {
		if (user?.me?.user_id) {
			getUserData({
				variables: {
					user_id: user?.me?.user_id,
				},
			});
		}
	}, [user?.me?.user_id]);

	useEffect(() => {
		if (usrData?.user) {
			const { first_name, last_name, email, admin } = usrData?.user;
			setFirstName(first_name);
			setLastName(last_name);
			setEmail(email);
			setAdmin(admin);
		}
	}, [usrData?.user]);

	return (
		<>
			<h1>User profile</h1>
			{firstName && lastName && email && admin && (
				<ThemeProvider theme={theme}>
					<section className='profile-section d-flex'>
						<Formik
							validationSchema={schema}
							initialValues={{
								first_name: firstName || '',
								last_name: lastName || '',
								email: email || '',
								admin: admin ? <FaCheckCircle /> : '',
								new_password: '',
							}}
							onSubmit={async (data, { setSubmitting }) => {
								setSubmitting(true);
								const { first_name, last_name, new_password } = data;
								try {
									await updateUser({
										variables: {
											user_id: user?.me?.user_id,
											first_name,
											last_name,
											password: !_.isEmpty(new_password) ? new_password : null,
										},
										refetchQueries: [
											{
												query: USER_QUERY,
												variables: {
													user_id: user?.me?.user_id,
												},
											},
											{
												query: USERS_QUERY,
											},
										],
									});
								} catch (error) {
									console.log(error);
								}
								setSubmitting(false);
							}}
						>
							{({ values, isSubmitting }) => (
								<Form className='d-flex flex-column w-100 mt-3 align-items-left'>
									<div className='textfield'>
										<MyTextField
											name='first_name'
											label='first name'
											placeholder='first name'
											type='input'
											as={TextField}
											autoComplete='off'
										/>
									</div>
									<div className='textfield'>
										<MyTextField
											name='last_name'
											label='last name'
											placeholder='last name'
											type='input'
											as={TextField}
											autoComplete='off'
										/>
									</div>
									<div className='textfield'>
										<MyTextField
											name='email'
											label='email'
											placeholder='email'
											type='input'
											autoComplete='off'
											as={TextField}
											disabled={true}
										/>
									</div>
									<div className='textfield'>
										<MyTextField
											name='new_password'
											label='new password'
											placeholder='new password'
											type='password'
											autoComplete='off'
											as={TextField}
										/>
									</div>
									<div className='checkboxfield'>
										Admin:
										<Checkbox checked={admin} />
									</div>
									<div className='button-field mt-3'>
										<Button
											color='primary'
											disabled={isSubmitting}
											type='submit'
											className='form-button'
										>
											Save Changes
										</Button>
									</div>
								</Form>
							)}
						</Formik>
					</section>
				</ThemeProvider>
			)}
		</>
	);
};
export default UserProfile;
