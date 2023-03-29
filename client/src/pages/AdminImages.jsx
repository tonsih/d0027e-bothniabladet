import { useQuery } from '@apollo/client';
import { FaPlus } from 'react-icons/fa';
import ActionButton from '../components/ActionButton';
import AddProductModal from '../components/AddProductModal';
import ProductRow from '../components/ProductRow';
import Spinner from '../components/Spinner';
import { GET_PRODUCTS } from '../queries/productQueries';
import '../scss/AdminProducts.scss';

const AdminProducts = () => {
	const { data, loading } = useQuery(GET_PRODUCTS);

	if (loading) return <Spinner />;

	return (
		<>
			<section>
				<AddProductModal />
				<table className='table table-dark table-hover'>
					<thead>
						<tr>
							<th scope='col'>ID</th>
							<th scope='col'>Image</th>
							<th scope='col'>Title</th>
							<th scope='col'>Price</th>
							<th scope='col'>Amount</th>
							<th scope='col'>Description</th>
							<th scope='col'>Edit</th>
							<th scope='col'>Delete</th>
						</tr>
					</thead>
					<tbody>
						{data.products.map(product => (
							<ProductRow product={product} key={product.product_id} />
						))}
					</tbody>
				</table>
			</section>
		</>
	);
};
export default AdminProducts;
