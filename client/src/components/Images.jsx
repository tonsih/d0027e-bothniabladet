import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../queries/productQueries';
import ProductCard from './ProductCard';
import Spinner from './Spinner';

const Products = () => {
	const { loading, error, data } = useQuery(GET_PRODUCTS);

	if (loading) return <Spinner />;
	if (error) return <p>Something went wrong</p>;

	return (
		<>
			<div className='row'>
				{!loading &&
					!error &&
					data.products.map(product => (
						<div
							className='col-sm-12 col-md-6 col-lg-4 col-xl-4 pb-3'
							key={product.product_id}
						>
							<ProductCard key={product.product_id} product={product} />
						</div>
					))}
			</div>
		</>
	);
};
export default Products;
