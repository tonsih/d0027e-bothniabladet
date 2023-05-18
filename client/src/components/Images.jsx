import { useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import ComponentSlider from './ComponentSlider';
import ImageCard from './ImageCard';

const Images = ({ images }) => {
	const [imgComps, setimgComps] = useState([]);

	const theme = useTheme();
	const isMdWidth = useMediaQuery(theme.breakpoints.down('md'));
	const isMax992 = useMediaQuery('(max-width:992px)');

	useEffect(() => {
		let imgCompArr = [];
		images.forEach(image => {
			const { deleted, uses, image_id, distributable } = image;

			if (!deleted & (uses > 0) & distributable) {
				imgCompArr.push(<ImageCard key={image_id} image={image} />);
			}
		});
		setimgComps(imgCompArr);
	}, [images]);

	return (
		<>
			<div className='row'>
				{isMax992 ? (
					<ComponentSlider components={imgComps} />
				) : (
					imgComps.map((image, i) => (
						<div key={i} className='col-sm-12 col-md-6 col-lg-4 col-xl-4 pb-3'>
							{image}
						</div>
					))
				)}
			</div>
		</>
	);
};
export default Images;
