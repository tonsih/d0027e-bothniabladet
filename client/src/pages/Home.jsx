import { useQuery } from '@apollo/client';
import Images from '../components/Images';
import Spinner from '../components/Spinner';
import { GET_LATEST_VERSION_IMAGES } from '../queries/imageQueries';
import {
	TextField,
	ThemeProvider,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import '../scss/Home.scss';
import { theme } from '../style/themes';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import SearchFieldWithImages from '../components/SearchFieldWithImages';

const Home = () => {
	const { loading, error, data } = useQuery(GET_LATEST_VERSION_IMAGES);

	const [images, setImages] = useState([]);

	const theme = useTheme();
	const isMdWidth = useMediaQuery(theme.breakpoints.down('md'));
	const isMax992 = useMediaQuery('(max-width:992px)');

	useEffect(() => {
		if (data?.latest_version_images) {
			let imgArr = [];
			for (const image of data?.latest_version_images) {
				const { image: img } = image;
				const { uses, distributable, deleted } = img;
				if (uses > 0 && distributable && !deleted) {
					{
						imgArr.push(img);
					}
				}
			}
			setImages(imgArr);
		}
	}, [data]);

	if (loading) return <Spinner />;
	if (error) return <p>Something went wrong</p>;
	return (
		<>
			{isMax992 ? (
				<section
					className={
						isMax992
							? 'admin-img-card d-flex flex-column justify-content-center align-items-center'
							: 'table-responsive'
					}
				>
					<SearchFieldWithImages images={images} ImagesComponent={Images} />
				</section>
			) : (
				<SearchFieldWithImages images={images} ImagesComponent={Images} />
			)}
		</>
	);
};
export default Home;
