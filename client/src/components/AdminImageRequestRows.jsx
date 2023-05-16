import AdminImageRequestRow from './AdminImageRequestRow';

const AdminImageRequestRows = ({ images }) => {
	return (
		<table className='table table-dark table-hover'>
			<thead>
				<tr>
					<th scope='col'>ID</th>
					<th scope='col'>Image</th>
					<th scope='col'>Title</th>
					<th scope='col'>Email</th>
					<th scope='col'>Description</th>
					<th scope='col'>Journalist</th>
					<th scope='col'>Add</th>
					<th scope='col'>Delete</th>
				</tr>
			</thead>
			<tbody>
				{images.map(requestedImage => (
					<AdminImageRequestRow
						key={requestedImage.requested_image_id}
						requestedImage={requestedImage}
					/>
				))}
			</tbody>
		</table>
	);
};
export default AdminImageRequestRows;
