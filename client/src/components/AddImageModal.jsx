import { Field, Form, Formik, useField } from 'formik';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaPlus } from 'react-icons/fa';
import ActionButton from './ActionButton';
import * as yup from 'yup';
import { TextareaAutosize, TextField, ThemeProvider } from '@mui/material';
import { theme } from '../style/themes';

const AddProductModal = () => {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const schema = yup.object({
		title: yup.string().required().min(1).max(50),
		price: yup.string().required(),
		description: yup.string().required().max(255),
		amount_in_stock: yup.string().required(),
	});

	const MyTextField = ({
		placeholder,
		label,
		type,
		multiline,
		rows,
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
			/>
		);
	};

	return (
		<>
			<ActionButton
				variant='contained'
				color='green'
				startIcon={<FaPlus />}
				className='btn p-3'
				onClick={handleShow}
			>
				<h6 className='p-0 m-0'>Add product</h6>
			</ActionButton>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Add Product</Modal.Title>
				</Modal.Header>
				<Modal.Body className='d-flex justify-content-center'>
					<ThemeProvider theme={theme}>
						<Formik
							validationSchema={schema}
							initialValues={{ email: '', password: '' }}
							onSubmit={async (data, { setSubmitting }) => {
								setSubmitting(true);
								console.log(data);
								dispatch(login(data));
								setSubmitting(false);
							}}
						>
							{({ values, isSubmitting }) => (
								<Form className='d-flex flex-column w-100 mt-3 align-items-left'>
									<div className='textfield'>
										<MyTextField
											name='title'
											label='title'
											placeholder='title'
											type='input'
											as={TextField}
										/>
									</div>
									<div className='textfield'>
										<MyTextField
											name='price'
											label='price'
											placeholder='price'
											type='input'
											as={TextField}
										/>
									</div>
									<div className='textfield'>
										<MyTextField
											name='description'
											label='description'
											placeholder='description'
											type='input'
											multiline
											rows={4}
										/>
									</div>
									<div className='textfield'>
										<MyTextField
											name='amount_in_stock'
											label='amount in stock'
											placeholder='amount in stock'
											type='input'
											as={TextField}
										/>
									</div>
								</Form>
							)}
						</Formik>
					</ThemeProvider>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleClose}>
						Close
					</Button>
					<Button variant='primary' onClick={handleClose}>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};
export default AddProductModal;
