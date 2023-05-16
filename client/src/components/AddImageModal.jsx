import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { Checkbox, Chip, TextField, ThemeProvider } from '@mui/material';
import exifr from 'exifr';
import { Form, Formik, useField } from 'formik';
import { isEmpty } from 'lodash';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Dropzone from 'react-dropzone';
import { FaPlus, FaTrash } from 'react-icons/fa';
import * as yup from 'yup';
import {
	ADD_IMAGE,
	ADD_TECHNICAL_METADATA,
	CREATE_IMAGE_TAG,
	DELETE_REQUESTED_IMAGE,
} from '../mutations/imageMutations';
import {
	GET_IMAGES_BY_TAG_NAME,
	GET_IMAGE_TAGS,
	GET_IMAGE_TAGS_BY_IMAGE_ID,
	GET_LATEST_VERSION_IMAGES,
	GET_REQUESTED_IMAGES,
	GET_REQUESTED_IMAGE_FILE,
} from '../queries/imageQueries';
import '../scss/AddImageModal.scss';
import '../scss/Buttons.scss';
import '../scss/TextField.scss';
import { theme } from '../style/themes';
import ActionButton from './ActionButton';

const base64toFile = (base64Data, fileName, mimeType) => {
	const byteString = atob(base64Data);
	const bytes = new Uint8Array(byteString.length);
	for (let i = 0; i < byteString.length; i++) {
		bytes[i] = byteString.charCodeAt(i);
	}
	return new File([bytes], fileName, { type: mimeType });
};

const MyTextField = ({
	placeholder,
	label,
	type,
	multiline,
	rows,
	className,
	autoComplete,
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
		/>
	);
};

const MyTagTextField = ({
	placeholder,
	label,
	type,
	multiline,
	rows,
	onChange,
	value,
	onKeyDown,
	className,
	autoComplete,
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
			onChange={onChange}
			value={value}
			onKeyDown={onKeyDown}
			className={className}
			autoComplete={autoComplete}
		/>
	);
};

