import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import ImageCard from '../components/ImageCard';
import Spinner from '../components/Spinner';
import { GET_IMAGES_BY_TAG_NAME } from '../queries/imageQueries';
import SearchFieldWithImages from '../components/SearchFieldWithImages';
import { useEffect, useState } from 'react';

const CategoryPage = () => {
	const { category: tagName } = useParams();
	const { loading, error, data } = useQuery(GET_IMAGES_BY_TAG_NAME, {
		variables: { tag_name: tagName },
	});

	const [images, setImages] = useState([]);

	useEffect(() => {
		if (data?.images_by_tag_name) {
			let imgArr = [];
			for (const image of data?.images_by_tag_name) {
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
export default CategoryPage;
