import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Checkbox, Chip, TextField, ThemeProvider } from '@mui/material';
import exifr from 'exifr';
import { Form, Formik, useField } from 'formik';
import _, { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Dropzone from 'react-dropzone';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import * as yup from 'yup';
import {
	CREATE_IMAGE_TAG,
	DELETE_IMAGE_TAG,
	UPDATE_IMAGE,
} from '../mutations/imageMutations';
import {
	GET_IMAGES_BY_TAG_NAME,
	GET_IMAGE_TAGS,
	GET_IMAGE_TAGS_BY_IMAGE_ID,
	GET_LATEST_VERSION_IMAGES,
} from '../queries/imageQueries';
import {
	USER_SHOPPING_CART,
	USER_SHOPPING_CART_IMAGES,
} from '../queries/shoppingCartQueries';
import '../scss/AddImageModal.scss';
import '../scss/EditImageModal.scss';
import { theme } from '../style/themes';
import ActionButton from './ActionButton';

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

const EditImageModal = ({ imageToEdit, adminImageCard = false }) => {
	const {
		image_id: imgId,
		title: imgTitle,
		price: imgPrice,
		uses: imgUses,
		image_url: imgUrl,
		description: imgDescription,
		distributable: imgDistributable,
		journalist: imgJournalist,
	} = imageToEdit;

	const { data: itsData } = useQuery(GET_IMAGE_TAGS_BY_IMAGE_ID, {
		variables: {
			image_id: imgId,
		},
	});

	const { user, isLoading, isError, isSuccess, message } = useSelector(
		state => state.auth
	);

	const [updateImage, { data: imgData }] = useMutation(UPDATE_IMAGE);

	const [createImageTag] = useMutation(CREATE_IMAGE_TAG);
	const [deleteImageTag] = useMutation(DELETE_IMAGE_TAG);
	const [show, setShow] = useState(false);
	const [distributable, setDistributable] = useState(imgDistributable);
	const [oldTags, setOldTags] = useState(new Set());
	const [tags, setTags] = useState(new Set());
	const [tagInputValue, setTagInputValue] = useState('');

	const tagsSet = new Set();

	useEffect(() => {
		if (itsData?.image_tags_by_image_id && show) {
			for (const imgTag of itsData?.image_tags_by_image_id) {
				tagsSet.add(imgTag?.tag?.name);
			}
		}
		setTags(new Set(tagsSet));
		setOldTags(new Set(tagsSet));
	}, [itsData, show]);

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
		setTagInputValue('');
	};
	const handleShow = () => setShow(true);

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
		uses: yup.number().integer().positive().min(0),
		journalist: yup.string().max(255),
	});

	return (
		<>
			<ActionButton
				variant='outlined'
				color='primary'
				className={`btn ${adminImageCard ? 'w-100 p-3' : 'p-2'}`}
				onClick={handleShow}
				startIcon={adminImageCard && <FaEdit />}
			>
				{adminImageCard ? <span>Edit Image</span> : <FaEdit />}
			</ActionButton>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Edit Image</Modal.Title>
				</Modal.Header>
				<Modal.Body className='d-flex justify-content-center'>
					<ThemeProvider theme={theme}>
						<Formik
							validationSchema={schema}
							initialValues={{
								title: imgTitle || '',
								price: imgPrice || '',
								description: imgDescription || '',
								uses: imgUses || imgUses >= 0 ? imgUses : '',
								journalist: imgJournalist || '',
							}}
							onSubmit={async (data, { setSubmitting }) => {
								setSubmitting(true);
								try {
									const { title, price, description, uses, journalist } = data;

									if (
										title !== imgTitle ||
										price !== imgPrice ||
										description !== imgDescription ||
										uses !== imgUses ||
										journalist !== imgJournalist ||
										image ||
										distributable !== imgDistributable ||
										!_.isEqual(oldTags, tags)
									) {
										let GPSLatitude, GPSLongitude, Model;

										if (image) {
											({ GPSLatitude, GPSLongitude, Model } = await exifr.parse(
												image,
												true
											));
										}

										const refetchQueries = Array.from(oldTags).map(tagName => ({
											query: GET_IMAGES_BY_TAG_NAME,
											variables: {
												tag_name: tagName,
											},
										}));

										const newImage = await updateImage({
											variables: {
												image_id: parseInt(imgId),
												title,
												price: price ? parseFloat(price) : null,
												description,
												uses: uses && distributable ? parseInt(uses) : 0,
												journalist,
												distributable,
												image_url: image ? null : imgUrl || null,
												coordinates:
													GPSLatitude && GPSLongitude
														? `${GPSLatitude}, ${GPSLongitude}`
														: null,
												camera_type: Model,
												image_file: image || null,
												format: image?.type || null,
												last_modified: image?.lastModified
													? getNowDateISOString()
													: null,
												size: image?.size || null,
											},
											refetchQueries: [
												{
													query: GET_LATEST_VERSION_IMAGES,
												},
												{
													query: USER_SHOPPING_CART_IMAGES,
													variables: {
														shopping_cart_id:
															user?.shopping_cart?.shopping_cart_id,
													},
												},
												{
													query: USER_SHOPPING_CART,
													variables: {
														user_id: user?.me?.user_id,
													},
												},
												{
													query: GET_IMAGE_TAGS,
												},
												...refetchQueries,
											],
										});

										const { image_id: new_image_id } =
											newImage?.data?.updateImage;

										for (const tagName of Array.from(tags)) {
											await createImageTag({
												variables: {
													image_id: new_image_id,
													name: tagName,
												},
												refetchQueries: [
													{
														query: GET_IMAGES_BY_TAG_NAME,
														variables: {
															tag_name: tagName,
														},
													},
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
																image_id: new_image_id,
															},
														}) || {};

													if (image_tags_by_image_id) {
														cache.writeQuery({
															query: GET_IMAGE_TAGS_BY_IMAGE_ID,
															variables: {
																image_id: new_image_id,
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
									}
								} catch (error) {
									console.log(error);
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
																className='tag-chip'
																color='primary'
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
											checked={distributable}
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
											variant='outlined'
											color='primary'
											disabled={isSubmitting}
											type='submit'
											className='btn form-button'
										>
											Save Changes
										</ActionButton>
										<ActionButton
											className='btn close-modal-button'
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

export default React.memo(EditImageModal);
