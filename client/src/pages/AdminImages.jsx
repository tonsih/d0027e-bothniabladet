import { useQuery } from '@apollo/client';
import { useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AddImageModal from '../components/AddImageModal';
import AdminImageCards from '../components/AdminImageCards';
import AdminImageRows from '../components/AdminImageRows';
import SearchFieldWithImages from '../components/SearchFieldWithImages';
import Spinner from '../components/Spinner';
import { GET_LATEST_VERSION_IMAGES } from '../queries/imageQueries';
import '../scss/AdminImages.scss';
import '../scss/Buttons.scss';

const AdminImages = () => {
	const navigate = useNavigate();
	const { data, loading } = useQuery(GET_LATEST_VERSION_IMAGES);
	const { user } = useSelector(state => state.auth);

	const theme = useTheme();
	const isMdWidth = useMediaQuery(theme.breakpoints.down('md'));
	const isMax992 = useMediaQuery('(max-width:992px)');

	const [images, setImages] = useState([]);

	useEffect(() => {
		let imgArr = [];
		if (data?.latest_version_images) {
			data.latest_version_images.forEach(verImg => imgArr.push(verImg.image));
			setImages(imgArr);
		}
	}, [data]);

	useEffect(() => {
		if (!user || !user.me || user.me.banned || !user.me.admin) {
			navigate('/');
		}
	}, [user, navigate]);

	if (loading) return <Spinner />;

	return (
		<>
			<section
				className={
					isMax992
						? 'admin-img-card d-flex flex-column justify-content-center align-items-center'
						: 'table-responsive mt-3 mb-5'
				}
			>
				<AddImageModal
					adminImageCard={isMax992}
					id={`add-image-button${isMax992 && '-992px'}`}
				/>
				{isMax992 ? (
					images && (
						<SearchFieldWithImages
							images={images}
							ImagesComponent={AdminImageCards}
							id='admin-image-search-field-992px'
						/>
					)
				) : (
					<>
						{images && (
							<SearchFieldWithImages
								images={images}
								ImagesComponent={AdminImageRows}
								id='admin-image-search-field'
							/>
						)}
					</>
				)}
			</section>
		</>
	);
};
export default AdminImages;
