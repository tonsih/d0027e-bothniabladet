import { useQuery } from '@apollo/client';
import { GET_IMAGES_BY_TAG_NAME } from '../queries/imageQueries';
import Spinner from '../components/Spinner';
import { useParams } from 'react-router-dom';
import ImageCard from '../components/ImageCard';

const CategoryPage = () => {
	const { category: tagName } = useParams();
	const { loading, error, data } = useQuery(GET_IMAGES_BY_TAG_NAME, {
		variables: { tag_name: tagName },
	});

	if (loading) return <Spinner />;
	if (error) return <p>Something went wrong</p>;

	return (
		<>
			<div className='row'>
				{!loading &&
					!error &&
					data?.images_by_tag_name &&
					data?.images_by_tag_name.map(image => (
						<div
							className='col-sm-12 col-md-6 col-lg-4 col-xl-4 pb-3'
							key={image.image_id}
						>
							<ImageCard key={image.image_id} image={image} />
						</div>
					))}
			</div>
		</>
	);
};
export default CategoryPage;
