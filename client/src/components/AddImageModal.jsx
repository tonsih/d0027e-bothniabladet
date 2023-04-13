import { Field, Form, Formik, useField } from 'formik';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaPlus } from 'react-icons/fa';
import ActionButton from './ActionButton';
import * as yup from 'yup';
import { TextareaAutosize, TextField, ThemeProvider } from '@mui/material';
import { theme } from '../style/themes';
import { ADD_IMAGE, ADD_TECHNICAL_METADATA } from '../mutations/imageMutations';
import { gql, useMutation } from '@apollo/client';
import { GET_IMAGES } from '../queries/imageQueries';
import Dropzone from 'react-dropzone';
import exifr from 'exifr';

const AddImageModal = () => {
	const uploadFileMutation = gql`
		mutation ($file: Upload!) {
			uploadFile(file: $file)
		}
	`;

	const [uploadFile] = useMutation(uploadFileMutation);

	const [addImage, { data: imgData }] = useMutation(ADD_IMAGE);
	const [addTechnicalMetadata, { data: tmData }] = useMutation(
		ADD_TECHNICAL_METADATA
	);
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const handleSubmit = () => {
		handleClose();
	};

	const [image, setImage] = useState(null);

	const schema = yup.object({
		title: yup.string().required().min(1).max(50),
		price: yup.number().required(),
		description: yup.string().required().max(255),
		uses: yup.number().integer().required(),
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
				<h6 className='p-0 m-0'>Add Image</h6>
			</ActionButton>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Add Image</Modal.Title>
				</Modal.Header>
				<Modal.Body className='d-flex justify-content-center'>
					<ThemeProvider theme={theme}>
						<Formik
							validationSchema={schema}
							initialValues={{
								title: '',
								price: '',
								description: '',
								uses: '',
							}}
							onSubmit={async (data, { setSubmitting }) => {
								setSubmitting(true);
								const { title, price, description, uses } = data;

								let { GPSLatitude, GPSLongitude, Model } = await exifr.parse(
									image,
									true
								);

								try {
									await addImage({
										variables: {
											title,
											price: parseFloat(price),
											description,
											uses: parseInt(uses),
											coordinates: `${GPSLatitude}, ${GPSLongitude}`,
											camera_type: Model,
											image_file: image,
											format: image.type,
											last_modified: new Date(image.lastModified),
											size: image.size,
										},
										refetchQueries: [
											{
												query: GET_IMAGES,
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
											name='uses'
											label='uses'
											placeholder='uses'
											type='input'
											as={TextField}
										/>
									</div>
									<Dropzone
										accept={{ 'image/*': ['.jpeg', '.png'] }}
										maxFiles={1}
										maxSize={10000000}
										onDrop={([file]) => {
											setImage(file);
										}}
									>
										{({ getRootProps, getInputProps }) => (
											<section>
												<div {...getRootProps()}>
													<input {...getInputProps()} />
													<p>
														Drag 'n' drop some files here, or click to select
														files
													</p>
												</div>
											</section>
										)}
									</Dropzone>
									<Modal.Footer>
										<Button
											color='primary'
											disabled={isSubmitting}
											type='submit'
											className='form-button'
											onClick={handleSubmit}
										>
											Save Changes
										</Button>
										<Button variant='secondary' onClick={handleClose}>
											Close
										</Button>
									</Modal.Footer>
								</Form>
							)}
						</Formik>
					</ThemeProvider>
				</Modal.Body>
			</Modal>
		</>
	);
};
export default AddImageModal;
