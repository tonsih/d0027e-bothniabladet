import { useQuery } from '@apollo/client';
import AddImageModal from '../components/AddImageModal';
import ImageRow from '../components/ImageRow';
import Spinner from '../components/Spinner';
import { GET_IMAGES } from '../queries/imageQueries';
import '../scss/AdminImages.scss';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminImages = () => {
	const navigate = useNavigate();
	const { data, loading } = useQuery(GET_IMAGES);
	const { user } = useSelector(state => state.auth);

	useEffect(() => {
		if (!user || !user.me || user.me.banned || !user.me.admin) {
			navigate('/');
		}
	}, [user, navigate]);

	if (loading) return <Spinner />;

	return (
		<>
			<section>
				<AddImageModal />
				<table className='table table-dark table-hover'>
					<thead>
						<tr>
							<th scope='col'>ID</th>
							<th scope='col'>Image</th>
							<th scope='col'>Title</th>
							<th scope='col'>Price</th>
							<th scope='col'>Distributable</th>
							<th scope='col'>Uses</th>
							<th scope='col'>Description</th>
							<th scope='col'>Journalist</th>
							<th scope='col'>View Metadata</th>
							<th scope='col'>Edit</th>
							<th scope='col'>Delete</th>
						</tr>
					</thead>
					<tbody>
						{data?.images &&
							data.images.map(image => (
								<ImageRow image={image} key={image.image_id} />
							))}
					</tbody>
				</table>
			</section>
		</>
	);
};
export default AdminImages;
