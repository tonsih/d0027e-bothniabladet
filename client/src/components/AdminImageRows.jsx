import AdminImageRow from './AdminImageRow';

const AdminImageRows = ({ images }) => {
	return (
		<>
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
						<th scope='col'>Version History</th>
						<th scope='col'>Edit</th>
						<th scope='col'>Delete</th>
					</tr>
				</thead>
				<tbody>
					{images.map(
						image =>
							!image.deleted && (
								<AdminImageRow key={image.image_id} image={image} />
							)
					)}
				</tbody>
			</table>
		</>
	);
};
export default AdminImageRows;
