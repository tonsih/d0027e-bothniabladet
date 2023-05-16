import { TextField, ThemeProvider } from '@mui/material';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { theme } from '../style/themes';

const SearchFieldWithImages = ({
	images,
	ImagesComponent,
	id = 'search-field',
}) => {
	const [searchWord, setSearchWord] = useState('');
	const [filteredImages, setFilteredImages] = useState([]);

	const handleSearch = e => {
		setSearchWord(e.target.value);
	};

	useEffect(() => {
		let imgArr = [];
		for (let img of images) {
			const { title } = img;
			if (
				_.isEmpty(searchWord) ||
				title.toLowerCase().includes(searchWord.trim().toLowerCase())
			) {
				imgArr.push(img);
			}
		}
		setFilteredImages(imgArr);
	}, [images, searchWord]);

	return (
		<>
			<ThemeProvider theme={theme}>
				<TextField
					id={id}
					className='search-field'
					label='Search'
					variant='outlined'
					value={searchWord}
					onChange={handleSearch}
				/>
				<div className='images-container mt-3'>
					{filteredImages.length > 0 ? (
						<ImagesComponent images={filteredImages} />
					) : !_.isEmpty(searchWord) ? (
						<p>No items found</p>
					) : (
						<p>No items available</p>
					)}
				</div>
			</ThemeProvider>
		</>
	);
};

export default SearchFieldWithImages;
