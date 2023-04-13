import { useQuery } from '@apollo/client';
import Images from '../components/Images';
import { GET_IMAGES } from '../queries/imageQueries';
import Spinner from '../components/Spinner';

const Home = () => {
	const { loading, error, data } = useQuery(GET_IMAGES);

	if (loading) return <Spinner />;
	if (error) return <p>Something went wrong</p>;
	return <Images images={!loading && !error && data?.images} />;
};
export default Home;
