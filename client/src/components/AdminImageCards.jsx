import { useEffect, useState } from 'react';
import AdminImageCard from './AdminImageCard';
import ComponentSlider from './ComponentSlider';

const AdminImageCards = ({ images }) => {
	const [imgCards, setImgCards] = useState([]);

	useEffect(() => {
		let imgCardsArr = [];
		images.forEach(image => {
			if (!image.deleted) {
				imgCardsArr.push(<AdminImageCard key={image.image_id} image={image} />);
			}
		});
		setImgCards(imgCardsArr);
	}, [images]);

	return <>{<ComponentSlider components={imgCards} />}</>;
};
export default AdminImageCards;
