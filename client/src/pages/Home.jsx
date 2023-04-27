import { useQuery } from '@apollo/client';
import Images from '../components/Images';
import Spinner from '../components/Spinner';
import { GET_LATEST_VERSION_IMAGES } from '../queries/imageQueries';
import { TextField, ThemeProvider } from '@mui/material';
import '../scss/Home.scss';
import { theme } from '../style/themes';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import SearchFieldWithImages from '../components/SearchFieldWithImages';

const Home = () => {
	const { loading, error, data } = useQuery(GET_LATEST_VERSION_IMAGES);

	const [images, setImages] = useState([]);

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
			<SearchFieldWithImages images={images} />
		</>
	);
};
export default Home;
