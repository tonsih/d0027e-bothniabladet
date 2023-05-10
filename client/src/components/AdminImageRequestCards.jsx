import { useEffect, useState } from 'react';
import AdminImageRequestCard from './AdminImageRequestCard';
import ComponentSlider from './ComponentSlider';

const AdminImageRequestCards = ({ images }) => {
	const [imgCards, setImgCards] = useState([]);

	useEffect(() => {
		let imgCardsArr = [];
		images.forEach(image => {
			if (!image.deleted) {
				imgCardsArr.push(
					<AdminImageRequestCard key={image.image_id} image={image} />
				);
			}
		});
		setImgCards(imgCardsArr);
	}, [images]);

	return <>{<ComponentSlider components={imgCards} />}</>;
};
export default AdminImageRequestCards;
