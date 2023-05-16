import { useQuery } from '@apollo/client';
import { useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import AdminImageRequestCards from '../components/AdminImageRequestCards';
import AdminImageRequestRows from '../components/AdminImageRequestRows';
import SearchFieldWithImages from '../components/SearchFieldWithImages';
import { GET_REQUESTED_IMAGES } from '../queries/imageQueries';
import '../scss/AdminImages.scss';

const AdminImageRequests = () => {
	const { data: reqImgsData } = useQuery(GET_REQUESTED_IMAGES);
	const theme = useTheme();
	const isMdWidth = useMediaQuery(theme.breakpoints.down('md'));
	const isMax992 = useMediaQuery('(max-width:992px)');

	const [requestedImages, setRequestedImages] = useState([]);

	useEffect(() => {
		let reqImgsArr = [];
		if (reqImgsData) {
			reqImgsData?.requested_images.forEach(reqImg => reqImgsArr.push(reqImg));
			setRequestedImages(reqImgsArr);
		}
	}, [reqImgsData]);

	return (
		<section
			className={
				isMax992
					? 'admin-img-card d-flex flex-column justify-content-center align-items-center'
					: 'table-responsive'
			}
		>
			{isMax992 ? (
				requestedImages && (
					<SearchFieldWithImages
						images={requestedImages}
						ImagesComponent={AdminImageRequestCards}
						id='admin-image-search-field-992px'
					/>
				)
			) : (
				<>
					{/* {data?.latest_version_images &&
								data?.latest_version_images.map(image => {})} */}
					{requestedImages && (
						<SearchFieldWithImages
							images={requestedImages}
							ImagesComponent={AdminImageRequestRows}
							id='admin-image-search-field'
						/>
					)}
				</>
			)}
		</section>
	);
};
export default AdminImageRequests;
