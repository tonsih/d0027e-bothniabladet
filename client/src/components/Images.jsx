import { useQuery } from '@apollo/client';
import ImageCard from './ImageCard';
import Spinner from './Spinner';

const Images = ({ images }) => {
	return (
		<>
			<div className='row'>
				{images.map(
					image =>
						image.uses > 0 &&
						image.distributable && (
							<div
								className='col-sm-12 col-md-6 col-lg-4 col-xl-4 pb-3'
								key={image.image_id}
							>
								<ImageCard key={image.image_id} image={image} />
							</div>
						)
				)}
			</div>
		</>
	);
};
export default Images;
