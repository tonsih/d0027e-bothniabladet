import { useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ActionButton from '../components/ActionButton';
import VersionHistoryImageRow from '../components/VersionHistoryImageRow';
import { GET_ALL_IMAGE_VERSIONS } from '../queries/imageQueries';

const VersionHistory = () => {
	const { image: imgId } = useParams();
	const [getImgsData, { data: imgsData }] = useLazyQuery(
		GET_ALL_IMAGE_VERSIONS
	);

	useEffect(() => {
		if (imgId)
			getImgsData({
				variables: { image_id: imgId },
			});
	}, [imgId]);

	return (
		<section>
			<Link to={`/admin/images`}>
				<ActionButton variant='outlined' color='primary' className='w-100 p-3'>
					Go back to image admin panel
				</ActionButton>
			</Link>
			<table className='table table-dark table-hover'>
				<thead>
					<tr>
						<th scope='col'>ID</th>
						<th scope='col'>Version No.</th>
						<th scope='col'>Image</th>
						<th scope='col'>View Details</th>
						{/* <th scope='col'>Title</th>
						<th scope='col'>Price</th>
						<th scope='col'>Distributable</th>
						<th scope='col'>Uses</th>
						<th scope='col'>Description</th>
						<th scope='col'>Journalist</th> */}
						<th scope='col'>View Metadata</th>
					</tr>
				</thead>
				<tbody>
					{imgsData?.all_versions_image &&
						imgsData?.all_versions_image.map(image => (
							<VersionHistoryImageRow
								image={image}
								key={image.image.image_id}
							/>
						))}
				</tbody>
			</table>
		</section>
	);
};
export default VersionHistory;
