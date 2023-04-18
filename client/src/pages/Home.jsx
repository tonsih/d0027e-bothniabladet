import { useQuery } from '@apollo/client';
import Images from '../components/Images';
import { GET_LATEST_VERSION_IMAGES } from '../queries/imageQueries';
import Spinner from '../components/Spinner';

const Home = () => {
	const { loading, error, data } = useQuery(GET_LATEST_VERSION_IMAGES);

	console.log(data);

	const images = [];

	if (data?.latest_version_images) {
		for (const image of data?.latest_version_images) {
			const { uses, distributable } = image?.image;
			if (uses > 0 && distributable) {
				images.push(image?.image);
			}
		}
	}

	console.log(images);

	if (loading) return <Spinner />;
	if (error) return <p>Something went wrong</p>;
	if (images.length <= 0) return <p>No items available</p>;
	return <Images images={!loading && !error && images} />;
};
export default Home;