const AddImageModal = ({
	adminImageCard,
	id,
	ButtonInnerComponent = () => <h6 className='p-0 m-0'>Add Image</h6>,
	image: img = null,
}) => {
	const uploadFileMutation = gql`
		mutation ($file: Upload!) {
			uploadFile(file: $file)
		}
	`;

	const {
		requested_image_id: reqImgId,
		image_id: imgId,
		title: imgTitle,
		price: imgPrice,
		description: imgDescription,
		uses: imgUses,
		journalist: imgJournalist,
		image_url: imgUrl,
	} = img || {};

	const [uploadFile] = useMutation(uploadFileMutation);

	const [addImage, { data: imgData }] = useMutation(ADD_IMAGE);
	const [addTechnicalMetadata, { data: tmData }] = useMutation(
		ADD_TECHNICAL_METADATA
	);

	const [deleteRequestedImage] = useMutation(DELETE_REQUESTED_IMAGE);

	const [getITBIData, { refetch: refetchITBI }] = useLazyQuery(
		GET_IMAGE_TAGS_BY_IMAGE_ID
	);

	const [getReqImgFileData, { data: reqImgFileData }] = useLazyQuery(
		GET_REQUESTED_IMAGE_FILE
	);

	const [createImageTag, { data: itData }] = useMutation(CREATE_IMAGE_TAG);
	const [show, setShow] = useState(false);
	const [distributable, setDistributable] = useState(false);
	const [tags, setTags] = useState(new Set());
	const [tagInputValue, setTagInputValue] = useState('');

	const handleAddTag = tag => {
		if (!isEmpty(tag)) {
			const newSet = new Set(tags);
			newSet.add(tag);
			setTags(newSet);
			setTagInputValue('');
		}
	};

	const handleRemoveTag = (index, tags, setTags) => {
		const tagsArray = Array.from(tags);
		tagsArray.splice(index, 1);
		setTags(new Set(tagsArray));
	};

	const handleClose = () => {
		setShow(false);
		setImage(null);
		setThumbnail(null);
		setDistributable(false);
		setTagInputValue('');
		setTags(new Set());
	};
	const handleShow = () => setShow(true);

	const [requestedImage, setRequestedImage] = useState(null);

	const [image, setImage] = useState(null);
	const [thumbnail, setThumbnail] = useState(null);

	const imageToThumbnail = image => {
		const reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = () => {
			setThumbnail(reader.result);
		};
	};

	const schema = yup.object({
		title: yup.string().required().min(1).max(50),
		price: yup.number().required().positive(),
		description: yup.string().max(255),
		uses: yup.number().integer().positive(),
		journalist: yup.string().max(255),
	});

	useEffect(() => {
		if (reqImgId) {
			getReqImgFileData({
				variables: { requested_image_id: reqImgId },
			});
		}
	}, [reqImgId]);

	useEffect(() => {
		if (reqImgFileData?.requested_image_file?.data && show) {
			const {
				data,
				mime_type: mimeType,
				filename,
			} = reqImgFileData?.requested_image_file;

			const file = base64toFile(
				reqImgFileData?.requested_image_file?.data,
				filename,
				mimeType
			);
			setRequestedImage(file);
		}
	}, [reqImgFileData, show]);

	return (
		<>
			<ActionButton
				variant='outlined'
				color='primary'
				className={`btn ${adminImageCard ? 'w-75 p-3' : 'p-2'}`}
				onClick={handleShow}
				startIcon={adminImageCard && <FaPlus />}
				id={id}
			>
				<ButtonInnerComponent />
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
								title: imgTitle || '',
								price: imgPrice || '',
								description: imgDescription || '',
								uses: imgUses || 1,
								journalist: imgJournalist || '',
							}}
							onSubmit={async (data, { setSubmitting }) => {
								setSubmitting(true);
								const { title, price, description, uses, journalist } = data;

								if (title && price) {
									let GPSLatitude, GPSLongitude, Model;

									if (image || requestedImage) {
										({ GPSLatitude, GPSLongitude, Model } = await exifr.parse(
											image || requestedImage,
											true
										));
									}

									try {
										const imageModifiedDate = (image || requestedImage)
											?.lastModified
											? DateTime.fromMillis(
													(image || requestedImage).lastModified
											  )
													.setZone('Europe/Stockholm')
													.toJSDate()
													.toLocaleString('en-US', {
														timeZone: 'Europe/Stockholm',
													})
											: null;

										const isoModifiedDate = imageModifiedDate
											? new Date(imageModifiedDate)
											: null;
										if (isoModifiedDate) {
											isoModifiedDate.setHours(isoModifiedDate.getHours() + 2);
										}
										const isoModifiedDateString = isoModifiedDate
											? isoModifiedDate.toISOString()
											: null;

										const addedImage = await addImage({
											variables: {
												title,
												price: price ? parseFloat(price) : null,
												description,
												uses: uses && distributable ? parseInt(uses) : 0,
												journalist,
												distributable,
												coordinates:
													GPSLatitude && GPSLongitude
														? `${GPSLatitude}, ${GPSLongitude}`
														: null,
												camera_type: Model,
												image_file: image || requestedImage || null,
												format: (image || requestedImage)?.type || null,
												last_modified: (image || requestedImage)?.lastModified
													? isoModifiedDateString
													: null,
												size: (image || requestedImage)?.size || null,
											},
											// refetchQueries: [
											// 	{
											// 		query: GET_LATEST_VERSION_IMAGES,
											// 	},
											// ],
											update(cache, { data: { addImage } }) {
												const { latest_version_images } =
													cache.readQuery({
														query: GET_LATEST_VERSION_IMAGES,
													}) || {};

												if (latest_version_images) {
													cache.writeQuery({
														query: GET_LATEST_VERSION_IMAGES,
														data: {
															latest_version_images: [
																...latest_version_images,
																addImage,
															],
														},
													});
												}
											},
										});

										const { image_id } = addedImage?.data?.addImage?.image;

										for (const tagName of Array.from(tags)) {
											await createImageTag({
												variables: {
													image_id,
													name: tagName,
												},
												refetchQueries: [
													// {
													// 	query: GET_IMAGE_TAGS,
													// },
													{
														query: GET_IMAGES_BY_TAG_NAME,
														variables: {
															tag_name: tagName,
														},
													},
													// {
													// 	query: GET_IMAGE_TAGS_BY_IMAGE_ID,
													// 	variables: {
													// 		image_id,
													// 	},
													// },
												],
												update(cache, { data: { createImageTag } }) {
													const { tag } = createImageTag;

													const { image_tags } =
														cache.readQuery({
															query: GET_IMAGE_TAGS,
														}) || {};

													if (image_tags) {
														cache.writeQuery({
															query: GET_IMAGE_TAGS,
															data: {
																image_tags: [...image_tags, createImageTag],
															},
														});
													}

													const { images_by_tag_name } =
														cache.readQuery({
															query: GET_IMAGES_BY_TAG_NAME,
															variables: {
																tag_name: tag?.name,
															},
														}) || {};

													if (images_by_tag_name) {
														cache.writeQuery({
															query: GET_IMAGES_BY_TAG_NAME,
															variables: {
																tag_name: tag?.name,
															},
															data: {
																images_by_tag_name: [
																	...images_by_tag_name,
																	createImageTag,
																],
															},
														});
													}

													const { image_tags_by_image_id } =
														cache.readQuery({
															query: GET_IMAGE_TAGS_BY_IMAGE_ID,
															variables: {
																image_id,
															},
														}) || {};

													if (image_tags_by_image_id) {
														cache.writeQuery({
															query: GET_IMAGE_TAGS_BY_IMAGE_ID,
															variables: {
																image_id,
															},
															data: {
																image_tags_by_image_id: [
																	...image_tags_by_image_id,
																	createImageTag,
																],
															},
														});
													}
												},
											});
										}

										if (requestedImage) {
											deleteRequestedImage({
												variables: {
													requested_image_id: reqImgId,
												},
												refetchQueries: [{ query: GET_REQUESTED_IMAGES }],
											});
										}
									} catch (error) {
										console.log(error);
									}
								}

								setSubmitting(false);
								handleClose();
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
											autoComplete='off'
										/>
									</div>
									<div className='textfield'>
										<MyTextField
											name='price'
											label='price'
											placeholder='price'
											type='input'
											as={TextField}
											autoComplete='off'
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
											autoComplete='off'
										/>
									</div>
									<div className='textfield'>
										<MyTagTextField
											name='tags'
											className='mr-3'
											label='tags'
											autoComplete='off'
											placeholder='tags'
											type='input'
											value={tagInputValue}
											onChange={e => setTagInputValue(e.target.value)}
											onKeyDown={e => {
												if (e.key === 'Enter') {
													e.preventDefault();
													handleAddTag(e.target.value);
													e.target.value = '';
												}
											}}
										/>
										<ActionButton
											onClick={() => {
												handleAddTag(tagInputValue);
											}}
											className='mt-3'
											id='add-tag-button'
											color='primary'
										>
											<FaPlus />
										</ActionButton>
										{tags && tags.size > 0 && (
											<div className='tags-container'>
												<ul className='list-unstyled d-flex flex-wrap mt-2'>
													{Array.from(tags).map((tag, index) => (
														<li key={index} className='tags-list-item'>
															<Chip
																label={tag}
																color='primary'
																className='tag-chip'
																onClick={() =>
																	handleRemoveTag(index, tags, setTags)
																}
																onDelete={() =>
																	handleRemoveTag(index, tags, setTags)
																}
															/>
														</li>
													))}
												</ul>
											</div>
										)}
									</div>
									<div className='checkboxfield'>
										Distributable:
										<Checkbox
											onChange={e => {
												setDistributable(e.target.checked);
											}}
										/>
									</div>
									{distributable && (
										<div className='textfield'>
											<MyTextField
												name='uses'
												autoComplete='off'
												label='uses'
												placeholder='uses'
												type='input'
												as={TextField}
											/>
										</div>
									)}
									<div className='textfield'>
										<MyTextField
											autoComplete='off'
											name='journalist'
											label='journalist'
											placeholder='journalist'
											type='input'
											as={TextField}
										/>
									</div>
									{!image ? (
										<Dropzone
											accept={{ 'image/*': ['.jpeg', '.png'] }}
											maxFiles={1}
											maxSize={10000000}
											onDrop={([file]) => {
												setImage(file);
												imageToThumbnail(file);
											}}
										>
											{({ getRootProps, getInputProps }) => (
												<section>
													<div {...getRootProps()}>
														<input {...getInputProps()} />
														<p className='dropzone-field'>
															Drag 'n' drop an image file here, or click to
															select the image file
														</p>
													</div>
												</section>
											)}
										</Dropzone>
									) : (
										<>
											<div className='imageUpload'>
												<div className='preview-info-container d-flex'>
													{image?.name}
													<ActionButton
														className='btn delete-image-button'
														id='delete-image-button'
														variant='outlined'
														color='secondary'
														onClick={() => {
															setImage(null);
															setThumbnail(null);
														}}
													>
														<FaTrash />
													</ActionButton>
												</div>
												<div className='image-preview p-2'>
													<span>Image preview</span>
													<img
														src={thumbnail}
														className='img-thumbnail'
														alt='thumbnail'
													/>
												</div>
											</div>
										</>
									)}

									{imgUrl && (
										<div className='current-img'>
											<div className='image-preview p-2'>
												<span>Current Image</span>
												<img
													src={imgUrl}
													className='current-img-thumbnail img-thumbnail'
													alt='Current image thumbnail'
												/>
											</div>
										</div>
									)}
									<Modal.Footer>
										<ActionButton
											disabled={isSubmitting}
											type='submit'
											className='form-button'
											variant='outlined'
											color='primary'
										>
											Save Changes
										</ActionButton>
										<ActionButton
											className='close-modal-button'
											variant='outlined'
											color='primary'
											onClick={handleClose}
										>
											Close
										</ActionButton>
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
