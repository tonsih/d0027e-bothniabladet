const OrderImageRow = ({ image }) => {
	const { image_id, image_url, title, price, description } = image?.image;
	console.log(image);

	return (
		<>
			<tr>
				<th scope='row'>{image_id}</th>
				<td className='w-25'>
					<img
						className='w-75'
						src={image_url || 'https://placehold.co/500x400'}
					/>
				</td>
				<td>{title}</td>
				<td>${price}</td>
				<td>{description}</td>
			</tr>
		</>
	);
};
export default OrderImageRow;
